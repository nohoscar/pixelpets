// Preload script — exposes a safe IPC bridge to renderer windows
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pixelpets", {
  // Panel → main → pet overlay
  setPet: (kind) => ipcRenderer.send("set-pet", kind),
  setFollow: (value) => ipcRenderer.send("set-follow", value),
  petAction: (action) => ipcRenderer.send("pet-action", action),
  setCursor: (name) => ipcRenderer.send("set-cursor", name),
  // Pet overlay → main → panel (stats updates)
  sendStats: (stats) => ipcRenderer.send("stats-update", stats),
  // Mouse hit-testing: pet overlay tells main when mouse is over the pet
  setMouseHit: (hit) => ipcRenderer.send("set-mouse-hit", hit),
  // Listeners
  onSetPet: (cb) => ipcRenderer.on("set-pet", (_e, kind) => cb(kind)),
  onSetFollow: (cb) => ipcRenderer.on("set-follow", (_e, val) => cb(val)),
  onPetAction: (cb) => ipcRenderer.on("pet-action", (_e, action) => cb(action)),
  onStatsUpdate: (cb) => ipcRenderer.on("stats-update", (_e, stats) => cb(stats)),
  // Battery info from main process (Electron powerMonitor)
  onBatteryUpdate: (cb) => ipcRenderer.on("battery-update", (_e, info) => cb(info)),
});
