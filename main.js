const { app, ipcMain, BrowserWindow, Tray, Menu, MenuItem, nativeImage } = require('electron')
const remoteMain = require("@electron/remote/main");
const fs = require('fs');

let closing = false
let paused = false

let win = null
let tray = null

var data = {}
let defImage = null

let rootFolder = null
let dataFolder = null
let zipPath = null
let modulesFolder = null
let modulesHiddenFolder = null

let currentModule = null


//IF APP IS ALREADY OPEN THEN CLOSE
if (!app.requestSingleInstanceLock()) { 
  closing = true
  app.quit()
} else app.whenReady().then(() => {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win && (win.isMinimized() || !win.isVisible())) win.show()
  })


  // /$$      /$$  /$$$$$$  /$$$$$$ /$$   /$$
  //| $$$    /$$$ /$$__  $$|_  $$_/| $$$ | $$
  //| $$$$  /$$$$| $$  \ $$  | $$  | $$$$| $$
  //| $$ $$/$$ $$| $$$$$$$$  | $$  | $$ $$ $$
  //| $$  $$$| $$| $$__  $$  | $$  | $$  $$$$
  //| $$\  $ | $$| $$  | $$  | $$  | $$\  $$$
  //| $$ \/  | $$| $$  | $$ /$$$$$$| $$ \  $$
  //|__/     |__/|__/  |__/|______/|__/  \__/

  rootFolder = app.getAppPath()+'\\'
  dataFolder = rootFolder+'Data\\'
  zipPath = dataFolder+'7-Zip\\7z.exe'
  modulesFolder = rootFolder+'Modules\\'
  modulesHiddenFolder = rootFolder+'Modules Hidden\\'

  data.root = rootFolder
  data.data = dataFolder
  data.zip = zipPath
  data.modules = modulesFolder
  data.modulesHidden = modulesHiddenFolder

  remoteMain.initialize()
  createWindow()
  createTray()

  ipcMain.on('loaded', (event, path) => {
    currentModule = path
  })

  //PAUSE & RESUME
  ipcMain.on('pause', (event) => {
    pause()
  })

  function pause() {
    win.webContents.send('pause')
    paused = true
  }

  ipcMain.on('resume', (event) => {
    resume()
  })

  function resume() {
    paused = false
    win.webContents.send('resume')
  }


  //  /$$$$$$  /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$$ 
  // /$$__  $$|__  $$__/| $$  | $$| $$_____/| $$__  $$
  //| $$  \ $$   | $$   | $$  | $$| $$      | $$  \ $$
  //| $$  | $$   | $$   | $$$$$$$$| $$$$$   | $$$$$$$/
  //| $$  | $$   | $$   | $$__  $$| $$__/   | $$__  $$
  //| $$  | $$   | $$   | $$  | $$| $$      | $$  \ $$
  //|  $$$$$$/   | $$   | $$  | $$| $$$$$$$$| $$  | $$
  // \______/    |__/   |__/  |__/|________/|__/  |__/

  //LOAD A MODULE
  ipcMain.on('loadModule', (event, path, specialData) => {
    if (fs.existsSync(path))
      win.webContents.send('loadModule', path, specialData)
    else
      win.webContents.send('loadModule', modulesFolder+path, specialData)
  })

  //SEND SPECIAL DATA
  ipcMain.on('specialData', (event, specialData) => {
    win.webContents.send('specialData', specialData)
  })

  //RELOAD ASSISTANT
  ipcMain.on('reloadAssistant', function() {
    win.reload()
    tray.destroy()
    createTray()
  })

  //CREATE SIMPLE WINDOW
  ipcMain.on('newSimpleWindow', (event, path, isFile, isResizable, width, height) => {
    if (path == undefined) return
    if (isFile == undefined) isFile = false
    if (isResizable == undefined) isResizable = true
    if (height == undefined) height = 540
    if (width == undefined) width = 955

    let options = {
      height: height,
      width: width,
      resizable: isResizable
    }

    let customWin = new BrowserWindow(options)
    customWin.removeMenu()
    //customWin.openDevTools()

    if (isFile)
      customWin.loadFile(path)
    else
      customWin.loadURL(path)
  })

  //CREATE ORION WINDOW
  ipcMain.on('newOrionWindow', (event, path, isResizable, width, height, resumeOnClose, specialData) => {
    if (path == undefined) return
    if (isResizable == undefined) isResizable = true
    if (height == undefined) height = 540
    if (width == undefined) width = 955
    if (resumeOnClose == undefined) resumeOnClose = false

    let options = {
      height: height,
      width: width,
      resizable: isResizable,
      frame: false,
      opacity: 0,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    }

    let customWin = new BrowserWindow(options)
    customWin.loadFile('main_window.html')
    customWin.removeMenu()
    //customWin.openDevTools()

    if (resumeOnClose) customWin.on('close', function (event) {
      resume()
    })

    customWin.webContents.on('dom-ready', () => {
      customWin.webContents.send('load', path, data, specialData)
    })

    remoteMain.enable(customWin.webContents)
  })
  
  //REQUEST ICON
  ipcMain.on('requestIcon', async function(event, img, iconPath, actualPath) {
    getIcon(iconPath).then((value) => { 
      if (defImage != value) event.reply('changeIcon', img, value, actualPath) 
    })
  })

  //REQUEST FILE
  ipcMain.on('getFile', async function(event, path, title, sendReturn) {
    if (title == undefined || title == '') title = 'Choose a File'
    if (fs.existsSync(path)) event.reply(sendReturn, await getFile(title, path))
    else event.reply(sendReturn, await getFile(title))
  })

  //REQUEST FOLDER
  ipcMain.on('getFolder', async function(event, path, title, sendReturn) {
    if (title == undefined || title == '') title = 'Choose a Folder'
    if (fs.existsSync(path)) event.reply(sendReturn, await getFolder(title, path))
    else event.reply(sendReturn, await getFolder(title))
  })

  //OPEN/SHOW PATH IN EXPLORER
  ipcMain.on('showOnExplorer', (event, path, show) => {
    const { shell } = require('electron');
    if (show == true)
      shell.showItemInFolder(path)
    else
      shell.openPath(path)
  })
})


