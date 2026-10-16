Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  KIEM TRA TRANG THAI NETFIT BACKEND VA NGROK" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Kiem tra MySQL
$mysql = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysql -and $mysql.Status -eq "Running") {
    Write-Host "[V] MySQL80 Service: DANG CHAY" -ForegroundColor Green
} else {
    Write-Host "[X] MySQL80 Service: CHUA CHAY (Vui long bat lai MySQL)" -ForegroundColor Red
}

# 2. Kiem tra Backend
$port5007 = Get-NetTCPConnection -LocalPort 5007 -ErrorAction SilentlyContinue
if ($port5007) {
    Write-Host "[V] Backend (.NET) : DANG CHAY tren http://localhost:5007" -ForegroundColor Green
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:5007/" -TimeoutSec 2
        Write-Host "    -> Trang thai API: $($res.status)" -ForegroundColor Gray
    } catch { }
} else {
    Write-Host "[X] Backend (.NET) : CHUA CHAY" -ForegroundColor Red
}

# 3. Kiem tra Ngrok
try {
    $tunnel = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2 -ErrorAction Stop
    $url = $tunnel.tunnels[0].public_url
    Write-Host "[V] Ngrok Tunnel   : DANG CHAY" -ForegroundColor Green
    Write-Host "    -> Public URL  : $url" -ForegroundColor Magenta
    Write-Host "    -> API URL     : $url/api" -ForegroundColor Magenta
} catch {
    Write-Host "[X] Ngrok Tunnel   : CHUA CHAY HOAC KHONG PHAN HOI" -ForegroundColor Yellow
}
Write-Host "===================================================" -ForegroundColor Cyan
