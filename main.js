const { app, ipcMain, BrowserWindow, Tray, Menu, MenuItem, nativeImage } = require('electron')
const remoteMain = require("@electron/remote/main")
const fs = require('fs')

let closing = false
let paused = false

let win = null
let tray = null
let data = {}


//IF APP IS ALREADY OPEN THEN CLOSE
if (!app.requestSingleInstanceLock()) { 
  closing = true
  app.quit()
}

//SHOW APP IF OPENED AGAIN
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (win && (win.isMinimized() || !win.isVisible())) win.show()
})

//APP READY
app.whenReady().then(() => {

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

  //REFRESH TRAY
  ipcMain.on('refreshTray', function() {
    tray.destroy()
    createTray()
  })

  //CREATE SIMPLE WINDOW
  ipcMain.on('newSimpleWindow', (event, path, isFile, isResizable, width, height) => {
    if (typeof path !== 'string') return
    if (typeof isFile !== 'boolean') isFile = false
    if (typeof isResizable !== 'boolean') isResizable = true
    if (typeof width !== 'number') width = 1060
    if (typeof height !== 'number') height = 560

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
  ipcMain.on('newOrionWindow', (event, path, isResizable, width, height, specialData) => {
    if (typeof path !== 'string') return
    if (typeof isResizable !== 'boolean') isResizable = true
    if (typeof width !== 'number') width = 1060
    if (typeof height !== 'number') height = 560

    let customWin = new BrowserWindow({
      width: width,
      height: height,
      frame: false,
      show: false,
      resizable: isResizable,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    })

    customWin.loadFile('main-window.html')
    customWin.removeMenu()
    //customWin.openDevTools()

    customWin.on('ready-to-show', () => {
      customWin.webContents.send('load', path, data, specialData)
    })

    remoteMain.enable(customWin.webContents)
  })
  
  //REQUEST ICON & BASE64
  let defLarge = app.getFileIcon('', {size:"large"})
  let defNormal = app.getFileIcon('', {size:"normal"})

  ipcMain.on('getIcon', async function(event, returnTag, icon, tag) {
    let iconL = icon.toLowerCase()
    //FILE DOESN'T EXIST OR ISN'T A FILE
    if (!fs.existsSync(icon) || !fs.statSync(icon).isFile())
      event.reply(returnTag, '', tag)
    //BASE64
    if (icon.toLowerCase().startsWith('data:image') && icon.toLowerCase().includes('base64'))
      event.reply(returnTag, icon, tag)
    //EXE FILE
    else if (icon.toLowerCase().endsWith('.exe'))
      app.getFileIcon(icon, {size:"large"}).then((fileIcon) => {
        if (fileIcon.toDataURL() != defLarge) 
          return event.reply(returnTag, fileIcon.toDataURL(), tag)
        else app.getFileIcon(icon, {size:"normal"}).then((fileIcon) => {
          if (fileIcon.toDataURL() != defNormal) 
            return event.reply(returnTag, fileIcon.toDataURL(), tag)
          else return event.reply(returnTag, '', tag)
        })
      })
    //NORMAL IMAGE
    else if (iconL.endsWith('.jpeg') || iconL.endsWith('.jpg') ||
             iconL.endsWith('.apng') || iconL.endsWith('.png') ||
             iconL.endsWith('.gif') || iconL.endsWith('.png') ||
             iconL.endsWith('.bmp') || iconL.endsWith('.ico') || 
             iconL.endsWith('.webp'))
      event.reply(returnTag, icon, tag)
    //NO IMAGE
    else event.reply(returnTag, '', tag)
  })

  ipcMain.on('getBase64', async function(event, returnTag, path, tag) {
    //FILE DOESN'T EXIST OR ISN'T A FILE
    if (!fs.existsSync(path) || !fs.statSync(path).isFile())
      return event.reply(returnTag, '', tag)
    //IS BASE64
    if (path.toLowerCase().startsWith('data:image') && path.toLowerCase().includes('base64'))
      return event.reply(returnTag, path, tag)
    //EXE FILE
    else if (path.toLowerCase().endsWith('.exe')) {
      return app.getFileIcon(path, {size:"large"}).then((value) => {
        if (value.toDataURL() != defLarge) return event.reply(returnTag, value.toDataURL(), tag)
        else app.getFileIcon(path, {size:"normal"}).then((value) => {
          if (value.toDataURL() != defNormal) return event.reply(returnTag, value.toDataURL(), tag)
          else return event.reply(returnTag, '', tag)
        })
      })
    }
    //NORMAL IMAGE
    else if (path.toLowerCase().endsWith('.jpeg') || path.toLowerCase().endsWith('.jpg') ||
             path.toLowerCase().endsWith('.apng') || path.toLowerCase().endsWith('.png') ||
             path.toLowerCase().endsWith('.gif') || path.toLowerCase().endsWith('.png') ||
             path.toLowerCase().endsWith('.bmp') || path.toLowerCase().endsWith('.ico') || 
             path.toLowerCase().endsWith('.webp'))
      return event.reply(returnTag, 'data:image/png;base64,'+fs.readFileSync(path, 'base64'), tag)
    //NO IMAGE
    else return event.reply(returnTag, '', tag)
  })

  //REQUEST FILE
  ipcMain.on('getFile', async function(event, returnTag, title, path, tag) {
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof path !== 'string') path = ''
    if (typeof title !== 'string' || title == '') title = 'Choose a File'
    if (typeof tag !== 'string') tag = ''

    event.reply(returnTag, await getFile(title, path), tag)
  })

  async function getFile(title, path) {
    const { dialog } = require('electron')
    let result = await dialog.showOpenDialog({
      title: title,
      defaultPath: path,
      properties: ['openFile'],
    }).then(function(files) {
      let file = files.filePaths[0]
      if (file == undefined) 
        return ''
      else 
        return file
    })
    return result
  }
  
  //REQUEST FOLDER
  ipcMain.on('getFolder', async function(event, returnTag, title, path, tag) {
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof path !== 'string') path = ''
    if (typeof title !== 'string' || title == '') title = 'Choose a Folder'
    if (typeof tag !== 'string') tag = ''

    event.reply(returnTag, await getFolder(title, path), tag)
  })

  async function getFolder(title, path) {
    const { dialog } = require('electron')
    let result = await dialog.showOpenDialog({
      title: title,
      defaultPath: path,
      properties: ['openDirectory'],
    }).then(function(files) {
      let file = files.filePaths[0]
      if (file == undefined) 
        return ''
      else 
        return file
    })
    return result
  }
})





 /*$      /$$ /$$$$$$ /$$   /$$ /$$$$$$$   /$$$$$$  /$$      /$$        /$$$           /$$$$$$$$ /$$$$$$$   /$$$$$$  /$$     /$$
| $$  /$ | $$|_  $$_/| $$$ | $$| $$__  $$ /$$__  $$| $$  /$ | $$       /$$ $$         |__  $$__/| $$__  $$ /$$__  $$|  $$   /$$/
| $$ /$$$| $$  | $$  | $$$$| $$| $$  \ $$| $$  \ $$| $$ /$$$| $$      |  $$$             | $$   | $$  \ $$| $$  \ $$ \  $$ /$$/ 
| $$/$$ $$ $$  | $$  | $$ $$ $$| $$  | $$| $$  | $$| $$/$$ $$ $$       /$$ $$/$$         | $$   | $$$$$$$/| $$$$$$$$  \  $$$$/  
| $$$$_  $$$$  | $$  | $$  $$$$| $$  | $$| $$  | $$| $$$$_  $$$$      | $$  $$_/         | $$   | $$__  $$| $$__  $$   \  $$/   
| $$$/ \  $$$  | $$  | $$\  $$$| $$  | $$| $$  | $$| $$$/ \  $$$      | $$\  $$          | $$   | $$  \ $$| $$  | $$    | $$    
| $$/   \  $$ /$$$$$$| $$ \  $$| $$$$$$$/|  $$$$$$/| $$/   \  $$      |  $$$$/$$         | $$   | $$  | $$| $$  | $$    | $$    
|__/     \__/|______/|__/  \__/|_______/  \______/ |__/     \__/       \____/\_/         |__/   |__/  |__/|__/  |__/    |_*/  

