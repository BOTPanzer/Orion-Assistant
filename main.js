const { app, screen, ipcMain, BrowserWindow, Tray, Menu, MenuItem, nativeImage, globalShortcut } = require('electron')
const remoteMain = require('@electron/remote/main')
const fs = require('fs')

let closing = false
let paused = false

let orion = {}

let win = null
let tray = null





 /*$$$$$$                               /$$                           /$$                
| $$__  $$                             | $$                          | $$                
| $$  \ $$ /$$$$$$   /$$$$$$   /$$$$$$$| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$  /$$$$$$$
| $$$$$$$//$$__  $$ /$$__  $$ /$$_____/| $$__  $$ /$$__  $$ /$$_____/| $$  /$$/ /$$_____/
| $$____/| $$  \__/| $$$$$$$$| $$      | $$  \ $$| $$$$$$$$| $$      | $$$$$$/ |  $$$$$$ 
| $$     | $$      | $$_____/| $$      | $$  | $$| $$_____/| $$      | $$_  $$  \____  $$
| $$     | $$      |  $$$$$$$|  $$$$$$$| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$ /$$$$$$$/
|__/     |__/       \_______/ \_______/|__/  |__/ \_______/ \_______/|__/  \__/|______*/ 

//Close app if already open
if (!app.requestSingleInstanceLock()) {
  app.quit()
  return
}

//Show app if opened again
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (!win) return
  if (win.isMinimized()) win.restore()
  if (!win.isVisible()) win.show()
  win.focus()
})

//Quit if no windows
app.on('window-all-closed', app.quit)

//Before quit
app.on('before-quit', () => { 
  tray.destroy()
  closing = true
})





