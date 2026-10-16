# Script khoi dong NetFit Backend & Ngrok chay ngam doc lap tren Windows

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  DANG KHOI DONG NETFIT BACKEND VA NGROK CHAY NGAM" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Kiem tra MySQL Service
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -ne "Running") {
    Write-Host "[1/4] Dang bat dich vu MySQL80..." -ForegroundColor Yellow
    Start-Service -Name "MySQL80" -ErrorAction SilentlyContinue
} else {
    Write-Host "[1/4] Dich vu MySQL80 dang chay binh thuong." -ForegroundColor Green
}

# 2. Don dep cac tien trinh cu
Write-Host "[2/4] Don dep cac tien trinh cu..." -ForegroundColor Yellow
Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

$port5007 = Get-NetTCPConnection -LocalPort 5007 -ErrorAction SilentlyContinue
if ($port5007) {
    $pids = $port5007 | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($p in $pids) {
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 1

# 3. Build & Khoi dong Backend (.NET 9 Web API) doc lap qua WMI
Write-Host "[3/4] Dang kiem tra va khoi dong Backend (.NET 9 Web API) tren cong 5007..." -ForegroundColor Yellow
$backendExe = "C:\Users\3DArchtech\.gemini\antigravity-ide\scratch\NetFit\backend\src\FitnessTrainingSystem.WebApi\bin\Debug\net9.0\FitnessTrainingSystem.WebApi.exe"
$backendDir = "C:\Users\3DArchtech\.gemini\antigravity-ide\scratch\NetFit\backend\src\FitnessTrainingSystem.WebApi"

Write-Host "  Dang build cap nhat ma nguon Backend..." -ForegroundColor Gray
dotnet build "$backendDir\FitnessTrainingSystem.WebApi.csproj" -v quiet --nologo

Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = "`"$backendExe`" --urls http://localhost:5007"
    CurrentDirectory = $backendDir
} | Out-Null

# Cho backend khoi dong
Write-Host "  Dang doi Backend san sang..." -ForegroundColor Gray
$backendReady = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:5007/" -Method Get -TimeoutSec 2 -ErrorAction Stop
        if ($res.status -eq "healthy") {
            $backendReady = $true
            break
        }
    } catch { }
}

if ($backendReady) {
    Write-Host "  -> Backend da chay thanh cong tai http://localhost:5007" -ForegroundColor Green
} else {
    Write-Host "  -> Backend da khoi dong." -ForegroundColor Yellow
}

# 4. Khoi dong Ngrok doc lap qua WMI
Write-Host "[4/4] Dang khoi dong Ngrok Tunnel..." -ForegroundColor Yellow
$ngrokExe = "C:\Users\3DArchtech\AppData\Roaming\npm\ngrok.exe"
$netfitDir = "C:\Users\3DArchtech\.gemini\antigravity-ide\scratch\NetFit"

Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = "`"$ngrokExe`" http 5007"
    CurrentDirectory = $netfitDir
} | Out-Null

# Doi Ngrok lay URL cong khai
Start-Sleep -Seconds 3
$ngrokUrl = ""
for ($j = 0; $j -lt 10; $j++) {
    try {
        $tunnelInfo = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2 -ErrorAction Stop
        $ngrokUrl = $tunnelInfo.tunnels[0].public_url
        if ($ngrokUrl) { break }
    } catch { }
    Start-Sleep -Seconds 1
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "             HE THONG DA CHAY THANH CONG!          " -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Backend Local : http://localhost:5007" -ForegroundColor White
Write-Host "  Swagger Docs  : http://localhost:5007/swagger" -ForegroundColor White
if ($ngrokUrl) {
    Write-Host "  Ngrok Public  : $ngrokUrl" -ForegroundColor Magenta
    Write-Host "  API Endpoint  : $ngrokUrl/api" -ForegroundColor Magenta
} else {
    Write-Host "  Ngrok dang tao link, kiem tra lai sau vai giay..." -ForegroundColor Yellow
}
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Luu y: Ban co the dong cua so nay hoac tat Antigravity IDE," -ForegroundColor Green
Write-Host "cac tien trinh van se tiep tuc chay ngam doc lap tren may." -ForegroundColor Green
Write-Host "De kiem tra: chay 'status_netfit.bat'" -ForegroundColor Yellow
Write-Host "De dung he thong: chay 'stop_netfit.bat'" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
