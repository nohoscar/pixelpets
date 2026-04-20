// Electron main process — PixelPets Desktop
// Two windows:
//   1) Control panel: loads the built React app (file://.../dist/index.html#/desktop)
//   2) Pet overlay: transparent, frameless, click-through, always-on-top
// Tray menu: switch pets, toggle follow cursor, show/hide panel, quit.

const { app, BrowserWindow, Tray, Menu, nativeImage, screen, shell, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");

const CURRENT_VERSION = "2.1.0";
const GITHUB_API = "https://api.github.com/repos/nohoscar/pixelpets/releases/latest";

let panelWindow = null;
let petWindow = null;
let tray = null;
let currentPet = "cat";
let followCursor = false;
let petVisible = true;

// --- Update Checker ---
async function checkForUpdates() {
  try {
    const https = require("https");
    const data = await new Promise((resolve, reject) => {
      https.get(GITHUB_API, { headers: { "User-Agent": "PixelPets" } }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => resolve(JSON.parse(body)));
        res.on("error", reject);
      }).on("error", reject);
    });

    const latestTag = data.tag_name; // e.g. "v2.2.0"
    const latestVersion = latestTag.replace("v", "");

    if (latestVersion !== CURRENT_VERSION) {
      const notification = new Notification({
        title: "PixelPets Update Available! 🐾",
        body: `Version ${latestVersion} is available. Click to download.`,
      });
      notification.on("click", () => {
        shell.openExternal(data.html_url);
      });
      notification.show();
    }
  } catch {} // silently fail
}

const preloadPath = path.join(__dirname, "preload.cjs");

const PETS = [
  // Cute classics
  { kind: "cat",      name: "Mochi"      },
  { kind: "dog",      name: "Pixel"      },
  { kind: "bunny",    name: "Bun"        },
  { kind: "fox",      name: "Kitsune"    },
  { kind: "panda",    name: "Bao"        },
  { kind: "axolotl",  name: "Axoltito"   },
  { kind: "capybara", name: "Capy"       },
  { kind: "penguin",  name: "Tux"        },
  { kind: "monkey",   name: "Coco"       },
  { kind: "unicorn",  name: "Sparkle"    },
  // Cartoon
  { kind: "slime",    name: "Goo"        },
  { kind: "slimemage",name: "Merlin"     },
  { kind: "mushroom", name: "Toad"       },
  // Fantasy
  { kind: "dragon",   name: "Byte"       },
  { kind: "ghost",    name: "Boo"        },
  { kind: "robot",    name: "Bit-9"      },
  { kind: "alien",    name: "Zyx"        },
  // Lovecraft
  { kind: "cthulhu",      name: "Cthulhu"     },
  { kind: "shoggoth",     name: "Shoggoth"    },
  { kind: "blackgoat",    name: "Shub"        },
  { kind: "necronomicon", name: "Necro"       },
  { kind: "yurei",        name: "Yūrei"       },
  // Videogames
  { kind: "pikachu",       name: "Pika"        },
  { kind: "kirby",         name: "Kirby"       },
  { kind: "creeper",       name: "Creeper"     },
  { kind: "yoshi",         name: "Yoshi"       },
  { kind: "metroid",       name: "Metroid"     },
  { kind: "companionCube", name: "Cube"        },
  { kind: "chocobo",       name: "Chocobo"     },
  { kind: "booMario",      name: "Boo Mario"   },
  { kind: "bulborb",       name: "Bulborb"     },
  { kind: "headcrab",      name: "Headcrab"    },
  { kind: "isaac",         name: "Isaac"       },
  // Sci-fi / Horror
  { kind: "facehugger",    name: "Hugger"      },
  { kind: "xenomorph",     name: "Xeno"        },
  { kind: "dalek",         name: "Dalek"       },
  { kind: "tribble",       name: "Tribble"     },
  { kind: "bb8",           name: "BB-8"        },
  { kind: "weepingAngel",  name: "Angel"       },
  { kind: "gremlin",       name: "Gremlin"     },
  { kind: "chestburster",  name: "Burster"     },
  { kind: "yautja",        name: "Yautja"      },
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
  // Panel is built separately by vite.panel.config.ts
  const candidates = [
    path.join(__dirname, "panel-dist", "electron", "panel.html"),
    path.join(__dirname, "..", "electron", "panel-dist", "electron", "panel.html"),
    path.join(process.resourcesPath || "", "app", "panel-dist", "electron", "panel.html"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return `file:///${c.replace(/\\/g, "/")}`;
  }
  // Fallback to old method
  const file = resolveAppEntry().replace(/\\/g, "/");
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
      preload: preloadPath,
    },
  });

  panelWindow.loadURL(buildPanelUrl());

  // Minimize to tray instead of quitting when panel is closed
  panelWindow.on("close", (e) => {
    e.preventDefault();
    panelWindow.hide();
  });
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
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: preloadPath },
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

function showPanel() {
  if (panelWindow) {
    panelWindow.show();
    panelWindow.focus();
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
    { label: `PixelPets 🐾 v${CURRENT_VERSION}`, enabled: false },
    { type: "separator" },
    {
      label: petWindow && petVisible ? "Ocultar mascota" : "Mostrar mascota",
      click: togglePetVisibility,
    },
    {
      label: "Mostrar panel de control",
      click: showPanel,
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
    {
      label: "Iniciar con Windows",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      },
    },
    {
      label: "Buscar actualizaciones",
      click: () => { checkForUpdates(); },
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        // Destroy panel window properly before quitting
        if (panelWindow) {
          panelWindow.removeAllListeners("close");
          panelWindow.close();
        }
        app.quit();
      },
    },
  ]);
}

