 /*$$$$$                                               /$$             
|_  $$_/                                              | $$             
  | $$   /$$$$$$/$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$$
  | $$  | $$_  $$_  $$ /$$__  $$ /$$__  $$ /$$__  $$|_  $$_/  /$$_____/
  | $$  | $$ \ $$ \ $$| $$  \ $$| $$  \ $$| $$  \__/  | $$   |  $$$$$$ 
  | $$  | $$ | $$ | $$| $$  | $$| $$  | $$| $$        | $$ /$$\____  $$
 /$$$$$$| $$ | $$ | $$| $$$$$$$/|  $$$$$$/| $$        |  $$$$//$$$$$$$/
|______/|__/ |__/ |__/| $$____/  \______/ |__/         \___/ |_______/ 
                      | $$                                             
                      | $$                                             
                      |_*/                                             

const win = require('@electron/remote').getCurrentWindow()
const { app, screen, shell, globalShortcut } = require('@electron/remote')
const { ipcRenderer } = require('electron')
window.$ = require('jquery')
const fs = require('fs')

let tagIndex = 0            //Used to create different tag names
let tagCallbacks = {}       //List of all of the callbacks for each tag

let orion = {}              //Folder paths (root, data, zip, modules)
let modules = []            //A list of all modules (path, name, hidden, key, main, mainPath, start, startPath)
let cModule = {}            //Current module (path, name, hidden)
let sModule = {}            //Last loaded start module (path, name, hidden)
let tModule = {}            //Temporary module





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
    fs.writeFile(jsonPath, JSON.stringify(json, null, 2), function(err) { if (err) console.log(err) })
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





 /*$       /$$             /$$                                                      
| $$      |__/            | $$                                                      
| $$       /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
| $$      | $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
| $$      | $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$ 
| $$      | $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
| $$$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
|________/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |______*/ 

function clickListener(id, func) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) elem.onclick = func
}

function duobleClickListener(id, func) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) elem.ondblclick = func
}

function longpressListener(id, func, time) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 if (typeof time !== 'number') return
 //TIMER
 let timer = null
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) {
   elem.onmouseup = function() { clearTimeout(timer) }
   elem.onmousedown = function() { timer = setTimeout(func, time) }
 }
}

function contextListener(id, func) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) elem.oncontextmenu = func
}

function changeListener(id, func) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) elem.onchange = func
}

function inputListener(id, func) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) elem.oninput = func
}

function keydownListener(id, func) {
 if (typeof id !== 'string') return
 if (typeof func !== 'function') return
 //ADD LISTENER
 const elem = document.getElementById(id)
 if (elem != null) elem.onkeydown = func
}

function dropListener(id, over, leave, drop) {
 if (typeof id !== 'string') return
 if (typeof over !== 'function') return
 if (typeof leave !== 'function') return
 if (typeof drop !== 'function') return
 //ADD LISTENERS
 const elem = document.getElementById(id)
 if (elem != null) {
   elem.ondragover = () => { 
     event.preventDefault()
     event.stopPropagation()
     over()
   }
   elem.ondragleave = () => { 
     event.preventDefault()
     event.stopPropagation()
     leave() 
   }
   elem.ondrop = drop
 }
}





  /*$$$$$            /$$                    
 /$$__  $$          |__/                    
| $$  \ $$  /$$$$$$  /$$  /$$$$$$  /$$$$$$$ 
| $$  | $$ /$$__  $$| $$ /$$__  $$| $$__  $$
| $$  | $$| $$  \__/| $$| $$  \ $$| $$  \ $$
| $$  | $$| $$      | $$| $$  | $$| $$  | $$
|  $$$$$$/| $$      | $$|  $$$$$$/| $$  | $$
 \______/ |__/      |__/ \______/ |__/  |_*/  

function sendSpecialData(specialData) {
  ipcRenderer.send('specialData', specialData)
}

function restartAssistant() {
  ipcRenderer.send('restartAssistant')
}

function pauseAssistant() {
  ipcRenderer.send('pause')
}

function resumeAssistant() {
  ipcRenderer.send('resume')
}

function renameWindow(title) {
  if (typeof title !== 'string') return
  document.getElementById('topName').innerText = title
}

function createWindow(path, isFile, options) {
  ipcRenderer.send('createWindow', path, isFile, options) //Electron js window options
}

function createOrionWindow(path, specialData, options) {
  ipcRenderer.send('createOrionWindow', path, specialData, options) //Electron js window options
}

