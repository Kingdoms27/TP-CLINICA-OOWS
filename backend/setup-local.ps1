$ErrorActionPreference = "Stop"

$backendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $backendPath ".env"

$dbHost = Read-Host "Host PostgreSQL [localhost]"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
  $dbHost = "localhost"
}

$dbPort = Read-Host "Puerto PostgreSQL [5432]"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
  $dbPort = "5432"
}

$dbUser = Read-Host "Usuario PostgreSQL [postgres]"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
  $dbUser = "postgres"
}

$dbName = Read-Host "Base de datos [clinica_oows]"
if ([string]::IsNullOrWhiteSpace($dbName)) {
  $dbName = "clinica_oows"
}

$securePassword = Read-Host "Contraseña de PostgreSQL" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
  $dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)

  if ([string]::IsNullOrWhiteSpace($dbPassword)) {
    throw "La contraseña no puede estar vacía."
  }

  @"
PORT=3000
DB_HOST=$dbHost
DB_PORT=$dbPort
DB_USERNAME=$dbUser
DB_PASSWORD=$dbPassword
DB_DATABASE=$dbName
DB_SYNC=true
JWT_SECRET=clinica_oows_2026
JWT_EXPIRES_IN=8h
"@ | Set-Content -Path $envPath -Encoding UTF8

  Write-Host ""
  Write-Host "Configuración creada correctamente:" -ForegroundColor Green
  Write-Host $envPath
  Write-Host ""
  Write-Host "Ahora ejecutá:" -ForegroundColor Cyan
  Write-Host "npm run start:dev"
}
finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}
