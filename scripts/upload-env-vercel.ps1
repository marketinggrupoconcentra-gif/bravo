# Script para subir variables de entorno a Vercel
# Uso: pwsh -File upload-env-vercel.ps1

$env_vars = @(
    @{ name = "NEXT_PUBLIC_GA_ID"; value = "G-BRAVOMX01"; envs = @("production", "development") },
    @{ name = "INTELIX_API_KEY"; value = ""; envs = @("production") },
    @{ name = "INTELIX_BASE_URL"; value = "https://api.intelix.mx"; envs = @("production", "development") },
    @{ name = "META_PIXEL_ID"; value = ""; envs = @("production") },
    @{ name = "META_ACCESS_TOKEN"; value = ""; envs = @("production") },
    @{ name = "ADMIN_SECRET_KEY"; value = "CAMBIA_ESTA_CLAVE_EN_PRODUCCION"; envs = @("production", "development") }
)

foreach ($var in $env_vars) {
    foreach ($env in $var.envs) {
        if ($var.value -ne "") {
            Write-Host "Subiendo $($var.name) a $env..."
            $result = vercel env add $var.name $env --value $var.value --yes 2>&1
            Write-Host $result
        } else {
            Write-Host "SKIP: $($var.name) no tiene valor (configurar manualmente en dashboard)"
        }
    }
}

Write-Host "Listo. Verifica con: vercel env ls"