// IPC: Panel → Main → Pet overlay
ipcMain.on("set-pet", (_e, kind) => {
  currentPet = kind;
  if (petWindow) petWindow.webContents.send("set-pet", kind);
  if (tray) tray.setContextMenu(buildMenu());
});

ipcMain.on("set-follow", (_e, value) => {
  followCursor = !!value;
  if (petWindow) petWindow.webContents.send("set-follow", value);
  if (tray) tray.setContextMenu(buildMenu());
});

// Panel → Main → Pet overlay: feed/play/sleep actions
ipcMain.on("pet-action", (_e, action) => {
  if (petWindow) petWindow.webContents.send("pet-action", action);
});

// Pet overlay → Main → Panel: stats updates
ipcMain.on("stats-update", (_e, stats) => {
  if (panelWindow) panelWindow.webContents.send("stats-update", stats);
});

// Pet overlay: dynamic click-through based on mouse position over pet
ipcMain.on("set-mouse-hit", (_e, hit) => {
  if (petWindow) {
    if (hit) {
      petWindow.setIgnoreMouseEvents(false);
    } else {
      petWindow.setIgnoreMouseEvents(true, { forward: true });
    }
  }
});

app.whenReady().then(() => {
  createPanelWindow();
  createPetWindow();
  tray = new Tray(buildTrayIcon());
  tray.setToolTip("PixelPets — tu mascotita está viva 🐾");
  tray.setContextMenu(buildMenu());

  // Update checker: 10 seconds after launch, then every 6 hours
  setTimeout(checkForUpdates, 10000);
  setInterval(checkForUpdates, 6 * 60 * 60 * 1000);

  // Battery monitoring via Electron's powerMonitor
  const { powerMonitor } = require("electron");
  const sendBattery = () => {
    // powerMonitor doesn't have a direct battery level API on all platforms,
    // but we can detect power state changes
    const onAC = powerMonitor.isOnBatteryPower !== undefined ? !powerMonitor.isOnBatteryPower() : true;
    const info = { onAC };
    if (petWindow) petWindow.webContents.send("battery-update", info);
    if (panelWindow) panelWindow.webContents.send("battery-update", info);
  };
  powerMonitor.on("on-ac", sendBattery);
  powerMonitor.on("on-battery", sendBattery);
  // Send initial state after windows load
  setTimeout(sendBattery, 3000);

  // Music detection — check if music process names exist (cheaper than getting all window titles)
  let lastMusicState = false;
  const musicProcessNames = ["spotify", "vlc", "foobar2000", "itunes", "musicbee", "winamp", "tidal"];
  const checkMusic = () => {
    try {
      if (process.platform === "win32") {
        const { execSync } = require("child_process");
        try {
          const processFilter = musicProcessNames.map((p) => `Name='${p}'`).join(" OR ");
          const output = execSync(
            `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"${processFilter}\\" | Select-Object -First 1 -ExpandProperty Name"`,
            { encoding: "utf8", timeout: 3000, stdio: ["pipe", "pipe", "ignore"] }
          );
          const isPlaying = output.trim().length > 0;
          if (isPlaying !== lastMusicState) {
            lastMusicState = isPlaying;
            const info = { musicDetected: isPlaying };
            if (petWindow) petWindow.webContents.send("music-update", info);
            if (panelWindow) panelWindow.webContents.send("music-update", info);
          }
        } catch {
          // PowerShell failed or no music process found
          if (lastMusicState) {
            lastMusicState = false;
            const info = { musicDetected: false };
            if (petWindow) petWindow.webContents.send("music-update", info);
            if (panelWindow) panelWindow.webContents.send("music-update", info);
          }
        }
      }
    } catch {}
  };
  // Check every 15 seconds (reduced from 5s)
  setInterval(checkMusic, 15000);
  setTimeout(checkMusic, 15000);

  // --- Notification Reminders ---
  let lastInteractionTime = Date.now();
  const NOTIFICATION_MESSAGES = [
    "Your pet misses you! 🐾",
    "Time to feed your pet! 🍖",
    "Your pet wants to play! 🎾",
  ];
  let notificationIndex = 0;

  // Track interactions from panel
  ipcMain.on("user-interaction", () => {
    lastInteractionTime = Date.now();
  });

  // Also reset on any IPC activity
  const originalOn = ipcMain.on.bind(ipcMain);
  ["set-pet", "set-follow", "pet-action"].forEach((channel) => {
    ipcMain.on(channel + "-activity", () => { lastInteractionTime = Date.now(); });
  });

  // Check every 60 minutes for idle notification (reduced from 30 min)
  setInterval(() => {
    const idleMinutes = (Date.now() - lastInteractionTime) / 60000;
    if (idleMinutes > 20 && Notification.isSupported()) {
      const msg = NOTIFICATION_MESSAGES[notificationIndex % NOTIFICATION_MESSAGES.length];
      notificationIndex++;
      const notification = new Notification({
        title: "PixelPets 🐾",
        body: msg,
        silent: false,
      });
      notification.on("click", () => {
        if (panelWindow) {
          panelWindow.show();
          panelWindow.focus();
        } else {
          createPanelWindow();
        }
        lastInteractionTime = Date.now();
      });
      notification.show();
    }
  }, 60 * 60 * 1000); // 60 minutes
});

// Keep app alive in tray even if all windows close.
app.on("window-all-closed", (e) => {
  // Stay alive in tray on all platforms.
  e.preventDefault();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createPanelWindow();
    createPetWindow();
  }
});
