$headers = @{"Content-Type"="application/json"}
$body = '{"email":"test@example.com","password":"test123"}'
$loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/user/login" -Method POST -Headers $headers -Body $body
$token = $loginResponse.result.token

Write-Host "Token: $token"

# Create a bot
$headers2 = @{"Authorization"="Bearer $token"; "Content-Type"="application/json"}
$createBody = '{"bot_name":"Test Bot","description":"Test Description"}'
$createResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/chat-bot" -Method POST -Headers $headers2 -Body $createBody
Write-Host "Create response:"
$createResponse | ConvertTo-Json -Depth 3

# Get bots
$botsResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/chat-bot/all" -Method GET -Headers $headers2
Write-Host "Bots response:"
$botsResponse | ConvertTo-Json -Depth 3