const resizeBase64Image = (base64, maxWidth, maxHeight) => {
  //CHECK ARGS
  if (typeof base64 !== 'string') return
  if (typeof maxWidth !== 'number') maxWidth = 128
  if (typeof maxHeight !== 'number') maxHeight = 128
  //RESIZE IMAGE
  return new Promise((resolve) => {
    let img = new Image()
    img.src = base64
    img.onload = () => {
      let canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      //NO NEED TO RESIZE
      if (maxWidth >= width && maxHeight >= height) {
        resolve(base64)
      }
      //RESIZE
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }
      canvas.width = width
      canvas.height = height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL())
    }
  })
}

//Tag registering functions

function createTag(name) {
  //Check args
  if (typeof name === 'object') name = name.tag
  if (typeof name !== 'string' || name == '') name = 'tag'
  if (name != 'tag') return name
  else return name + '-' + (tagIndex++) + '-' + Date.now()
}

function registerTag(tag, callback, permanent) {
  //Check args
  if (typeof tag !== 'string') return
  if (typeof callback !== 'function') return
  if (typeof permanent !== 'boolean') permanent = false
  //Register callback
  unregisterTag(tag)
  ipcRenderer.on(tag, callback)
  if (permanent) tagCallbacks[tag] = callback
}

function unregisterTag(tag) {
  //Check args
  if (typeof tag !== 'string') return
  //Unregister callback
  ipcRenderer.removeAllListeners(tag)
  if (tagCallbacks[tag] != undefined) delete tagCallbacks[tag]
}

//Options for the following functions: 
//  tag: 
//    the return tag of the ipcRenderer reply
//  permanent: 
//    if the function should stay after loading a different modules

function getFile(callback, windowTitle, startPath, options) {
  //Check args
  if (typeof callback !== 'function') return
  if (typeof options !== 'object') options = {}
  //Request folder
  let tag = createTag(options)
  ipcRenderer.send('getFile', tag, windowTitle, startPath)
  registerTag(tag, callback, options.permanent)
}

function getFolder(callback, windowTitle, startPath, options) {
  //Check args
  if (typeof callback !== 'function') return
  if (typeof options !== 'object') options = {}
  //Request folder
  let tag = createTag(options)
  ipcRenderer.send('getFolder', tag, windowTitle, startPath)
  registerTag(tag, callback, options.permanent)
}

function createShortcut(shortcut, callback, options) {
  //Check args
  if (typeof shortcut !== 'string') return
  if (typeof callback !== 'function') return
  if (typeof options !== 'object') options = {}
  //Create shortcut
  let tag = createTag(options)
  ipcRenderer.send('createShortcut', tag, shortcut)
  registerTag(tag, callback, options.permanent)
}





  /*$$$$$    /$$     /$$                          
 /$$__  $$  | $$    | $$                          
| $$  \ $$ /$$$$$$  | $$$$$$$   /$$$$$$   /$$$$$$ 
| $$  | $$|_  $$_/  | $$__  $$ /$$__  $$ /$$__  $$
| $$  | $$  | $$    | $$  \ $$| $$$$$$$$| $$  \__/
| $$  | $$  | $$ /$$| $$  | $$| $$_____/| $$      
|  $$$$$$/  |  $$$$/| $$  | $$|  $$$$$$$| $$      
 \______/    \___/  |__/  |__/ \_______/|_*/  

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}





  /*$$$$$                  /$$          
 /$$__  $$                | $$          
| $$  \__/  /$$$$$$   /$$$$$$$  /$$$$$$ 
| $$       /$$__  $$ /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$  | $$| $$$$$$$$
| $$    $$| $$  | $$| $$  | $$| $$_____/
|  $$$$$$/|  $$$$$$/|  $$$$$$$|  $$$$$$$
 \______/  \______/  \_______/ \______*/

