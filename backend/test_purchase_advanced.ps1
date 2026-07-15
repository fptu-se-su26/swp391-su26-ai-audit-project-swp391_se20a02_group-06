$ErrorActionPreference = "Continue"
$API_URL = "http://localhost:5007"
$Headers = @{ "Content-Type" = "application/json" }

Write-Host "1. Registering test user member5@fitness.com..."
$registerBody = @{
    Fullname = "Test Member"
    Email = "member5@fitness.com"
    Password = "member_secure_hash"
    ConfirmPassword = "member_secure_hash"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method Post -Headers $Headers -Body $registerBody
    Write-Host "Registered successfully!"
} catch {
    Write-Host "User might already exist or error: $_"
}

Write-Host "`n2. Logging in..."
$loginBody = @{
    Email = "member5@fitness.com"
    Password = "member_secure_hash"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Headers $Headers -Body $loginBody
$token = $loginResponse.token
$userId = $loginResponse.userId
Write-Host "Logged in successfully. Token: $($token.Substring(0,15))..."

$AuthHeaders = @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token" 
}

Write-Host "`n3. Testing Purchase without Email Verification (Should Fail)..."
$purchaseBody = @{
    PackageId = 1
    BuyerName = "Test Member"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$API_URL/api/orders/purchase" -Method Post -Headers $AuthHeaders -Body $purchaseBody
    Write-Host "Purchase SUCCESS (Unexpected!)"
} catch {
    Write-Host "Purchase Failed as expected: $($_.ErrorDetails.Message)"
}

Write-Host "`n4. Forcing Email Verification via JobsController endpoint..."
Invoke-RestMethod -Uri "$API_URL/api/jobs/verify-email?email=member5@fitness.com" -Method Post

Write-Host "`n5. Testing Purchase with Email Verification (Should Succeed)..."
try {
    $purchaseResponse = Invoke-RestMethod -Uri "$API_URL/api/orders/purchase" -Method Post -Headers $AuthHeaders -Body $purchaseBody
    $orderCode = $purchaseResponse.orderCode
    Write-Host "Purchase successful! Order Code: $orderCode"
    
    Write-Host "`n6. Simulating Webhook successful payment for Order $orderCode..."
    Invoke-RestMethod -Uri "$API_URL/api/jobs/simulate-payment?orderCode=$orderCode" -Method Post
    
    Write-Host "`n7. Fast forwarding subscription to expire in 6 days..."
    Invoke-RestMethod -Uri "$API_URL/api/jobs/set-subscription-date?userId=$userId&daysLeft=6" -Method Post

    Write-Host "`n8. Re-logging in to check expiration flags..."
    $loginResponse2 = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Headers $Headers -Body $loginBody
    Write-Host "Expiring soon: $($loginResponse2.expiringSoon) (Expected: True)"
    Write-Host "Days until expiration: $($loginResponse2.daysUntilExpiration) (Expected: 6)"

    Write-Host "`n9. Triggering Expiration Notifications Job..."
    $jobResponse = Invoke-RestMethod -Uri "$API_URL/api/jobs/notify-expirations" -Method Post
    Write-Host $jobResponse.message

    Write-Host "`n10. Purchasing Upgrade Package (Package 2) to test Proration..."
    $upgradeBody = @{
        PackageId = 2
        BuyerName = "Test Member"
    } | ConvertTo-Json
    $upgradeResponse = Invoke-RestMethod -Uri "$API_URL/api/orders/purchase" -Method Post -Headers $AuthHeaders -Body $upgradeBody
    
    Write-Host "Upgrade Purchase successful! Order Code: $($upgradeResponse.orderCode)"
    Write-Host "Prorated Price Paid: $($upgradeResponse.pricePaid) VND"
    Write-Host "Checkout URL: $($upgradeResponse.checkoutUrl)"
    
} catch {
    Write-Host "Purchase Failed unexpectedly: $_"
}
