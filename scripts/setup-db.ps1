# Database setup script - run from project root
# Usage: .\scripts\setup-db.ps1
# Or with password: $env:PGPASSWORD="yourpassword"; .\scripts\setup-db.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $projectRoot

Write-Host "Creating database 'purpose'..." -ForegroundColor Cyan
psql -U postgres -c "CREATE DATABASE purpose;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database may already exist, continuing..." -ForegroundColor Yellow
}

Write-Host "Running schema.sql..." -ForegroundColor Cyan
psql -U postgres -d purpose -f db/schema.sql

Write-Host "Running seed.sql..." -ForegroundColor Cyan
psql -U postgres -d purpose -f db/seed.sql

Write-Host "Copying backend .env.example to .env..." -ForegroundColor Cyan
Copy-Item backend\.env.example backend\.env -Force

Write-Host "`nDone! Update backend\.env with your PostgreSQL password in DATABASE_URL" -ForegroundColor Green
Write-Host "Example: DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/purpose" -ForegroundColor Gray