//Context menu
window.oncontextmenu = function(event) {
  //CONTEXT MENU
  event.preventDefault()
  let target = event.target

  //GET SELECTION
  let selection = ''
  if (window.getSelection)
    selection = window.getSelection()
  else if (document.getSelection)
    selection = document.getSelection()
  else if (document.selection)
    selection = document.selection.createRange().text
  let selectionStr = selection.toString()
  
  //ADD BUTTONS
  let buttons = []
  switch (target.tagName) {
    case 'O-INPUT':
    case 'INPUT':
      if (['', 'text', 'search', 'email', 'url', 'tel'].indexOf(target.type) == -1) return
      if (selectionStr != '') {
        buttons.push({
          id: 'cut',
          label: 'Cut',
          click: function() { document.execCommand('cut') },
          frontElement: `<svg class="button-svg" viewBox="0 0 24 24" style="margin: 0 10px 0 0;">
                          <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM17.76 14.68C18.09 14.93 18.16 15.4 17.91 15.73C17.76 15.93 17.54 16.03 17.31 16.03C17.15 16.03 17 15.98 16.86 15.88L12.91 12.93L10.5 14.73C10.51 14.83 10.53 14.93 10.53 15.03C10.53 16.3 9.5 17.33 8.23 17.33C6.96 17.33 5.93 16.3 5.93 15.03C5.93 13.76 6.96 12.73 8.23 12.73C8.85 12.73 9.4 12.98 9.81 13.37L11.65 11.99L9.82 10.62C9.41 11.02 8.84 11.27 8.22 11.27C6.95 11.27 5.92 10.24 5.92 8.97C5.92 7.7 6.95 6.67 8.22 6.67C9.49 6.67 10.52 7.7 10.52 8.97C10.52 9.07 10.5 9.16 10.49 9.25L12.89 11.05L16.84 8.1C17.17 7.85 17.64 7.92 17.89 8.25C18.14 8.58 18.07 9.05 17.74 9.3L14.14 11.99L17.76 14.68Z"/>
                        </svg>`
        })
        buttons.push({
          id: 'copy',
          label: 'Copy',
          click: function() { document.execCommand('copy') },
          frontElement: `<svg class="button-svg" viewBox="0 0 24 24" style="margin: 0 10px 0 0;">
                          <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"/>
                          <path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z"/>
                        </svg>`
        })
      }
      buttons.push({
        id: 'paste',
        label: 'Paste',
        click: function() { document.execCommand('paste') },
        frontElement: `<svg class="button-svg" viewBox="0 0 24 24" style="margin: 0 10px 0 0;">
                        <path d="M14.3498 2H9.64977C8.60977 2 7.75977 2.84 7.75977 3.88V4.82C7.75977 5.86 8.59977 6.7 9.63977 6.7H14.3498C15.3898 6.7 16.2298 5.86 16.2298 4.82V3.88C16.2398 2.84 15.3898 2 14.3498 2Z"/>
                        <path d="M17.2391 4.81949C17.2391 6.40949 15.9391 7.70949 14.3491 7.70949H9.64906C8.05906 7.70949 6.75906 6.40949 6.75906 4.81949C6.75906 4.25949 6.15906 3.90949 5.65906 4.16949C4.24906 4.91949 3.28906 6.40949 3.28906 8.11949V17.5295C3.28906 19.9895 5.29906 21.9995 7.75906 21.9995H16.2391C18.6991 21.9995 20.7091 19.9895 20.7091 17.5295V8.11949C20.7091 6.40949 19.7491 4.91949 18.3391 4.16949C17.8391 3.90949 17.2391 4.25949 17.2391 4.81949ZM12.3791 16.9495H7.99906C7.58906 16.9495 7.24906 16.6095 7.24906 16.1995C7.24906 15.7895 7.58906 15.4495 7.99906 15.4495H12.3791C12.7891 15.4495 13.1291 15.7895 13.1291 16.1995C13.1291 16.6095 12.7891 16.9495 12.3791 16.9495ZM14.9991 12.9495H7.99906C7.58906 12.9495 7.24906 12.6095 7.24906 12.1995C7.24906 11.7895 7.58906 11.4495 7.99906 11.4495H14.9991C15.4091 11.4495 15.7491 11.7895 15.7491 12.1995C15.7491 12.6095 15.4091 12.9495 14.9991 12.9495Z"/>
                      </svg>`
      })
      break
    default:
      //IS THE SELECTED ELEMENT
      try {
        if (target != selection.baseNode.parentNode) return
        if (selectionStr != '')
          buttons.push({
            id: 'copy',
            label: 'Copy',
            click: function() { document.execCommand('copy') },
            frontElement: `<svg class="button-svg" viewBox="0 0 24 24" style="margin: 0 10px 0 0;">
                            <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"/>
                            <path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z"/>
                          </svg>`
          })
        else
          return
      } catch (e) { return }
      break
  }
  createCTXMenu(event, buttons)
}
