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
  // Pet overlay → main (mouse ignore toggle)
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send("set-ignore-mouse", ignore),
  // Listeners
  onSetPet: (cb) => ipcRenderer.on("set-pet", (_e, kind) => cb(kind)),
  onSetFollow: (cb) => ipcRenderer.on("set-follow", (_e, val) => cb(val)),
  onPetAction: (cb) => ipcRenderer.on("pet-action", (_e, action) => cb(action)),
  onStatsUpdate: (cb) => ipcRenderer.on("stats-update", (_e, stats) => cb(stats)),
  // Battery info from main process (Electron powerMonitor)
  onBatteryUpdate: (cb) => ipcRenderer.on("battery-update", (_e, info) => cb(info)),
  // Music detection from main process
  onMusicUpdate: (cb) => ipcRenderer.on("music-update", (_e, info) => cb(info)),
});