//WINDOW
function createWindow() {
  let window = getKey('window')
  if (window == undefined) 
    window = {}
  if (window.width == undefined)
    window.width = 1160
  if (window.height == undefined)
    window.height = 660
  if (window.isMaximized == undefined)
    window.isMaximized = false

  win = new BrowserWindow({
    width: window.width,
    height: window.height,
    minWidth: 830,
    minHeight: 470,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('main.html')
  win.removeMenu()
  //win.openDevTools()

  win.on('ready-to-show', () => {
    if (window.isMaximized) win.maximize()
    win.webContents.send('data', data)
    if (!app.commandLine.hasSwitch("hidden")) win.show()
  })

  win.on('close', (event) => {
    if (closing)
      tray.destroy()
    else {
      event.preventDefault()
      win.hide()
    }
  })

  win.on('resize', () => {
    if (!win.isMaximized())
      window = win.getBounds()
    window.isMaximized = win.isMaximized()
    setKey('window', window)
  })
   
  remoteMain.enable(win.webContents)
}

//TRAY
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
      win.webContents.send('noti', 'Oriøn Assistant', 'v'+app.getVersion())
      win.show()
    }
  }))
  tray.setContextMenu(contextMenu)
}





 /*$$$$$$   /$$$$$$  /$$$$$$$$ /$$$$$$ 
| $$__  $$ /$$__  $$|__  $$__//$$__  $$
| $$  \ $$| $$  \ $$   | $$  | $$  \ $$
| $$  | $$| $$$$$$$$   | $$  | $$$$$$$$
| $$  | $$| $$__  $$   | $$  | $$__  $$
| $$  | $$| $$  | $$   | $$  | $$  | $$
| $$$$$$$/| $$  | $$   | $$  | $$  | $$
|_______/ |__/  |__/   |__/  |__/  |_*/

let json = {}

function refreshData() {
  let jsonPath = data.data+'settings.json'
  if (fs.existsSync(jsonPath)) 
    json = JSON.parse(fs.readFileSync(jsonPath))
  else {
    json = {}
    fs.writeFile(jsonPath, JSON.stringify(json, null, 2), function(err) {if (err) console.log(err)})
  }
}

function setKey(key, value) {
  refreshData()
  json[key] = value
  fs.writeFileSync(data.data+'settings.json', JSON.stringify(json, null, 2))
}

function getKey(key) {
  refreshData()
  return json[key]
}