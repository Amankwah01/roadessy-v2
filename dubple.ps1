$source = "C:\Users\CompuGear\roadessy-v2\app\dashboard\"
$destination = "C:\Users\CompuGear\roadessy-v2\app\"
$names = @("\analytics","\reports","\upload","\settings","\admin")
foreach ($name in $names) {
    $target = Join-Path $destination $name
    if (-Not (Test-Path $target)) {
        Copy-Item $source $target -Recurse
        Write-Host "$target created."
    }
    else {
        Write-Host "$target already exists. Skipped."
    }
}