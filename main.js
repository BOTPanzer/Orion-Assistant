const { app, ipcMain, BrowserWindow, Tray, Menu, MenuItem, nativeImage } = require('electron')
const remoteMain = require("@electron/remote/main")
const fs = require('fs')

//STATE
let closing = false
let paused = false
//DATA
let win = null
let tray = null
let data = {}
let json = null
let defImage = null
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

  data.root = app.getAppPath()+'\\'
  data.data = data.root+'Data\\'
  data.zip = data.data+'7-Zip\\7z.exe'
  data.modules = data.root+'Modules\\'

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
      win.webContents.send('loadModule', data.modules+path, specialData)
  })

  //SEND SPECIAL DATA
  ipcMain.on('specialData', (event, specialData) => {
    win.webContents.send('specialData', specialData)
  })

  //RESTART ASSISTANT
  ipcMain.on('restartAssistant', function() {
    win.reload()
    tray.destroy()
    createTray()
  })

  //CREATE SIMPLE WINDOW
  ipcMain.on('newSimpleWindow', (event, path, isFile, isResizable, width, height) => {
    if (path == undefined) return
    if (isFile == undefined) isFile = false
    if (isResizable == undefined) isResizable = true
    if (width == undefined) width = 950
    if (height == undefined) height = 540

    let options = {
      width: width,
      height: height,
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
    if (width == undefined) width = 950
    if (height == undefined) height = 540
    if (resumeOnClose == undefined) resumeOnClose = false

    let options = {
      width: width,
      height: height,
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
    iconPath = iconPath.replaceAll('"', '')
    if (iconPath.toLowerCase().endsWith('.exe'))
      getIcon(iconPath).then((value) => {
        if (defImage != value) event.reply('changeIcon', img, value, actualPath) 
      })
    else if (iconPath.toLowerCase().endsWith('.jpeg') || iconPath.toLowerCase().endsWith('.jpg') || 
             iconPath.toLowerCase().endsWith('.gif') || iconPath.toLowerCase().endsWith('.png') || 
             iconPath.toLowerCase().endsWith('.apng') || iconPath.toLowerCase().endsWith('.png') || 
             iconPath.toLowerCase().endsWith('.bmp') || iconPath.toLowerCase().endsWith('.ico'))
      event.reply('changeIcon', img, iconPath, actualPath)
    else event.reply('changeIcon', img, 'Data/Images/iconFile.png', actualPath)
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
  refreshData()
  if (json.state == undefined) 
    json.state = {}
  if (json.state.width == undefined)
    json.state.width = 960
  if (json.state.height == undefined)
    json.state.height = 550
  if (json.state.isMaximized == undefined)
    json.state.isMaximized = false

  win = new BrowserWindow({
    width: json.state.width,
    height: json.state.height,
    minWidth: 800,
    minHeight: 460,
    frame: false,
    opacity: 0,
    show: !app.commandLine.hasSwitch("hidden"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('main.html')
  win.removeMenu()
  //win.openDevTools()

  win.on('ready-to-show', function (event) {
    if (json.state.isMaximized) win.maximize()
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

  win.on('resize', function (event) {
    let state = json.state
    if (!win.isMaximized())
      state = win.getBounds()
    state.isMaximized = win.isMaximized()
    setData('state', state)
  })
   
  remoteMain.enable(win.webContents)
}

function createTray() {
  let trayMenu = new Tray(data.data+'Images\\logo.ico')

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
        win.webContents.send('loadModule', data.modules+'Settings')
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

  if (!fs.existsSync(data.modules)) return      
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
    //DATA
    let name = modules[modules.length-i-1]
    let path = data.modules+name
    if (fs.existsSync(path+'/hidden')) continue
    //ADD MODULE
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
  const image = nativeImage.createFromPath(data.data+'Images\\logo.ico')
  contextMenu.insert(0, new MenuItem({
    label: 'Oriøn Assistant', type: 'normal', icon: image.resize({ width: 16, height: 16 }), click: function () {
      win.webContents.send('noti', 'Oriøn Assistant:', 'v'+app.getVersion())
    }
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

//DATA FUNCTIONS
function refreshData() {
  let jsonPath = data.data+'settings.json'
  if (fs.existsSync(jsonPath)) 
    json = JSON.parse(fs.readFileSync(jsonPath))
  else {
    json = {}
    fs.writeFile(jsonPath, '{}', function(err) {if (err) console.log(err)})
  }
}

function setData(key, value) {
  refreshData()
  json[key] = value
  fs.writeFileSync(data.data+'settings.json', JSON.stringify(json))
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