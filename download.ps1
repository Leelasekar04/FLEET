$ErrorActionPreference = 'Stop'

$urlMain   = "https://github.com/nafterweb21-hub/fleet/archive/refs/heads/main.zip"
$urlMaster = "https://github.com/nafterweb21-hub/fleet/archive/refs/heads/master.zip"

if ([string]::IsNullOrWhiteSpace($urlMain) -or [string]::IsNullOrWhiteSpace($urlMaster)) {
    Write-Host "Error: URL variables cannot be empty." -ForegroundColor Red
    exit 1
}

$zipFile = "repo.zip"
$downloadSuccess = $false

try {
    Write-Host "Trying to download main branch..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $urlMain -OutFile $zipFile -UseBasicParsing
    $downloadSuccess = $true
} catch {
    Write-Host "Failed to download main branch: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Trying master branch..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $urlMaster -OutFile $zipFile -UseBasicParsing
        $downloadSuccess = $true
    } catch {
        Write-Host "Failed to download master branch: $($_.Exception.Message)" -ForegroundColor Red
    }
}

if (-not $downloadSuccess -or -not (Test-Path -Path $zipFile -PathType Leaf)) {
    Write-Host "Error: Download failed or ZIP file does not exist." -ForegroundColor Red
    exit 1
}

Write-Host "Archive downloaded successfully. Extracting archive..." -ForegroundColor Green
Expand-Archive -Path $zipFile -DestinationPath "." -Force

$folder = Get-ChildItem -Directory | Where-Object { $_.Name -like "fleet-main" -or $_.Name -like "fleet-master" -or $_.Name -like "fleet-*-main" -or $_.Name -like "fleet-*-master" } | Select-Object -First 1

if ($folder) {
    Write-Host "Moving files from $($folder.Name) to root..." -ForegroundColor Cyan
    Move-Item -Path "$($folder.FullName)\*" -Destination "." -Force
    Move-Item -Path "$($folder.FullName)\.*" -Destination "." -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $folder.FullName -Recurse -Force
}

Remove-Item -Path $zipFile -Force
Write-Host "Done! The Fleet project folder is ready." -ForegroundColor Green
