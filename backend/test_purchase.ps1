$baseUrl = "http://localhost:5007"

Write-Host "1. Fetching packages..."
$packages = Invoke-RestMethod -Uri "$baseUrl/api/product-packages" -Method Get
if ($packages.Count -eq 0) {
    Write-Host "No packages found!"
} else {
    $packageId = $packages[0].id
    Write-Host "Found package: $($packages[0].name) (ID: $packageId)"
}

Write-Host "2. Registering a test user..."
$email = "testpayos$([guid]::NewGuid().ToString().Substring(0,8))@example.com"
$registerBody = @{
    Fullname = "Test PayOS User"
    Email = $email
    Password = "Password123!"
    ConfirmPassword = "Password123!"
} | ConvertTo-Json

try {
    $registerRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Registered successfully!"
} catch {
    Write-Host "Register failed:"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host $responseBody
}

Write-Host "3. Logging in..."
$loginBody = @{
    Email = $email
    Password = "Password123!"
} | ConvertTo-Json

$token = ""
try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    Write-Host "Logged in successfully. Token: $($token.Substring(0, 15))..."
} catch {
    Write-Host "Login failed:"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host $responseBody
    exit
}

if ($packages.Count -eq 0) {
    Write-Host "Cannot test purchase without a package."
    exit
}

Write-Host "4. Testing Purchase Endpoint..."
$purchaseBody = @{
    PackageId = $packageId
    BuyerName = "Test Buyer"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

try {
    $purchaseRes = Invoke-RestMethod -Uri "$baseUrl/api/orders/purchase" -Method Post -Body $purchaseBody -ContentType "application/json" -Headers $headers
    Write-Host "Purchase successful!"
    Write-Host "Order Code: $($purchaseRes.orderCode)"
    Write-Host "Checkout URL: $($purchaseRes.checkoutUrl)"
    
    # Save the output to a file so we can view it
    $purchaseRes | ConvertTo-Json | Out-File -FilePath "purchase_result.json" -Encoding utf8
} catch {
    Write-Host "Purchase failed:"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host $responseBody
}