//WINDOW
function createWindow() {
  win = new BrowserWindow({
    height: 550,
    width: 962,
    minHeight: 460,
    minWidth: 800,
    frame: false,
    opacity: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('main.html')
  win.removeMenu()
  //win.openDevTools()

  win.webContents.on('dom-ready', function() {
    win.webContents.send('theme')
    win.webContents.send('data', data)
  })

  win.on('close', function (event) {
    if (!closing) {
      event.preventDefault()
      win.hide()
    } else {
      tray.destroy()
    }
  })
   
  remoteMain.enable(win.webContents)
}

function createTray() {
  let trayMenu = new Tray(dataFolder+'Images\\logo.ico')

  trayMenu.on('double-click', function (event) {
    win.show()
  })

  trayMenu.setToolTip('Oriøn Assistant')
  tray = trayMenu
  updateTray()
}

function updateTray() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings', click: function () {
        if (paused) return
        win.webContents.send('loadModule', modulesFolder+'Settings')
        if (win.isMinimized() || !win.isVisible())
        win.show()
      },
    },
    {
      label: 'Quit Oriøn', click: function () {
        closing = true
        app.quit()
      }
    }
  ])

  if (!fs.existsSync(modulesFolder)) return      
  let modulestmp = fs.readdirSync(data.modules)
  //REMOVE SETTINGS
  if (modulestmp.includes('Settings'))
    modulestmp.splice(modulestmp.indexOf('Settings'), 1)
  //PRIORITY MODULES
  let modules = []
  if (modulestmp.includes('Store')) {
    modules.push('Store')
    modulestmp.splice(modulestmp.indexOf('Store'), 1)
  } if (modulestmp.includes('Library')) {
    modules.push('Library')
    modulestmp.splice(modulestmp.indexOf('Library'), 1)
  } if (modulestmp.includes('Themes')) {
    modules.push('Themes')
    modulestmp.splice(modulestmp.indexOf('Themes'), 1)
  }
  for(i in modulestmp) 
    modules.push(modulestmp[i])
  //ADD SEPARATOR
  contextMenu.insert(0, new MenuItem({
    label: 'Separator', type: 'separator'
  }))
  //ADD MODULES
  for(i in modules) {
    let name = modules[modules.length-i-1]
    let path = modulesFolder+name

    contextMenu.insert(0, new MenuItem({
      label: name, 
      click: function () {
        if (paused) return
        win.webContents.send('loadModule', path)
        if (win.isMinimized() || !win.isVisible())
        win.show()
      }
    }))
  }
  //ADD SEPARATOR
  contextMenu.insert(0, new MenuItem({
    label: 'Separator', type: 'separator'
  }))
  //ADD LOGO & TITLE
  const image = nativeImage.createFromPath(dataFolder+'Images\\logo.ico')
  contextMenu.insert(0, new MenuItem({
    label: 'Oriøn Assistant', type: 'normal', icon: image.resize({ width: 16, height: 16 }), click: null
  }))
  tray.setContextMenu(contextMenu)
}

//GET FILE & FOLDER
async function getFile(title, path) {
  const { dialog } = require('electron')
  if (path == undefined) path = ''
  let result = await dialog.showOpenDialog({
    title: title,
    defaultPath: path,
    properties: ['openFile'],
  }).then(function(files) {
    let file = files.filePaths[0]
    if (file == undefined) {
      return ''
    } else {
      return file
    }
  })
  return result
}

async function getFolder(title, path) {
  const { dialog } = require('electron')
  if (path == undefined) path = ''
  let result = await dialog.showOpenDialog({
    title: title,
    defaultPath: path,
    properties: ['openDirectory'],
  }).then(function(files) {
    let file = files.filePaths[0]
    if (file == undefined) {
      return ''
    } else {
      return file
    }
  })
  return result
}

//OTHER
async function getIcon(iconPath) {
  if (iconPath.toLowerCase().endsWith('.exe')) {
    let result = app.getFileIcon(iconPath, {size:"large"}).then((fileIcon) => {
      if (defImage != fileIcon.toDataURL()) return fileIcon.toDataURL()
      else app.getFileIcon('', {size:"normal"}).then((fileIcon) => { 
        if (defImage != fileIcon.toDataURL()) return fileIcon.toDataURL()
        else return ''
      })
    })
    return result
  } else return iconPath
}