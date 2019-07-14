'use strict';
const mode = process.env.APP_MODE;
const path = require('path')
const glob = require('glob')
const {app, globalShortcut, BrowserWindow, shell} = require('electron')
const windowStateKeeper = require('electron-window-state');
const contextMenu = require('electron-context-menu');

contextMenu();
let mainWindow = null;

app.on('ready', () => {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1050,
		defaultHeight: 680
	});

	mainWindow = new BrowserWindow({
		width: mainWindowState.width,
		height: mainWindowState.height,
		x: mainWindowState.x,
		y: mainWindowState.y,
		title: 'intranet',
		resizable: true,
		icon: __dirname + '/../public/favicon.png',
		webPreferences: {
			nativeWindowOpen: true
		},
		show: false
	});

	mainWindow.setMenu(null);
	mainWindowState.manage(mainWindow);

	if (mode == 'dev') {
		mainWindow.loadURL('http://localhost:3000')
		mainWindow.openDevTools();
	} else {
		mainWindow.loadURL(path.join('file://', __dirname, '/../build/index.html'))
	}

	globalShortcut.register('CommandOrControl+I', () => {
		mainWindow.openDevTools();
	})

	var customerHelpWindow = null;
	globalShortcut.register('CommandOrControl+H', () => {
		if (customerHelpWindow) {
			customerHelpWindow.focus();
			return;
		}

		customerHelpWindow = new BrowserWindow({
			width: 850,
			height: 550,
			title: 'intranet',
			resizable: false,
			icon: __dirname + '/../public/favicon.png',
		});

		customerHelpWindow.loadURL(path.join('file://', __dirname, './static/docs/help.html'))

		customerHelpWindow.on('closed', function() {
			customerHelpWindow = null
		})
	})

	mainWindow.on('close', () => {
		mainWindow = null;
	})

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	let emailWindow = null;
	mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
		if (url == 'https://gmail.com/' || url == 'https://mail.google.com/mail' || url == 'https://mail.google.com/') {
			event.preventDefault();

			if (emailWindow) {
				emailWindow.focus();
				return;
			}

			emailWindow = new BrowserWindow({
				width: 1050,
				height: 680,
				webContents: options.webContents,
				show: false
			});

			emailWindow.once('ready-to-show', () => emailWindow.show())
			if (!options.webContents) {
				emailWindow.loadURL(url)
			}

			emailWindow.on('close', () => {
				emailWindow = null;
			})

			emailWindow.webContents.on('new-window', (event, emailUrl, emailFrameName, emailDisposition, emailOptions, emailAdditionalFeatures) => {
				event.preventDefault();
				shell.openExternal(emailUrl);
			});

			event.newGuest = emailWindow;
		}
	})

});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})
