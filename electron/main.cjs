// Electron main process — PixelPets Desktop
// Two windows:
//   1) Control panel: loads the built React app (file://.../dist/index.html#/desktop)
//   2) Pet overlay: transparent, frameless, click-through, always-on-top
// Tray menu: switch pets, toggle follow cursor, show/hide panel, quit.

const { app, BrowserWindow, Tray, Menu, nativeImage, screen, shell } = require("electron");
const path = require("path");
const fs = require("fs");

let panelWindow = null;
let petWindow = null;
let tray = null;
let currentPet = "cat";
let followCursor = false;
let petVisible = true;

const PETS = [
  { kind: "cat",      name: "Mochi"      },
  { kind: "dog",      name: "Pixel"      },
  { kind: "slime",    name: "Goo"        },
  { kind: "dragon",   name: "Byte"       },
  { kind: "ghost",    name: "Boo"        },
  { kind: "robot",    name: "Bit-9"      },
  { kind: "pikachu",  name: "Pika"       },
  { kind: "kirby",    name: "Kirby"      },
  { kind: "yoshi",    name: "Yoshi"      },
  { kind: "creeper",  name: "Creeper"    },
  { kind: "axolotl",  name: "Axoltito"   },
  { kind: "mushroom", name: "Toad"       },
];

function resolveAppEntry() {
  // When packaged, dist/ lives next to the executable resources.
  // When running from source: /dev-server/dist/index.html
  const candidates = [
    // Source / dev
    path.join(__dirname, "..", "dist", "client", "index.html"),
    path.join(__dirname, "..", "dist", "index.html"),
    // Packaged (electron-packager): app lives under resources/app/
    path.join(process.resourcesPath || "", "app", "dist", "client", "index.html"),
    path.join(process.resourcesPath || "", "app", "dist", "index.html"),
    path.join(__dirname, "dist", "client", "index.html"),
    path.join(__dirname, "dist", "index.html"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function buildPetUrl() {
  const file = path.join(__dirname, "pet.html").replace(/\\/g, "/");
  return `file:///${file}?kind=${currentPet}${followCursor ? "&follow=1" : ""}`;
}

function buildPanelUrl() {
  const file = resolveAppEntry().replace(/\\/g, "/");
  // Hash route works regardless of base path — TanStack Router handles it client-side.
  return `file:///${file}`;
}

function createPanelWindow() {
  panelWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: "PixelPets",
    backgroundColor: "#0a0a0f",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  panelWindow.loadURL(buildPanelUrl());
  panelWindow.on("closed", () => { panelWindow = null; });

  // Open external links in the system browser instead of a new Electron window.
  panelWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

function createPetWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  petWindow = new BrowserWindow({
    width, height, x: 0, y: 0,
    transparent: true,
    frame: false,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    focusable: false,
    fullscreenable: false,
    backgroundColor: "#00000000",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  petWindow.setIgnoreMouseEvents(true, { forward: true });
  petWindow.setAlwaysOnTop(true, "screen-saver");
  petWindow.setVisibleOnAllWorkspaces(true);
  petWindow.loadURL(buildPetUrl());
  petWindow.on("closed", () => { petWindow = null; });
}

function reloadPet() {
  if (petWindow) petWindow.loadURL(buildPetUrl());
}

function togglePetVisibility() {
  petVisible = !petVisible;
  if (petVisible) {
    if (!petWindow) createPetWindow();
    else petWindow.show();
  } else if (petWindow) {
    petWindow.hide();
  }
  if (tray) tray.setContextMenu(buildMenu());
}

function togglePanel() {
  if (panelWindow) {
    if (panelWindow.isVisible()) panelWindow.hide();
    else { panelWindow.show(); panelWindow.focus(); }
  } else {
    createPanelWindow();
  }
}

function buildTrayIcon() {
  const size = 16;
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - 7.5, dy = y - 7.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      const i = (y * size + x) * 4;
      if (d < 7) {
        buf[i] = 255; buf[i + 1] = 90; buf[i + 2] = 160; buf[i + 3] = 255;
      } else { buf[i + 3] = 0; }
    }
  }
  return nativeImage.createFromBuffer(buf, { width: size, height: size });
}

function buildMenu() {
  return Menu.buildFromTemplate([
    { label: "PixelPets 🐾", enabled: false },
    { type: "separator" },
    {
      label: petWindow && petVisible ? "Ocultar mascota" : "Mostrar mascota",
      click: togglePetVisibility,
    },
    {
      label: "Abrir panel de control",
      click: togglePanel,
    },
    { type: "separator" },
    {
      label: "Mascota",
      submenu: PETS.map((p) => ({
        label: `${p.name} (${p.kind})`,
        type: "radio",
        checked: currentPet === p.kind,
        click: () => {
          currentPet = p.kind;
          reloadPet();
          if (tray) tray.setContextMenu(buildMenu());
        },
      })),
    },
    {
      label: "Seguir el cursor",
      type: "checkbox",
      checked: followCursor,
      click: (item) => { followCursor = item.checked; reloadPet(); },
    },
    { type: "separator" },
    { label: "Salir", role: "quit" },
  ]);
}

app.whenReady().then(() => {
  createPanelWindow();
  createPetWindow();
  tray = new Tray(buildTrayIcon());
  tray.setToolTip("PixelPets — tu mascotita está viva 🐾");
  tray.setContextMenu(buildMenu());
});

// Keep app alive on macOS even if all windows close.
app.on("window-all-closed", (e) => {
  if (process.platform !== "darwin") {
    // On Win/Linux, stay alive in tray.
    e.preventDefault();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createPanelWindow();
    createPetWindow();
  }
});
