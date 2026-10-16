Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "       DANG DUNG NETFIT BACKEND VA NGROK" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Dung ngrok
Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "[1/2] Da dung tien trinh Ngrok." -ForegroundColor Green

# Dung backend tren port 5007
$port5007 = Get-NetTCPConnection -LocalPort 5007 -ErrorAction SilentlyContinue
if ($port5007) {
    $pids = $port5007 | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($p in $pids) {
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "[2/2] Da dung tien trinh Backend (.NET)." -ForegroundColor Green

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Toan bo dich vu Backend & Ngrok da duoc dung!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
