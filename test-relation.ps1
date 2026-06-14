$token = Get-Content "token.txt" -Raw

$projectId = "8d64381d-6246-4f87-a82e-81141ca520f6"
$companyId = "a59775b2-0b62-4b46-98ec-c88302621924"

$payload = @{
  type = "MANY_TO_ONE"
  targetObjectMetadataId = $companyId
  targetFieldLabel = "项目"
  targetFieldIcon = "IconBuildingSkyscraper"
}

$gql = 'mutation CreateRelation($payload: JSON!) {' + "`n"
$gql += '  createOneField(input: {' + "`n"
$gql += '    field: {' + "`n"
$gql += '      name: "sypjtcompany"' + "`n"
$gql += '      label: "客户公司"' + "`n"
$gql += '      type: RELATION' + "`n"
$gql += '      objectMetadataId: "' + $projectId + '"' + "`n"
$gql += '      isLabelSyncedWithName: false' + "`n"
$gql += '      relationCreationPayload: $payload' + "`n"
$gql += '    }' + "`n"
$gql += '  }) {' + "`n"
$gql += '    id' + "`n"
$gql += '    name' + "`n"
$gql += '    relation {' + "`n"
$gql += '      type' + "`n"
$gql += '      targetFieldMetadata { id name }' + "`n"
$gql += '    }' + "`n"
$gql += '  }' + "`n"
$gql += '}'

$body = @{ query = $gql; variables = @{ payload = $payload } }
try {
  $resp = Invoke-RestMethod -Uri "http://localhost:3000/metadata" -Method Post -Body ($body | ConvertTo-Json -Depth 10) -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
  Write-Host ($resp | ConvertTo-Json -Depth 5)
} catch {
  Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  Write-Host "Body: $($reader.ReadToEnd())"
}
