// PixelPets · Configuración de descargas
// =========================================================================
// CÓMO HACER QUE LAS DESCARGAS FUNCIONEN DE VERDAD:
//
// 1. Conecta este proyecto a GitHub (botón GitHub arriba en el editor)
// 2. Espera a que GitHub Actions termine de empaquetar (~5 min, pestaña Actions)
// 3. Crea un Release con tag v1.0.0 en tu repo (Releases → Draft new release)
// 4. CAMBIA estas dos variables abajo por las tuyas:
//      - GITHUB_USER
//      - GITHUB_REPO
// 5. Si subes una versión nueva, cambia RELEASE_TAG por el nuevo tag (ej: "v1.1.0")
//
// Las URLs se generan automáticamente con el formato:
//   https://github.com/USER/REPO/releases/download/TAG/FILENAME
// =========================================================================

const GITHUB_USER = "nohoscar";     // ← tu usuario de GitHub
const GITHUB_REPO = "pixelpets";    // ← tu repo
const RELEASE_TAG = "v2.0.0";       // ← cámbialo cuando publiques una versión nueva

const releaseBase = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/download/${RELEASE_TAG}`;

export interface DownloadOption {
  os: string;
  icon: string;
  filename: string;
  size: string;
  arch: string;
  url: string;
}

export const DOWNLOADS: DownloadOption[] = [
  {
    os: "Windows",
    icon: "🪟",
    filename: "PixelPets-win32-x64.zip",
    size: "~85 MB",
    arch: "x64",
    url: `${releaseBase}/PixelPets-win32-x64.zip`,
  },
  {
    os: "macOS",
    icon: "🍎",
    filename: "PixelPets-darwin-x64.zip",
    size: "~80 MB",
    arch: "x64",
    url: `${releaseBase}/PixelPets-darwin-x64.zip`,
  },
  {
    os: "Linux",
    icon: "🐧",
    filename: "PixelPets-linux-x64.tar.gz",
    size: "~85 MB",
    arch: "x64",
    url: `${releaseBase}/PixelPets-linux-x64.tar.gz`,
  },
];

// Devuelve true si las URLs ya están configuradas (cambia a false si vuelves a "TU_USUARIO")
export const downloadsConfigured: boolean = (GITHUB_USER as string) !== "TU_USUARIO";