//App ready
app.whenReady().then(() => {

   /*$      /$$           /$$          
  | $$$    /$$$          |__/          
  | $$$$  /$$$$  /$$$$$$  /$$ /$$$$$$$ 
  | $$ $$/$$ $$ |____  $$| $$| $$__  $$
  | $$  $$$| $$  /$$$$$$$| $$| $$  \ $$
  | $$\  $ | $$ /$$__  $$| $$| $$  | $$
  | $$ \/  | $$|  $$$$$$$| $$| $$  | $$
  |__/     |__/ \_______/|__/|__/  |_*/

  //Update orion data
  orion.root = app.getAppPath() + '\\'
  orion.data = orion.root + 'Data\\'
  orion.zip = orion.data + '7-Zip\\7za.exe'
  orion.modules = orion.root + 'Modules\\'

  //Init remote & create window & tray
  remoteMain.initialize()
  createMainWindow()
  createTray()

  //Pause & resume
  ipcMain.on('pause', pause)
  ipcMain.on('resume', resume)

  function pause() {
    win.webContents.send('pause')
    paused = true
  }

  function resume() {
    win.webContents.send('resume')
    paused = false
  }

  



    /*$$$$$            /$$                    
   /$$__  $$          |__/                    
  | $$  \ $$  /$$$$$$  /$$  /$$$$$$  /$$$$$$$ 
  | $$  | $$ /$$__  $$| $$ /$$__  $$| $$__  $$
  | $$  | $$| $$  \__/| $$| $$  \ $$| $$  \ $$
  | $$  | $$| $$      | $$| $$  | $$| $$  | $$
  |  $$$$$$/| $$      | $$|  $$$$$$/| $$  | $$
   \______/ |__/      |__/ \______/ |__/  |_*/   

  //Send special data
  ipcMain.on('specialData', (event, specialData) => {
    event.reply('specialData', specialData)
  })

  //Refresh tray
  ipcMain.on('refreshTray', () => {
    tray.destroy()
    createTray()
  })

  //Restart assistant
  ipcMain.on('restartAssistant', () => {
    win.webContents.reloadIgnoringCache()
    tray.destroy()
    createTray()
  })

  //Create window
  ipcMain.on('createWindow', (event, path, isFile, options) => {
    //Fix args
    if (typeof path !== 'string') return
    if (typeof isFile !== 'boolean') isFile = false
    if (typeof options !== 'object') options = {}
    if (typeof options.width !== 'number') options.width = 1060
    if (typeof options.height !== 'number') options.height = 560

    //Create window
    let customWin = new BrowserWindow(options)
    customWin.removeMenu()

    //Load content
    if (isFile)
      customWin.loadFile(path)
    else
      customWin.loadURL(path)
  })

  //Create Orion window
  ipcMain.on('createOrionWindow', (event, path, specialData, options) => {
    //Fix args
    if (typeof path !== 'string') return
    if (typeof options !== 'object') options = {}
    if (typeof options.width !== 'number') options.width = 1060
    if (typeof options.height !== 'number') options.height = 560

    //Orion window options
    options.frame = false
    options.show = false
    options.webPreferences = {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }

    //Create window
    let customWin = new BrowserWindow(options)
    customWin.removeMenu()

    //Load content
    customWin.loadFile('main-window.html')

    //Add lister & enable remote
    customWin.on('ready-to-show', () => {
      customWin.webContents.send('load', orion, path, specialData)
    })

    remoteMain.enable(customWin.webContents)
  })
  
  //Request file
  ipcMain.on('getFile', async (event, returnTag, title, path, tag) => {
    //Fix args
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof path !== 'string') path = ''
    if (typeof title !== 'string' || title == '') title = 'Choose a File'
    if (typeof tag !== 'string') tag = ''

    //Reply with file
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
  
  //Request folder
  ipcMain.on('getFolder', async (event, returnTag, title, path) => {
    //Fix args
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof title !== 'string' || title == '') title = 'Choose a Folder'
    if (typeof path !== 'string') path = ''
    if (typeof tag !== 'string') tag = ''
    
    //Reply with folder
    event.reply(returnTag, await getFolder(title, path))
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

  //Shortcuts
  ipcMain.on('createShortcut', async function(event, returnTag, shortcut) {
    //Fix args
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof shortcut !== 'string' || shortcut == '') return    //Example: 'CommandOrControl+Alt+S'

    //Register shortcut
    globalShortcut.register(shortcut, () => { event.reply(returnTag) });
  })
  
  //Request icon & base64
  let defLarge = app.getFileIcon('', {size: 'large'})
  let defNormal = app.getFileIcon('', {size: 'normal'})

  ipcMain.on('getIcon', async function(event, returnTag, icon, tag) {
    //Fix path & get it's lower case version
    if (icon.startsWith('?:')) icon = orion.root.substring(0, 2) + icon.substring(2)
    let iconL = icon.toLowerCase()

    //Is base64
    if (icon.toLowerCase().startsWith('data:image') && icon.toLowerCase().includes('base64'))
      event.reply(returnTag, icon, tag)

    //URL
    else if (iconL.startsWith('https://') || iconL.startsWith('http://'))
      event.reply(returnTag, icon, tag)

    //File doesn't exist or isn't a file
    else if (!fs.existsSync(icon) || !fs.statSync(icon).isFile())
      event.reply(returnTag, '', tag)

    //Exe file
    else if (icon.toLowerCase().endsWith('.exe'))
      app.getFileIcon(icon, {size: 'large'}).then((fileIcon) => {
        if (fileIcon.toDataURL() != defLarge) 
          return event.reply(returnTag, fileIcon.toDataURL(), tag)
        else app.getFileIcon(icon, {size: 'normal'}).then((fileIcon) => {
          if (fileIcon.toDataURL() != defNormal) 
            return event.reply(returnTag, fileIcon.toDataURL(), tag)
          else return event.reply(returnTag, '', tag)
        })
      })

    //Normal image
    else if (iconL.endsWith('.jpeg') || iconL.endsWith('.jpg') ||
            iconL.endsWith('.apng') || iconL.endsWith('.png') ||
            iconL.endsWith('.gif') || iconL.endsWith('.png') ||
            iconL.endsWith('.bmp') || iconL.endsWith('.ico') || 
            iconL.endsWith('.webp'))
      event.reply(returnTag, icon, tag)

    //No image
    else event.reply(returnTag, '', tag)
  })

  ipcMain.on('getBase64', async function(event, returnTag, path, tag) {
    //Is base64
    if (path.toLowerCase().startsWith('data:image') && path.toLowerCase().includes('base64'))
      return event.reply(returnTag, path, tag)

    //File doesn't exist or isn't a file
    else if (!fs.existsSync(path) || !fs.statSync(path).isFile())
      return event.reply(returnTag, '', tag)

    //Exe file
    else if (path.toLowerCase().endsWith('.exe')) {
      return app.getFileIcon(path, {size: 'large'}).then((value) => {
        if (value.toDataURL() != defLarge) return event.reply(returnTag, value.toDataURL(), tag)
        else app.getFileIcon(path, {size: 'normal'}).then((value) => {
          if (value.toDataURL() != defNormal) return event.reply(returnTag, value.toDataURL(), tag)
          else return event.reply(returnTag, '', tag)
        })
      })
    }

    //Normal image
    else if (path.toLowerCase().endsWith('.jpeg') || path.toLowerCase().endsWith('.jpg') ||
            path.toLowerCase().endsWith('.apng') || path.toLowerCase().endsWith('.png') ||
            path.toLowerCase().endsWith('.gif') || path.toLowerCase().endsWith('.png') ||
            path.toLowerCase().endsWith('.bmp') || path.toLowerCase().endsWith('.ico') || 
            path.toLowerCase().endsWith('.webp'))
      return event.reply(returnTag, 'data:image/png;base64,' + fs.readFileSync(path, 'base64'), tag)

    //No image
    else return event.reply(returnTag, '', tag)
  })
})





 /*$      /$$ /$$                 /$$                                /$$$           /$$$$$$$$                          
| $$  /$ | $$|__/                | $$                               /$$ $$         |__  $$__/                          
| $$ /$$$| $$ /$$ /$$$$$$$   /$$$$$$$  /$$$$$$  /$$  /$$  /$$      |  $$$             | $$  /$$$$$$  /$$$$$$  /$$   /$$
| $$/$$ $$ $$| $$| $$__  $$ /$$__  $$ /$$__  $$| $$ | $$ | $$       /$$ $$/$$         | $$ /$$__  $$|____  $$| $$  | $$
| $$$$_  $$$$| $$| $$  \ $$| $$  | $$| $$  \ $$| $$ | $$ | $$      | $$  $$_/         | $$| $$  \__/ /$$$$$$$| $$  | $$
| $$$/ \  $$$| $$| $$  | $$| $$  | $$| $$  | $$| $$ | $$ | $$      | $$\  $$          | $$| $$      /$$__  $$| $$  | $$
| $$/   \  $$| $$| $$  | $$|  $$$$$$$|  $$$$$$/|  $$$$$/$$$$/      |  $$$$/$$         | $$| $$     |  $$$$$$$|  $$$$$$$
|__/     \__/|__/|__/  |__/ \_______/ \______/  \_____/\___/        \____/\_/         |__/|__/      \_______/ \____  $$
                                                                                                              /$$  | $$
                                                                                                             |  $$$$$$/
                                                                                                              \_____*/ 

//Main window
function createMainWindow() {
  //Get settings
  let window = getKey('window')
  if (typeof window !== 'object') window = {}
  if (typeof window.width !== 'number') window.width = 1160
  if (typeof window.height !== 'number') window.height = 660
  if (typeof window.isMaximized !== 'boolean') window.isMaximized = false

  //Create window
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
  win.removeMenu()
  //win.webContents.openDevTools()

  //Add listeners & enable remote
  win.on('ready-to-show', () => {
    win.webContents.send('load', orion)
    if (window.isMaximized) win.maximize()
    if (!app.commandLine.hasSwitch('hidden')) win.show()
  })

  win.on('close', (event) => {
    if (closing) return
    event.preventDefault()
    win.hide()
  })

  win.on('resize', () => {
    let size = win.getBounds()
    window.height = size.height
    window.width = size.width
    setKey('window', window)
  })

  win.on('maximize', () => {
    window.isMaximized = win.isMaximized()
    setKey('window', window)
  })

  win.on('unmaximize', () => {
    window.isMaximized = win.isMaximized()
    setKey('window', window)
  })
  
  remoteMain.enable(win.webContents)

  //Load content
  win.loadFile('main.html')
}

//Tray
function createTray() {
  //Create tray
  let trayMenu = new Tray(orion.data+'Images\\logo.ico')
  trayMenu.setToolTip('Oriøn Assistant')

  //Add menus
  tray = trayMenu
  updateTray()

  //Add doble click function
  trayMenu.on('double-click', () => { win.show() })
}

function updateTray() {
  //Create menu with settings & quit buttons
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings', click: function() {
        if (paused) return
        win.webContents.send('loadModule', orion.modules+'Settings')
        if (win.isMinimized() || !win.isVisible())
        win.show()
      },
    },
    {
      label: 'Quit Oriøn', click: () => {
        app.quit()
      }
    }
  ])

  if (!fs.existsSync(orion.modules)) return
  let modulestmp = fs.readdirSync(orion.modules)

  //Remove settings
  if (modulestmp.includes('Settings'))
    modulestmp.splice(modulestmp.indexOf('Settings'), 1)

  //Priority modules
  let modules = []
  if (modulestmp.includes('Library')) {
    modules.push('Library')
    modulestmp.splice(modulestmp.indexOf('Library'), 1)
  } if (modulestmp.includes('Store')) {
    modules.push('Store')
    modulestmp.splice(modulestmp.indexOf('Store'), 1)
  }  if (modulestmp.includes('Themes')) {
    modules.push('Themes')
    modulestmp.splice(modulestmp.indexOf('Themes'), 1)
  }
  for(i in modulestmp) modules.push(modulestmp[i])

  //Add separator
  contextMenu.insert(0, new MenuItem({ label: 'Separator', type: 'separator' }))

  //Main key to see if hidden
  let main = getKey('main')
  if (main == undefined) main = {}
  if (!Array.isArray(main.visible)) {
    main.visible = ['Themes']
    setKey('main', main)
  }

  //Add modules
  for(i in modules) {
    //Data
    let name = modules[modules.length-i-1]
    let path = orion.modules+name
    if (!main.visible.includes(name) && name != 'Library' && name != 'Store') continue
    
    //Add module
    contextMenu.insert(0, new MenuItem({
      label: name, 
      click: function() {
        if (paused) return
        win.webContents.send('loadModule', path)
        if (win.isMinimized() || !win.isVisible())
        win.show()
      }
    }))
  }

  //Add separator
  contextMenu.insert(0, new MenuItem({ label: 'Separator', type: 'separator' }))

  //Add logo & title
  const image = nativeImage.createFromPath(orion.data+'Images\\logo.ico')
  contextMenu.insert(0, new MenuItem({
    label: 'Oriøn Assistant', type: 'normal', icon: image.resize({ width: 16, height: 16 }), click: function () {
      win.webContents.send('noti', 'Oriøn Assistant', 'v' + app.getVersion())
      win.show()
    }
  }))
  tray.setContextMenu(contextMenu)
}





 /*$$$$$$              /$$              
| $$__  $$            | $$              
| $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ 
| $$  | $$ |____  $$|_  $$_/   |____  $$
| $$  | $$  /$$$$$$$  | $$      /$$$$$$$
| $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$
| $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$
|_______/  \_______/   \___/   \______*/

let json = {}

function refreshData() {
  //Get path & check for file
  let jsonPath = orion.data + 'settings.json'
  if (fs.existsSync(jsonPath)) 
    //File exists -> Read it
    json = JSON.parse(fs.readFileSync(jsonPath))
  else {
    //File does not exist -> Create it
    json = {}
    fs.writeFile(jsonPath, JSON.stringify(json, null, 2), function(err) {if (err) console.log(err)})
  }
}

function setKey(key, value) {
  //Refresh settings, update them & save file
  refreshData()
  json[key] = value
  fs.writeFileSync(orion.data+'settings.json', JSON.stringify(json, null, 2))
}

function getKey(key) {
  //Refresh settings & get key
  refreshData()
  return json[key]
}