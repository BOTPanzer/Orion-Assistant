const { app, ipcMain, BrowserWindow, Tray, Menu, MenuItem, nativeImage, globalShortcut } = require('electron')
const remoteMain = require('@electron/remote/main')
const fs = require('fs')

//State
let isClosing = false
let isPaused = false

//Orion data
let orion = {}

//Modules
let modules = []

//Window & Tray
let win, tray





  /*$$$$$
 /$$__  $$
| $$  \ $$  /$$$$$$   /$$$$$$
| $$$$$$$$ /$$__  $$ /$$__  $$
| $$__  $$| $$  \ $$| $$  \ $$
| $$  | $$| $$  | $$| $$  | $$
| $$  | $$| $$$$$$$/| $$$$$$$/
|__/  |__/| $$____/ | $$____/
          | $$      | $$
          | $$      | $$
          |__/      |_*/

//Close app if already open
if (!app.requestSingleInstanceLock()) {
  app.quit()
  return
}

//Show app if opened again
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (!win) return
  win.restore()
  win.show()
  win.focus()
})

//Destroy tray before quit
app.on('before-quit', () => { 
  isClosing = true
  tray.destroy()
})

//Quit if no windows
app.on('window-all-closed', app.quit) 






 /*$$$$$$              /$$
| $$__  $$            | $$
| $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ 
| $$  | $$ |____  $$|_  $$_/   |____  $$
| $$  | $$  /$$$$$$$  | $$      /$$$$$$$
| $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$
| $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$
|_______/  \_______/   \___/   \______*/

//Database (update both here & in orion-asistant.js)
class DB {
  //Default json (if a key from <jsonDefault> is missing in <json>, it will be copied over)
  static jsonDefault = {
    main: {
      sidebarOpen: false,
      minimizeToTray: false,
      visible: ['Store', 'Themes']
    },
    window: {
      width: 1160,
      height: 660,
      isMaximized: false
    },
    modules: {}
  }

  //Current open json
  json = {}


  constructor() {}
  
  //Data repairing
  #repairKey(current, currentDefault) {
    //Key changed
    let keyRepaired = false
    
    //Check keys
    Object.keys(currentDefault).forEach(key => {
      //Get key type
      const type = typeof currentDefault[key]
      const isArray = Array.isArray(currentDefault[key])
      const isObject = !isArray && type == 'object'
  
      //Check if both are same type
      if (type != typeof current[key]) {
        //Is an array -> Copy array (will only work with one dimensional arrays with no objects)
        if (isArray) current[key] = [...currentDefault[key]]

        //Is an object -> Create a new one
        else if (isObject) current[key] = {}

        //Is something else -> Copy value
        else current[key] = currentDefault[key]
  
        //A change was made
        keyRepaired = true
      }
  
      //Key is an object -> Check it too
      if (isObject) keyRepaired = this.#repairKey(current[key], currentDefault[key]) || keyRepaired
    });
  
    //Return key changed
    return keyRepaired
  }

  #repair() {
    //Make json an object
    if (typeof this.json != 'object') this.json = {}
  
    //Start repairing data from root
    return this.#repairKey(this.json, DB.jsonDefault)
  
    //Returns true if json was repaired, aka it had something missing
  }

  //Refresh data (read file again)
  #refresh() {
    //Try reading file
    try {
      this.json = JSON.parse(fs.readFileSync(orion.settings))
    } catch {
      this.json = {}
    }
    
    //Data was repaired -> Save file
    if (this.#repair()) fs.writeFileSync(orion.settings, JSON.stringify(this.json, null, 2))
  }

  //Load/Save keys
  #getParent(keyPath) {
    //Remove '/' from the end
    while (keyPath.endsWith('/')) keyPath = keyPath.slice(0, -1)

    //Get key parent from path
    const keys = keyPath.split('/')
    const lastKey = keys[keys.length - 1]
    let parent = this.json
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (parent[k] == undefined) parent[k] = {}
      parent = parent[k] 
    }

    //Return parent
    return [parent, lastKey]
  }

  get(keyPath, fallback, origin) {
    //Default values
    if (typeof origin !== 'string') origin = ''
    if (typeof keyPath !== 'string') keyPath = ''

    //Refresh settings
    this.#refresh()
    
    //Get parent folder
    const [parent, lastKey] = this.#getParent(origin ? origin + keyPath : keyPath)

    //Return key
    return lastKey ? (parent[lastKey] == undefined ? fallback : parent[lastKey]) : parent
  }

  set(keyPath, value, origin) {
    //Default values
    if (typeof origin !== 'string') origin = ''

    //Refresh settings
    this.#refresh()

    //Items to save (path can be an object instead of a path)
    const items = typeof keyPath !== 'string' ? keyPath : { [keyPath]: value }
    
    //Save items
    Object.keys(items).forEach(keyPath => {
      //Get parent folder
      const [parent, lastKey] = this.#getParent(origin ? origin + keyPath : keyPath)
      
      //Update value
      parent[lastKey] = items[keyPath]
    })

    //Save json
    fs.writeFileSync(orion.settings, JSON.stringify(this.json, null, 2))
  }
}

