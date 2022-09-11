 /*$$$$$ /$$      /$$ /$$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$$$ /$$$$$$ 
|_  $$_/| $$$    /$$$| $$__  $$ /$$__  $$| $$__  $$|__  $$__//$$__  $$
  | $$  | $$$$  /$$$$| $$  \ $$| $$  \ $$| $$  \ $$   | $$  | $$  \__/
  | $$  | $$ $$/$$ $$| $$$$$$$/| $$  | $$| $$$$$$$/   | $$  |  $$$$$$ 
  | $$  | $$  $$$| $$| $$____/ | $$  | $$| $$__  $$   | $$   \____  $$
  | $$  | $$\  $ | $$| $$      | $$  | $$| $$  \ $$   | $$   /$$  \ $$
 /$$$$$$| $$ \/  | $$| $$      |  $$$$$$/| $$  | $$   | $$  |  $$$$$$/
|______/|__/     |__/|__/       \______/ |__/  |__/   |__/   \_____*/ 

const { ipcRenderer } = require('electron')
const { app, shell } = require('@electron/remote')
window.$ = require('jquery')
const fs = require('fs')
let win = require('@electron/remote').getCurrentWindow()
let data = {} //root, data, zip, modules (Folder Paths)





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





 /*$       /$$$$$$  /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$$   /$$$$$$ 
| $$      |_  $$_/ /$$__  $$|__  $$__/| $$_____/| $$$ | $$| $$_____/| $$__  $$ /$$__  $$
| $$        | $$  | $$  \__/   | $$   | $$      | $$$$| $$| $$      | $$  \ $$| $$  \__/
| $$        | $$  |  $$$$$$    | $$   | $$$$$   | $$ $$ $$| $$$$$   | $$$$$$$/|  $$$$$$ 
| $$        | $$   \____  $$   | $$   | $$__/   | $$  $$$$| $$__/   | $$__  $$ \____  $$
| $$        | $$   /$$  \ $$   | $$   | $$      | $$\  $$$| $$      | $$  \ $$ /$$  \ $$
| $$$$$$$$ /$$$$$$|  $$$$$$/   | $$   | $$$$$$$$| $$ \  $$| $$$$$$$$| $$  | $$|  $$$$$$/
|________/|______/ \______/    |__/   |________/|__/  \__/|________/|__/  |__/ \_____*/ 

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





  /*$$$$$  /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$$ 
 /$$__  $$|__  $$__/| $$  | $$| $$_____/| $$__  $$
| $$  \ $$   | $$   | $$  | $$| $$      | $$  \ $$
| $$  | $$   | $$   | $$$$$$$$| $$$$$   | $$$$$$$/
| $$  | $$   | $$   | $$__  $$| $$__/   | $$__  $$
| $$  | $$   | $$   | $$  | $$| $$      | $$  \ $$
|  $$$$$$/   | $$   | $$  | $$| $$$$$$$$| $$  | $$
 \______/    |__/   |__/  |__/|________/|__/  |_*/

function renameWindow(title) {
  if (typeof title !== 'string') return
  document.getElementById('topName').innerHTML = title
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