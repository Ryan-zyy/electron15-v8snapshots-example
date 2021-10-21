const { app, BrowserWindow } = require('electron');
const path = require('path');

if (typeof snapshotResult !== 'undefined') {
  console.log('snapshotResult available!', snapshotResult);
} else {
  console.log('snapshotResult is not defined');
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