const db = new DB()





 /*$      /$$           /$$          
| $$$    /$$$          |__/          
| $$$$  /$$$$  /$$$$$$  /$$ /$$$$$$$ 
| $$ $$/$$ $$ |____  $$| $$| $$__  $$
| $$  $$$| $$  /$$$$$$$| $$| $$  \ $$
| $$\  $ | $$ /$$__  $$| $$| $$  | $$
| $$ \/  | $$|  $$$$$$$| $$| $$  | $$
|__/     |__/ \_______/|__/|__/  |_*/

//App ready
app.whenReady().then(() => {

  //Update orion data
  orion.root = app.getAppPath() + '\\'
  orion.data = orion.root + 'Data\\'
  orion.settings = orion.data + 'settings.json'
  orion.zip = orion.data + '7-Zip\\7za.exe'
  orion.modules = orion.root + 'Modules\\'

  //Init remote & create window & tray
  remoteMain.initialize()
  createMainWindow()
  createTray()

  //Pause & resume
  ipcMain.on('pause', pause)
  ipcMain.on('resume', resume)

  function pause(event) {
    //Send pause
    if (typeof event === 'object')
      event.reply('pause')
    else
      win.webContents.send('pause')
      
    //Update is paused if main window asked to
    const isMainWindow = (win.webContents == event.sender)
    if (isMainWindow) isPaused = true
  }

  function resume(event) {
    //Send resume
    if (typeof event === 'object')
      event.reply('resume')
    else
      win.webContents.send('resume')

    //Update is paused if main window asked to
    const isMainWindow = (win.webContents == event.sender)
    if (isMainWindow) isPaused = false
  }
  
  //Modules
  function getModule(name) {
    for (let i = 0; i < modules.length; i++)
      if (modules[i].name == name)
        return modules[i]
  }

  



    /*$$$$$            /$$                    
   /$$__  $$          |__/                    
  | $$  \ $$  /$$$$$$  /$$  /$$$$$$  /$$$$$$$ 
  | $$  | $$ /$$__  $$| $$ /$$__  $$| $$__  $$
  | $$  | $$| $$  \__/| $$| $$  \ $$| $$  \ $$
  | $$  | $$| $$      | $$| $$  | $$| $$  | $$
  |  $$$$$$/| $$      | $$|  $$$$$$/| $$  | $$
   \______/ |__/      |__/ \______/ |__/  |_*/   

  //Refresh tray
  ipcMain.on('refreshTray', updateTray)

  //Update modules list
  ipcMain.on('modules', (event, _modules) => { modules = _modules; })

  //Intent data
  ipcMain.on('intent', (event, data) => { event.reply('intent', data) })

  //Quit assistant
  ipcMain.on('quitAssistant', app.quit)

  //Restart assistant
  ipcMain.on('restartAssistant', () => {
    win.webContents.reloadIgnoringCache()
    updateTray()
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
  ipcMain.on('createOrionWindow', (event, path, intentData, options) => {
    //Fix args
    if (typeof path !== 'string') return
    if (typeof options !== 'object') options = {}
    if (typeof options.width !== 'number') options.width = 1060
    if (typeof options.height !== 'number') options.height = 560

    //Path must be inside modules folder
    if (!path.startsWith(orion.modules)) return
  
    //Path must be inside a module folder
    const relativePath = path.substring(orion.modules.length).replaceAll('\\', '/')
    const slashIndex = relativePath.indexOf('/')
    if (slashIndex == -1 ) return
  
    //Get module
    const module = getModule(relativePath.substring(0, slashIndex))
    if (module == undefined) return

    //Orion window options
    options.show = false
    options.frame = false
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
      customWin.webContents.send('load', orion, module, path, intentData)
    })

    remoteMain.enable(customWin.webContents)
  })
  
  //Request file
  ipcMain.on('getFile', async (event, returnTag, windowTitle, startPath, id) => {
    //Fix args
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof startPath !== 'string') startPath = ''
    if (typeof windowTitle !== 'string' || windowTitle == '') windowTitle = 'Choose a File'

    //Reply with file
    event.reply(returnTag, await getFile(windowTitle, startPath), id)
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
  ipcMain.on('getFolder', async (event, returnTag, windowTitle, startPath, id) => {
    //Fix args
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof windowTitle !== 'string' || windowTitle == '') windowTitle = 'Choose a Folder'
    if (typeof startPath !== 'string') startPath = ''
    if (typeof tag !== 'string') tag = ''
    
    //Reply with folder
    event.reply(returnTag, await getFolder(windowTitle, startPath), id)
  })

  async function getFolder(title, path) {
    const { dialog } = require('electron')
    let result = await dialog.showOpenDialog({
      title: title,
      defaultPath: path,
      properties: ['openDirectory'],
    }).then((files) => {
      let file = files.filePaths[0]
      if (file == undefined) 
        return ''
      else 
        return file
    })
    return result
  }
  
  //Request icon
  const iconDefaultLarge = app.getFileIcon('', {size: 'large'})
  const iconDefaultNormal = app.getFileIcon('', {size: 'normal'})

  ipcMain.on('getIcon', async (event, returnTag, iconPath, id) => {
    //Fix path & get its lower case version
    if (iconPath.startsWith('?:')) iconPath = orion.root.substring(0, 2) + iconPath.substring(2)
    const iconL = iconPath.toLowerCase()

    //Is base64
    if (iconPath.toLowerCase().startsWith('data:image') && iconPath.toLowerCase().includes('base64'))
      event.reply(returnTag, iconPath, id)

    //URL
    else if (iconL.startsWith('https://') || iconL.startsWith('http://'))
      event.reply(returnTag, iconPath, id)

    //File doesn't exist or isn't a file
    else if (!fs.existsSync(iconPath) || !fs.statSync(iconPath).isFile())
      event.reply(returnTag, '', id)

    //Exe file
    else if (iconPath.toLowerCase().endsWith('.exe'))
      app.getFileIcon(iconPath, {size: 'large'}).then((value) => {
        if (value.toDataURL() != iconDefaultLarge) 
          return event.reply(returnTag, value.toDataURL(), id)
        else app.getFileIcon(iconPath, {size: 'normal'}).then((value) => {
          if (value.toDataURL() != iconDefaultNormal) 
            return event.reply(returnTag, value.toDataURL(), id)
          else 
            return event.reply(returnTag, '', id)
        })
      })

    //Normal image
    else if (iconL.endsWith('.jpeg') || iconL.endsWith('.jpg') ||
            iconL.endsWith('.apng') || iconL.endsWith('.png') ||
            iconL.endsWith('.gif') || iconL.endsWith('.png') ||
            iconL.endsWith('.bmp') || iconL.endsWith('.ico') || 
            iconL.endsWith('.webp'))
      event.reply(returnTag, iconPath, id)

    //No image
    else event.reply(returnTag, '', id)
  })

  ipcMain.on('getIconBase64', async (event, returnTag, iconPath, id) => {
    //Is base64
    if (iconPath.toLowerCase().startsWith('data:image') && iconPath.toLowerCase().includes('base64'))
      event.reply(returnTag, iconPath, id)

    //File doesn't exist or isn't a file
    else if (!fs.existsSync(iconPath) || !fs.statSync(iconPath).isFile())
      event.reply(returnTag, '', id)

    //Exe file
    else if (iconPath.toLowerCase().endsWith('.exe')) {
      app.getFileIcon(iconPath, {size: 'large'}).then((value) => {
        if (value.toDataURL() != iconDefaultLarge) 
          return event.reply(returnTag, value.toDataURL(), id)
        else app.getFileIcon(iconPath, {size: 'normal'}).then((value) => {
          if (value.toDataURL() != iconDefaultNormal) 
            return event.reply(returnTag, value.toDataURL(), id)
          else 
            return event.reply(returnTag, '', id)
        })
      })
    }

    //Normal image
    else if (iconPath.toLowerCase().endsWith('.jpeg') || iconPath.toLowerCase().endsWith('.jpg') ||
            iconPath.toLowerCase().endsWith('.apng') || iconPath.toLowerCase().endsWith('.png') ||
            iconPath.toLowerCase().endsWith('.gif') || iconPath.toLowerCase().endsWith('.png') ||
            iconPath.toLowerCase().endsWith('.bmp') || iconPath.toLowerCase().endsWith('.ico') || 
            iconPath.toLowerCase().endsWith('.webp'))
      event.reply(returnTag, 'data:image/png;base64,' + fs.readFileSync(iconPath, 'base64'), id)

    //No image
    else event.reply(returnTag, '', id)
  })

  //Shortcuts
  ipcMain.on('createShortcut', async (event, returnTag, shortcut) => {
    //Fix args
    if (typeof returnTag !== 'string' || returnTag == '') return
    if (typeof shortcut !== 'string' || shortcut == '') return    //Example: 'CommandOrControl+Alt+S'

    //Register shortcut
    globalShortcut.register(shortcut, () => { event.reply(returnTag) });
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
  //Get window settings
  const window = db.get('window')

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
  
  //Add listeners
  win.on('ready-to-show', () => {
    win.webContents.send('load', orion)
    if (window.isMaximized) win.maximize()
    if (!app.commandLine.hasSwitch('hidden')) win.show()
  })

  win.on('close', (event) => {
    //Close window or quit app
    const main = db.get('main')
    if (isClosing || !main.minimizeToTray) return
    event.preventDefault()
    win.hide()
  })

  win.on('resize', () => {
    const size = win.getBounds()
    window.height = size.height
    window.width = size.width
    db.set('window', window)
  })

  win.on('maximize', () => {
    window.isMaximized = win.isMaximized()
    db.set('window', window)
  })

  win.on('unmaximize', () => {
    window.isMaximized = win.isMaximized()
    db.set('window', window)
  })
  
  //Enable remote
  remoteMain.enable(win.webContents)

  //Load content
  win.loadFile('main.html')
}

//Tray
function createTray() {
  //Create new tray
  tray = new Tray(orion.data + 'Images\\logo.ico')
  tray.setToolTip('Oriøn Assistant')

  //Add menus
  updateTray()

  //Add doble click function
  tray.on('double-click', () => { win.show() })
}

function updateTray() {
  //Create menu with settings & quit buttons
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings', click: () => {
        if (isPaused) return
        win.webContents.send('loadModule', 'Settings')
        if (win.isMinimized() || !win.isVisible()) win.show()
      },
    },
    {
      label: 'Quit Oriøn', click: () => {
        app.quit()
      }
    }
  ])

  //No modules -> Do nothing else
  if (fs.existsSync(orion.modules)) {
    //Add separator
    contextMenu.insert(0, new MenuItem({ label: 'Separator', type: 'separator' }))

    //Get modules list
    const modulestmp = fs.readdirSync(orion.modules)

    //Remove settings from modules list
    if (modulestmp.includes('Settings'))
      modulestmp.splice(modulestmp.indexOf('Settings'), 1)

    //Add priority modules first
    let modules = []
    if (modulestmp.includes('Library')) {
      //Add library
      modules.push('Library')
      modulestmp.splice(modulestmp.indexOf('Library'), 1)
    } if (modulestmp.includes('Store')) {
      //Add store
      modules.push('Store')
      modulestmp.splice(modulestmp.indexOf('Store'), 1)
    }  if (modulestmp.includes('Themes')) {
      //Add themes
      modules.push('Themes')
      modulestmp.splice(modulestmp.indexOf('Themes'), 1)
    }

    //Add the rest of the modules in alphabetical order
    for(i in modulestmp) modules.push(modulestmp[i])

    //Get main key to see if hidden
    const main = db.get('main')

    //Add modules
    for(i in modules) {
      //Data
      const name = modules[modules.length - i - 1]
      if (!main.visible.includes(name) && name != 'Library') continue
      
      //Add module
      contextMenu.insert(0, new MenuItem({
        label: name, 
        click: () => {
          if (isPaused) return
          win.webContents.send('loadModule', name)
          if (win.isMinimized() || !win.isVisible()) win.show()
        }
      }))
    }
  }

  //Add separator
  contextMenu.insert(0, new MenuItem({ label: 'Separator', type: 'separator' }))

  //Add logo & title
  const image = nativeImage.createFromPath(orion.data + 'Images\\logo.ico')
  contextMenu.insert(0, new MenuItem({
    label: 'Oriøn Assistant', 
    type: 'normal', 
    icon: image.resize({ width: 16, height: 16 }), 
    click: () => {
      win.webContents.send('noti', 'Oriøn Assistant', 'v' + app.getVersion())
      win.show()
    }
  }))
  tray.setContextMenu(contextMenu)
}