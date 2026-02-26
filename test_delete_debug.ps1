$headers = @{"Content-Type"="application/json"}
$body = '{"email":"test@example.com","password":"test123"}'
$loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/user/login" -Method POST -Headers $headers -Body $body
$token = $loginResponse.result.token

Write-Host "Token: $token"

# Get bots
$headers2 = @{"Authorization"="Bearer $token"}
$botsResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/chat-bot/all" -Method GET -Headers $headers2

if ($botsResponse.result.Count -gt 0) {
    $firstBot = $botsResponse.result[0]
    Write-Host "First bot _id: $($firstBot._id)"
    Write-Host "First bot _id type: $($firstBot._id.GetType())"
    
    # Inspect the properties of _id object
    $idObj = $firstBot._id
    Write-Host "_id object properties: $($idObj | Get-Member -MemberType NoteProperty | Select-Object Name)"
    
    # Try to get the oid value
    $botId = $null
    if ($idObj.oid) {
        $botId = $idObj.oid
    } elseif ($idObj.'$oid') {
        $botId = $idObj.'$oid'
    } else {
        # Try all properties
        foreach ($prop in $idObj.PSObject.Properties) {
            Write-Host "Property: $($prop.Name) = $($prop.Value)"
            if ($prop.Name -like "*oid*") {
                $botId = $prop.Value
            }
        }
    }
    
    Write-Host "Final botId: $botId"
    
    try {
        $deleteResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/chat-bot/$botId" -Method DELETE -Headers $headers2
        Write-Host "Delete successful:"
        $deleteResponse | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "Delete failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody"
        }
    }
} else {
    Write-Host "No bots found"
}
