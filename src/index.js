const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ipc = ipcMain

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 700,
		minWidth: 800,
		minHeight: 500,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	ipc.on("app:exit", () => {
		mainWindow.close();
		console.info("#btn-exit Pressed")
	})

	ipc.on("app:minimize", () => {
		mainWindow.minimize();
		console.info("#btn-minimize Pressed")
	})

	ipc.on("app:zoom", () => {
		if (mainWindow.isMaximized() == true) mainWindow.restore()
		else mainWindow.maximize()
		console.info("#btn-zoom Pressed")
	})

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
