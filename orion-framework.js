  /*$$$$$  /$$$$$$$  /$$$$$$  /$$$$$$  /$$   /$$
 /$$__  $$| $$__  $$|_  $$_/ /$$__  $$| $$$ | $$
| $$  \ $$| $$  \ $$  | $$  | $$  \ $$| $$$$| $$
| $$  | $$| $$$$$$$/  | $$  | $$  | $$| $$ $$ $$
| $$  | $$| $$__  $$  | $$  | $$  | $$| $$  $$$$
| $$  | $$| $$  \ $$  | $$  | $$  | $$| $$\  $$$
|  $$$$$$/| $$  | $$ /$$$$$$|  $$$$$$/| $$ \  $$
 \______/ |__/  |__/|______/ \______/ |__/  \__/

 /$$$$$$$$ /$$$$$$$   /$$$$$$  /$$      /$$ /$$$$$$$$ /$$      /$$  /$$$$$$  /$$$$$$$  /$$   /$$
| $$_____/| $$__  $$ /$$__  $$| $$$    /$$$| $$_____/| $$  /$ | $$ /$$__  $$| $$__  $$| $$  /$$/
| $$      | $$  \ $$| $$  \ $$| $$$$  /$$$$| $$      | $$ /$$$| $$| $$  \ $$| $$  \ $$| $$ /$$/ 
| $$$$$   | $$$$$$$/| $$$$$$$$| $$ $$/$$ $$| $$$$$   | $$/$$ $$ $$| $$  | $$| $$$$$$$/| $$$$$/  
| $$__/   | $$__  $$| $$__  $$| $$  $$$| $$| $$__/   | $$$$_  $$$$| $$  | $$| $$__  $$| $$  $$  
| $$      | $$  \ $$| $$  | $$| $$\  $ | $$| $$      | $$$/ \  $$$| $$  | $$| $$  \ $$| $$\  $$ 
| $$      | $$  | $$| $$  | $$| $$ \/  | $$| $$$$$$$$| $$/   \  $$|  $$$$$$/| $$  | $$| $$ \  $$
|__/      |__/  |__/|__/  |__/|__/     |__/|________/|__/     \__/ \______/ |__/  |__/|__/  \__/

             /$$$$$$       /$$$$$$      /$$$$$$ 
            /$$__  $$     /$$$_  $$    /$$__  $$
 /$$    /$$|__/  \ $$    | $$$$\ $$   | $$  \ $$
|  $$  /$$/  /$$$$$$/    | $$ $$ $$   |  $$$$$$/
 \  $$/$$/  /$$____/     | $$\ $$$$    >$$__  $$
  \  $$$/  | $$          | $$ \ $$$   | $$  \ $$
   \  $/   | $$$$$$$$ /$$|  $$$$$$//$$|  $$$$$$/
    \_/    |________/|__/ \______/|__/ \_____*/





 /*$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$ 
| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$
| $$$$| $$| $$  \ $$   | $$     | $$  | $$  \__/
| $$ $$ $$| $$  | $$   | $$     | $$  |  $$$$$$ 
| $$  $$$$| $$  | $$   | $$     | $$   \____  $$
| $$\  $$$| $$  | $$   | $$     | $$   /$$  \ $$
| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/
|__/  \__/ \______/    |__/   |______/ \_____*/

let oNotiActive = false
let oNotis = []
let oNotisSaved = []

function createNoti(title, content, options) {
  //CHECK ARGS
  if (typeof title !== 'string') title = 'title'
  if (typeof content !== 'string') content = 'content'
  if (typeof options !== 'object') options = {}
  //PUSH NOTIFICATION
  oNotis.push({title, content, options})
  oNotisSaved.push({title, content, options})
  //REFRESH NOTI MANAGER
  if (!oNotiActive) oNotiManager()
}

function oNotiManager() {
  if (!oNotiActive) nManager()

  //NOTI MANAGER
  function nManager() {
    if (oNotis.length > 0) {
      oNotiActive = true
      nCreator()
    } else oNotiActive = false
  }

  //NOTI CREATOR
  function nCreator() {
    //GET NOTI AND REMOVE FROM LIST
    let title = oNotis[0].title
    let content = oNotis[0].content
    let options = oNotis[0].options
    oNotis.shift()
    //CHECK VARIABLES
    if (typeof title !== 'string') title = 'title'
    if (typeof content !== 'string') content = 'content'
    if (typeof options !== 'object') options = {}
    //CREATE NOTI
    let id = "oNoti"+Date.now()
    let html = `<div id="${id}" class="button noti">
                  <div id="exit-${id}">✕</div>
                  <div>${title}</div>
                  <div>${content}</div>
                </div>`
    document.body.insertAdjacentHTML('beforeend', html)
    //NOTI TIMEOUT
    let time = 2500
    if (typeof options.time === 'number') time = options.time
    const timeout = setTimeout(() => closeNoti(), time)
    //NOTI LISTENERS
    document.getElementById(id).addEventListener('click', function() {
      if (typeof options.onClick === 'function') options.onClick()
      clearTimeout(timeout)
      closeNoti()
    })
    document.getElementById('exit-'+id).addEventListener('click', function() {
      event.stopPropagation()
      clearTimeout(timeout)
      closeNoti()
    })
    //HIDE FUNCTION
    function closeNoti() {
      //ADD AN EVENT THAT PREVENTS THE OTHERS 
      document.getElementById(id).addEventListener('click', function(event) { event.stopImmediatePropagation() }, true) 
      //HIDE NOTI ANIMATION
      let op = 1
      hideAnim()
      function hideAnim() {
        if (op > 0) {
          op -= .1
          document.getElementById(id).style.opacity = op
          setTimeout(function() { hideAnim() }, 50)
        } else {
          //REMOVE NOTI
          document.getElementById(id).remove()
          setTimeout(nManager, 200)
        }
      }
    }
  }
}





 /*$$$$$$  /$$$$$$  /$$$$$$  /$$        /$$$$$$   /$$$$$$ 
| $$__  $$|_  $$_/ /$$__  $$| $$       /$$__  $$ /$$__  $$
| $$  \ $$  | $$  | $$  \ $$| $$      | $$  \ $$| $$  \__/
| $$  | $$  | $$  | $$$$$$$$| $$      | $$  | $$| $$ /$$$$
| $$  | $$  | $$  | $$__  $$| $$      | $$  | $$| $$|_  $$
| $$  | $$  | $$  | $$  | $$| $$      | $$  | $$| $$  \ $$
| $$$$$$$/ /$$$$$$| $$  | $$| $$$$$$$$|  $$$$$$/|  $$$$$$/
|_______/ |______/|__/  |__/|________/ \______/  \_____*/

function createDialog(innerHTML, title, options) {
  //CHECK ARGS
  if (typeof innerHTML !== 'string') return ''
  if (typeof title !== 'string') title = ''
  if (typeof options !== 'object') options = {}
  //CREATE DIALOG
  let id = "oDialog"+Date.now()
  let html = `<div id="${id}" class="vc" style="width: 100%; height: calc(100% - 20px); margin-top: 20px; position: fixed; z-index: 99996; align-items: center; background-color: rgba(0, 0, 0, 0.5); opacity: 0;"> 
                <div id="box-${id}" class="vc" style="width: fit-content; max-width: calc(100% - 40px); height: fit-content; max-height: calc(100% - 40px); margin: auto; background: var(--background); border-radius: 10px; box-shadow: var(--shadow2); overflow: hidden;" onclick="event.stopPropagation()">
                  <div class="hc" style="width: 100%; height: 20px; flex-direction: row-reverse; background: var(--menu); position: relative;">
                    <div id="name-${id}" style="width: 100%; height: 20px; top: 0; left: 0; position: absolute; text-align: center; font-family: Display2; color: var(--text3); pointer-events: none;">${title}</div>
                    <div id="exit-${id}" class="button-top button-exit">✕</div>
                  </div>
                  <div id="window-${id}" class="vc" style="overflow: auto;">
                    ${innerHTML}
                  </div>
                </div>
              </div>`
  document.body.insertAdjacentHTML('beforeend', html)
  //SHOW DIALOG ANIMATION
  let op = 0
  showAnim()
  function showAnim() {
    if (op < 1) {
      op += .1
      document.getElementById(id).style.opacity = op
      setTimeout(function() { showAnim() }, 10)
    } else {
      //DIALOG LISTENERS
      if (options.preventClose == true) {
        document.getElementById('exit-'+id).remove()
      } else {
        //EXIT BUTTON
        document.getElementById('exit-'+id).addEventListener('click', close)
        //DIALOG BACKGROUND
        let clickedElement = ''
        document.getElementById(id).addEventListener('mousedown', function() {
          clickedElement = 'bg' 
        })
        document.getElementById('box-'+id).addEventListener('mousedown', function() {
          event.stopPropagation()
          clickedElement = ''
        })
        window.addEventListener('mouseup', winClose)
        //CLOSE FUNCTION
        function close() {
          if (typeof options.onClose === 'function') options.onClose()
          else closeDialog(id)
        }
        //WINDOW CLOSE FUNCTION
        function winClose() {
          if (clickedElement == 'bg') {
            close()
            window.removeEventListener('mouseup', winClose)
          }
        }
      }
    }
  }
  return id
}

function closeDialog(id) {
  //CHECK ARGS
  if (typeof id !== 'string') return
  //CHECK IF DIALOG EXISTS
  if (document.getElementById(id) == null) return
  //ADD AN EVENT THAT PREVENTS THE OTHERS
  document.getElementById(id).addEventListener('click', function(event) { event.stopImmediatePropagation() }, true)
  //HIDE DIALOG ANIMATION
  let op = 1
  hideAnim()
  function hideAnim() {
    if (op > 0) {
      op -= .1
      document.getElementById(id).style.opacity = op
      setTimeout(function() { hideAnim() }, 20)
    } else {
      //REMOVE DIALOG
      document.getElementById(id).remove()
    }
  }
}

function setDialogTitle(id, title) {
  //CHECK ARGS
  if (typeof id !== 'string') return
  if (typeof title !== 'string') return
  //RENAME IF DIALOG EXISTS
  if (document.getElementById('name-'+id) != null)
    document.getElementById('name-'+id).innerHTML = title
}

function dialogBuilder(type, options) {
  //CHECK ARGS
  if (typeof type !== 'string') type = ''
  if (typeof options !== 'object') options = {}
  //CREATE VARIABLES
  let id = "oDialog"+Date.now()
  let dialog = {
    innerHTML: ''
  }
  let content = options.content
  //TYPE SWITCH
  switch(type) {
    case 'info':
      //CONTENT
      if (typeof content !== 'string') content = ''
      //RETURN HTML
      dialog.innerHTML = `<div class="vc" style="width: 500px; max-width: 500px; position: relative; padding: 20px; text-align: center; font-size: 15px;">
                            ${content}
                          </div>`
      break
    case 'alert':
      //CONTENT
      if (typeof content !== 'string') content = ''
      //RETURN HTML
      dialog.confirmId = 'confirm-'+id
      dialog.innerHTML = `<div class="vc" style="width: 500px; max-width: 500px; position: relative; padding: 20px; text-align: center; font-size: 15px;">
                            ${content}
                            <o-button id="${dialog.confirmId}" type="ghost" style="margin: 20px 0 0 auto;">Ok</o-button>
                          </div>`
      break
    case 'confirm':
      //CONTENT
      if (typeof content !== 'string') content = ''
      //RETURN HTML
      dialog.confirmId = 'confirm-'+id
      dialog.cancelId = 'cancel-'+id
      dialog.innerHTML = `<div class="vc" style="width: 500px; max-width: 500px; position: relative; padding: 20px; text-align: center; font-size: 15px;">
                            ${content}
                            <div class="hc" style="margin: 20px 0 0 auto; gap: 10px;">
                              <o-button id="${dialog.confirmId}" type="ghost">Confirm</o-button>
                              <o-button id="${dialog.cancelId}" type="ghost">Cancel</o-button>
                            </div>
                          </div>`
      break
    case 'input':
      //CONTENT
      let placeholder = options.placeholder
      if (typeof placeholder !== 'string') placeholder = ''
      let label = options.label
      if (typeof label !== 'string') label = ''
      //RETURN HTML
      dialog.inputId = 'input-'+id
      dialog.confirmId = 'confirm-'+id
      dialog.innerHTML = `<div class="vc" style="width: 500px; max-width: 500px; position: relative; padding: 20px; text-align: center; font-size: 15px;">
                            <o-input id="${dialog.inputId}" placeholder="${placeholder}" label="${label}" style="width: 100%;"></o-input>
                            <o-button id="${dialog.confirmId}" type="ghost" style="margin: 20px 0 0 auto;">Confirm</o-button>
                          </div>`
      break
  }
  //RETURN DIALOG
  return dialog
}





  /*$$$$$  /$$$$$$$$ /$$   /$$       /$$      /$$ /$$$$$$$$ /$$   /$$ /$$   /$$
 /$$__  $$|__  $$__/| $$  / $$      | $$$    /$$$| $$_____/| $$$ | $$| $$  | $$
| $$  \__/   | $$   |  $$/ $$/      | $$$$  /$$$$| $$      | $$$$| $$| $$  | $$
| $$         | $$    \  $$$$/       | $$ $$/$$ $$| $$$$$   | $$ $$ $$| $$  | $$
| $$         | $$     >$$  $$       | $$  $$$| $$| $$__/   | $$  $$$$| $$  | $$
| $$    $$   | $$    /$$/\  $$      | $$\  $ | $$| $$      | $$\  $$$| $$  | $$
|  $$$$$$/   | $$   | $$  \ $$      | $$ \/  | $$| $$$$$$$$| $$ \  $$|  $$$$$$/
 \______/    |__/   |__/  |__/      |__/     |__/|________/|__/  \__/ \_____*/

function createCTXMenu(event, items, title) {
  //CHECK ARGS
  if (typeof event !== 'object') return ''
  if (typeof items !== 'object') items = {}
  if (typeof title !== 'string') title = ''
  //CREATE MENU
  let id = "oMenu"+Date.now()
  let html = `<div id="${id}" class="vc" style="width: 100%; height: calc(100% - 20px); top: 20px; position: fixed; z-index: 99998;">
                <div id="box-${id}" class="ctx-menu vc" onclick="event.stopPropagation()">
                  ${title}
                </div>
              </div>`
  document.body.insertAdjacentHTML('beforeend', html)
  //ADD ITEMS
  const cmenu = document.getElementById('box-'+id)
  for (i in items) {
    //DATA
    let id2 = items[i].id
    if (id2 == undefined || typeof id2 !== 'string') continue
    else id2 = 'oMenu-'+id2
    let label = items[i].label
    if (label == undefined || typeof label !== 'string') continue
    let click = items[i].click
    if (click == undefined || typeof click !== 'function') click = null
    let frontElement = items[i].frontElement
    if (frontElement == undefined || typeof frontElement !== 'string')
      frontElement = `<svg class="button-svg" viewBox="0 0 24 24" style="margin: 0 10px 0 0;">
                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM17 17.25H7C6.59 17.25 6.25 16.91 6.25 16.5C6.25 16.09 6.59 15.75 7 15.75H17C17.41 15.75 17.75 16.09 17.75 16.5C17.75 16.91 17.41 17.25 17 17.25ZM17 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H17C17.41 11.25 17.75 11.59 17.75 12C17.75 12.41 17.41 12.75 17 12.75ZM17 8.25H7C6.59 8.25 6.25 7.91 6.25 7.5C6.25 7.09 6.59 6.75 7 6.75H17C17.41 6.75 17.75 7.09 17.75 7.5C17.75 7.91 17.41 8.25 17 8.25Z"/>
                      </svg>`
    //CREATE ITEM
    let item = `<div id="${id2}" class="ctx-item">
                  ${frontElement}
                  ${label}
                </div>`
    cmenu.insertAdjacentHTML('beforeend', item)
    //ADD LISTENER
    if (click != null)
    document.getElementById(id2).addEventListener('click', function() {
      closeCTXMenu(id)
      click()
    })
  }
  //GET MOUSE POSITION & SIZES
  const { clientX: mouseX, clientY: mouseY } = event
  const winW = document.body.clientWidth
  const winH = document.body.clientHeight
  const menuW = cmenu.clientWidth+1
  const menuH = cmenu.clientHeight+1
  //OVERFLOW
  let posX = mouseX
  if (mouseX + menuW > winW) posX = winW-menuW
  let posY = mouseY
  if (mouseY + menuH > winH) posY = winH-menuH
  //MOVE & SHOW MENU
  cmenu.style.left = posX+'px'
  cmenu.style.top = posY+'px'
  cmenu.style.visibility = 'visible'
  //MENU LISTENERS
  document.getElementById(id).addEventListener('click', function() {
    closeCTXMenu(id)
  })
  return id
}

function closeCTXMenu(id) {
  //CHECK ARGS
  if (typeof id !== 'string') return
  //CLOSE MENU IF EXISTS
  if (document.getElementById(id) == null) return
    document.getElementById(id).remove()
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





 /*$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$$  /$$$$$$  /$$   /$$
| $$__  $$ /$$__  $$ /$$__  $$| $$_____/ /$$__  $$| $$  | $$
| $$  \ $$| $$  \ $$| $$  \__/| $$      | $$  \__/| $$  | $$
| $$$$$$$ | $$$$$$$$|  $$$$$$ | $$$$$   | $$$$$$$ | $$$$$$$$
| $$__  $$| $$__  $$ \____  $$| $$__/   | $$__  $$|_____  $$
| $$  \ $$| $$  | $$ /$$  \ $$| $$      | $$  \ $$      | $$
| $$$$$$$/| $$  | $$|  $$$$$$/| $$$$$$$$|  $$$$$$/      | $$
|_______/ |__/  |__/ \______/ |________/ \______/       |_*/

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





//////////////////////////////////////////////////////////////////////





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
let data = {} //root, data, zip, modules (folder paths)





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















 /*$$$$$$$ /$$       /$$$$$$$$ /$$      /$$ /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$ 
| $$_____/| $$      | $$_____/| $$$    /$$$| $$_____/| $$$ | $$|__  $$__//$$__  $$
| $$      | $$      | $$      | $$$$  /$$$$| $$      | $$$$| $$   | $$  | $$  \__/
| $$$$$   | $$      | $$$$$   | $$ $$/$$ $$| $$$$$   | $$ $$ $$   | $$  |  $$$$$$ 
| $$__/   | $$      | $$__/   | $$  $$$| $$| $$__/   | $$  $$$$   | $$   \____  $$
| $$      | $$      | $$      | $$\  $ | $$| $$      | $$\  $$$   | $$   /$$  \ $$
| $$$$$$$$| $$$$$$$$| $$$$$$$$| $$ \/  | $$| $$$$$$$$| $$ \  $$   | $$  |  $$$$$$/
|________/|________/|________/|__/     |__/|________/|__/  \__/   |__/   \_____*/

function getBooleanAtt(elem, att) {
  return elem.hasAttribute(att) 
}

function setBooleanAtt(elem, att, val) {
  if (val)
    elem.setAttribute(att, '')
  else 
    elem.removeAttribute(att)
}

function getStringAtt(elem, att) {
  if (elem.hasAttribute(att)) return elem.getAttribute(att)
  else return ''
}

function setStringAtt(elem, att, val, posib) {
  if (Array.isArray(posib)) {
    if (posib.indexOf(val) != -1)
      elem.setAttribute(att, val)
    else 
      elem.removeAttribute(att)
  } else {
    if (val)
      elem.setAttribute(att, val)
    else 
      elem.removeAttribute(att)
  }
}

function getOrionColor(val) {
  let colors = ['menu', 'background', 'scrollbar', 'accent', 'success', 'danger', 'warning', 'progress', 'text1', 'text2', 'text3', 'button']
  if (typeof val !== 'string') val = ''
  if (colors.indexOf(val) >= 0) 
    return `var(--${val})`
  else
    return val
}





 /*$$$$$$  /$$   /$$ /$$$$$$$$ /$$$$$$$$ /$$$$$$  /$$   /$$
| $$__  $$| $$  | $$|__  $$__/|__  $$__//$$__  $$| $$$ | $$
| $$  \ $$| $$  | $$   | $$      | $$  | $$  \ $$| $$$$| $$
| $$$$$$$ | $$  | $$   | $$      | $$  | $$  | $$| $$ $$ $$
| $$__  $$| $$  | $$   | $$      | $$  | $$  | $$| $$  $$$$
| $$  \ $$| $$  | $$   | $$      | $$  | $$  | $$| $$\  $$$
| $$$$$$$/|  $$$$$$/   | $$      | $$  |  $$$$$$/| $$ \  $$
|_______/  \______/    |__/      |__/   \______/ |__/  \_*/

customElements.define('o-button', class extends HTMLElement {
  static get observedAttributes() { return ['background', 'color', 'type', 'content', 'vertical', 'hover', 'cursor', 'lefticon', 'righticon'] }

  //ELEMENTS
  get div() { return this.shadowRoot.querySelector('div') }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TYPE ATTRIBUTE
  get type() { return getStringAtt(this, 'type') }
  set type(val) { setStringAtt(this, 'type', val) }

  //CONTENT ATTRIBUTE
  get content() { return getStringAtt(this, 'content') }
  set content(val) { setStringAtt(this, 'content', val) }

  //VERTICAL ATTRIBUTE
  get vertical() { return getBooleanAtt(this, 'vertical') }
  set vertical(val) { setBooleanAtt(this, 'vertical', val) }

  //HOVER ATTRIBUTE
  get hover() { return getStringAtt(this, 'hover') }
  set hover(val) { setStringAtt(this, 'hover', val) }

  //CURSOR ATTRIBUTE
  get cursor() { return getStringAtt(this, 'cursor') }
  set cursor(val) { setStringAtt(this, 'cursor', val) }

  //LEFT ICON ATTRIBUTE
  get lefticon() { return getStringAtt(this, 'lefticon') }
  set lefticon(val) { setStringAtt(this, 'lefticon', val) }

  //RIGHT ICON ATTRIBUTE
  get righticon() { return getStringAtt(this, 'righticon') }
  set righticon(val) { setStringAtt(this, 'righticon', val) }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //DIV
    const div = document.createElement('div')
    div.classList.add('button', 'button-text')
    div.style.width = '100%'
    div.style.height = '100%'
    shadow.appendChild(div)
    //SLOT
    const slot = document.createElement('slot')
    div.appendChild(slot)
  }

  connectedCallback() {
    this.style.position = 'relative'
  }
  
  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //BACKGROUND
      case 'background':
        this.div.style.setProperty('--oBackground', getOrionColor(this.background))
        break
      //COLOR
      case 'color':
        this.div.style.setProperty('--oColor', getOrionColor(this.color))
        break
      //TYPE
      case 'type':
        setStringAtt(this.div, 'shape', this.type)
        break
      //CONTENT
      case 'content':
        this.div.style.padding = ''
        if (this.content == 'emote') {
          this.div.classList.add('button-emote')
          this.div.classList.remove('button-text')
        } else if (this.content == 'box') {
          this.div.classList.remove('button-emote', 'button-text')
        } else {
          this.div.classList.remove('button-emote')
          this.div.classList.add('button-text')
          if (this.content == 'textbox')
          this.div.style.padding = '0'
        }
        break
      //VERTICAL
      case 'vertical':
        if (this.hasAttribute('vertical'))
          this.div.style.flexDirection = 'column'
        else
          this.div.style.flexDirection = 'row'
        break
      //HOVER
      case 'hover':
        setStringAtt(this.div, 'hover', this.hover)
        break
      //CURSOR
      case 'cursor':
        setStringAtt(this.div, 'cursor', this.cursor)
        break
      //LEFT ICON
      case 'lefticon':
        let leftImg = this.div.querySelector("#leftButtonImg")
        if (this.lefticon != '') {
          if (leftImg == null) {
            leftImg = document.createElement('img')
            leftImg.id = 'leftButtonImg'
            leftImg.classList.add('button-image')
            this.div.prepend(leftImg)
          }
          leftImg.src = this.lefticon
          this.div.style.paddingLeft = '0'
        } else if (leftImg != null) {
          leftImg.remove()
          this.div.style.paddingLeft = ''
        }
        break
      //RIGHT ICON
      case 'righticon':
        let rightImg = this.div.querySelector("#rightButtonImg")
        if (this.righticon != '') {
          if (rightImg == null) {
            rightImg = document.createElement('img')
            rightImg.id = 'rightButtonImg'
            rightImg.classList.add('button-image')
            this.div.append(rightImg)
          }
          rightImg.src = this.righticon
          this.div.style.paddingRight = '0'
        } else if (rightImg != null) {
          rightImg.remove()
          this.div.style.paddingRight = ''
        }
        break
    }
  }
})





 /*$$$$$ /$$   /$$ /$$$$$$$  /$$   /$$ /$$$$$$$$
|_  $$_/| $$$ | $$| $$__  $$| $$  | $$|__  $$__/
  | $$  | $$$$| $$| $$  \ $$| $$  | $$   | $$   
  | $$  | $$ $$ $$| $$$$$$$/| $$  | $$   | $$   
  | $$  | $$  $$$$| $$____/ | $$  | $$   | $$   
  | $$  | $$\  $$$| $$      | $$  | $$   | $$   
 /$$$$$$| $$ \  $$| $$      |  $$$$$$/   | $$   
|______/|__/  \__/|__/       \______/    |_*/

customElements.define('o-input', class extends HTMLElement {
  static get observedAttributes() { 
    return ['value', 'background', 'color', 'transparent', 'placeholder', 
            'label', 'showlabel', 'type', 'max', 'disabled'] 
  }
  
  //ELEMENTS
  get div() { return this.shadowRoot.querySelector('div') }
  get input() { return this.shadowRoot.querySelector('input') }
  get span() { return this.shadowRoot.querySelector('span') }
  
  //VALUE ATTRIBUTE
  get value() { return this.input.value }
  set value(val) { this.input.value = val }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TRANSPARENT ATTRIBUTE
  get transparent() { return getBooleanAtt(this, 'transparent') }
  set transparent(val) { setBooleanAtt(this, 'transparent', val) }

  //PLACEHOLDER ATTRIBUTE
  get placeholder() { return getStringAtt(this, 'placeholder') }
  set placeholder(val) { setStringAtt(this, 'placeholder', val) }

  //LABEL ATTRIBUTE
  get label() { return getStringAtt(this, 'label') }
  set label(val) { setStringAtt(this, 'label', val) }

  //SHOWLABEL ATTRIBUTE
  get showlabel() { return getBooleanAtt(this, 'showlabel') }
  set showlabel(val) { setBooleanAtt(this, 'showlabel', val) }
  
  //TYPE ATTRIBUTE
  get type() { return getStringAtt(this, 'type') }
  set type(val) { setStringAtt(this, 'type', val, ['text', 'password', 'search', 'number', 'date', 'month', 'week', 'time']) }

  //MAX ATTRIBUTE
  get max() { return getStringAtt(this, 'max') }
  set max(val) { setStringAtt(this, 'max', val) }

  //DISABLED ATTRIBUTE
  get disabled() { return this.input.disabled }
  set disabled(val) { this.input.disabled = val }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //DIV
    const div = document.createElement('div')
    div.classList.add('button')
    div.style.width = '100%'
    shadow.appendChild(div)
    //INPUT
    const input = document.createElement('input')
    input.classList.add('input')
    input.type = 'text'
    input.spellcheck = false
    div.appendChild(input)
    //LABEL
    const label = document.createElement('span')
    label.classList.add('input-label')
    div.appendChild(label)
  }

  connectedCallback() {
    this.style.position = 'relative'
    if (this.style.width == '') 
      this.style.width = '200px'
  }

  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //VALUE
      case 'value':
        this.input.value = val
        break
      //BACKGROUND
      case 'background':
        this.div.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        this.div.style.setProperty('--oColor', getOrionColor(val))
        break
      //TRANSPARENT
      case 'transparent':
        if (this.hasAttribute('transparent')) {
          setStringAtt(this.div, 'shape', 'ghost')
          setStringAtt(this.div, 'hover', 'none')
          this.div.style.setProperty('--oBorderR', 0)
          this.input.style.padding = '0'
          this.span.style.left = '0'
        } else {
          setStringAtt(this.div, 'shape', 'plain')
          setStringAtt(this.div, 'hover', '')
          this.div.style.setProperty('--oBorderR', 'var(--buttonCorner)')
          this.input.style.padding = '0 10px'
          this.span.style.left = '10px'
        }
        break
      //PLACEHOLDER
      case 'placeholder':
        this.input.placeholder = val
        break
      //LABEL
      case 'label':
        this.span.innerHTML = val
        break
      //SHOWLABEL
      case 'showlabel':
        if (this.hasAttribute('showlabel')) 
          this.span.style.opacity = '1'
        else 
          this.span.style.opacity = ''
        break
      //TYPE
      case 'type':
        if (val == '' || val == null) 
          this.input.type = 'text'
        else 
          this.input.type = val
        break
      //MAX
      case 'max':
        this.input.maxLength = val
        break
      //DISABLED
      case 'disabled':
        this.input.disabled = this.hasAttribute('disabled')
        break
    }
  }
})





  /*$$$$$  /$$      /$$ /$$$$$$ /$$$$$$$$ /$$$$$$  /$$   /$$
 /$$__  $$| $$  /$ | $$|_  $$_/|__  $$__//$$__  $$| $$  | $$
| $$  \__/| $$ /$$$| $$  | $$     | $$  | $$  \__/| $$  | $$
|  $$$$$$ | $$/$$ $$ $$  | $$     | $$  | $$      | $$$$$$$$
 \____  $$| $$$$_  $$$$  | $$     | $$  | $$      | $$__  $$
 /$$  \ $$| $$$/ \  $$$  | $$     | $$  | $$    $$| $$  | $$
|  $$$$$$/| $$/   \  $$ /$$$$$$   | $$  |  $$$$$$/| $$  | $$
 \______/ |__/     \__/|______/   |__/   \______/ |__/  |_*/

customElements.define('o-switch', class extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'background', 'color', 'type'] }
  
  //ELEMENTS
  get input() { return this.shadowRoot.querySelector('input') }

  //FUNCTIONS
  get toggle() { this.input.click(); return this.input.checked }

  //CHECKED ATTRIBUTE
  get checked() { return this.input.checked }
  set checked(val) { this.input.checked = val }

  //DISABLED ATTRIBUTE
  get disabled() { return this.input.disabled }
  set disabled(val) { this.input.disabled = val }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TYPE ATTRIBUTE
  get type() { return getStringAtt(this, 'type') }
  set type(val) { setStringAtt(this, 'type', val, ['small']) }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //INPUT
    const input = document.createElement('input')
    input.classList.add('button', 'switch')
    input.type = 'checkbox'
    shadow.appendChild(input)
  }

  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //CHECKED
      case 'checked':
        this.input.checked = this.hasAttribute('checked')
        break
      //DISABLED
      case 'disabled':
        this.input.disabled = this.hasAttribute('disabled')
        break
      //BACKGROUND
      case 'background':
        this.input.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        this.input.style.setProperty('--oColor', getOrionColor(val))
        break
      //TYPE
      case 'type':
        if (val == 'small')
          this.input.setAttribute('switch', val)
        else
          this.input.removeAttribute('switch')
        break
      }
  }
})





 /*$$$$$$$      /$$$$$$  /$$      /$$ /$$$$$$ /$$$$$$$$ /$$$$$$  /$$   /$$
| $$_____/     /$$__  $$| $$  /$ | $$|_  $$_/|__  $$__//$$__  $$| $$  | $$
| $$          | $$  \__/| $$ /$$$| $$  | $$     | $$  | $$  \__/| $$  | $$
| $$$$$       |  $$$$$$ | $$/$$ $$ $$  | $$     | $$  | $$      | $$$$$$$$
| $$__/        \____  $$| $$$$_  $$$$  | $$     | $$  | $$      | $$__  $$
| $$           /$$  \ $$| $$$/ \  $$$  | $$     | $$  | $$    $$| $$  | $$
| $$$$$$$$ /$$|  $$$$$$/| $$/   \  $$ /$$$$$$   | $$  |  $$$$$$/| $$  | $$
|________/|__/ \______/ |__/     \__/|______/   |__/   \______/ |__/  |_*/

customElements.define('o-eswitch', class extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'background', 'color', 'left', 'right'] }
  
  //ELEMENTS
  get div() { return this.shadowRoot.querySelector('div') }
  get input() { return this.shadowRoot.querySelector('input') }

  //FUNCTIONS
  get toggle() { this.input.click(); return this.input.checked }

  //CHECKED ATTRIBUTE
  get checked() { return this.input.checked }
  set checked(val) { this.input.checked = val }

  //DISABLED ATTRIBUTE
  get disabled() { return this.input.disabled }
  set disabled(val) { this.input.disabled = val }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //COLOR ATTRIBUTE
  get left() { return getStringAtt(this, 'left') }
  set left(val) { setStringAtt(this, 'left', val) }

  //COLOR ATTRIBUTE
  get right() { return getStringAtt(this, 'right') }
  set right(val) { setStringAtt(this, 'right', val) }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //DIV
    const div = document.createElement('div')
    div.classList.add('button', 'eswitch')
    div.style.width = '80px'
    div.style.height = '40px'
    shadow.appendChild(div)
    //INPUT
    const input = document.createElement('input')
    input.type = 'checkbox'
    div.appendChild(input)
    //DIV1
    const div1 = document.createElement('div')
    div1.id = 'leftSwitchDiv'
    div1.classList.add('button-emote')
    div.appendChild(div1)
    //DIV2
    const div2 = document.createElement('div')
    div2.id = 'rightSwitchDiv'
    div2.classList.add('button-emote')
    div.appendChild(div2)
  }

  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //CHECKED
      case 'checked':
        this.input.checked = this.hasAttribute('checked')
        break
      //DISABLED
      case 'disabled':
        this.input.disabled = this.hasAttribute('disabled')
        break
      //BACKGROUND
      case 'background':
        this.div.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        this.div.style.setProperty('--oColor', getOrionColor(val))
        break
      //LEFT
      case 'left':
        let leftDiv = this.div.querySelector("#leftSwitchDiv")
        leftDiv.innerHTML = this.left
        break
      //RIGHT
      case 'right':
        let rightDiv = this.div.querySelector("#rightSwitchDiv")
        rightDiv.innerHTML = this.right
        break
    }
  }
})





  /*$$$$$  /$$   /$$ /$$$$$$$$  /$$$$$$  /$$   /$$ /$$$$$$$   /$$$$$$  /$$   /$$
 /$$__  $$| $$  | $$| $$_____/ /$$__  $$| $$  /$$/| $$__  $$ /$$__  $$| $$  / $$
| $$  \__/| $$  | $$| $$      | $$  \__/| $$ /$$/ | $$  \ $$| $$  \ $$|  $$/ $$/
| $$      | $$$$$$$$| $$$$$   | $$      | $$$$$/  | $$$$$$$ | $$  | $$ \  $$$$/ 
| $$      | $$__  $$| $$__/   | $$      | $$  $$  | $$__  $$| $$  | $$  >$$  $$ 
| $$    $$| $$  | $$| $$      | $$    $$| $$\  $$ | $$  \ $$| $$  | $$ /$$/\  $$
|  $$$$$$/| $$  | $$| $$$$$$$$|  $$$$$$/| $$ \  $$| $$$$$$$/|  $$$$$$/| $$  \ $$
 \______/ |__/  |__/|________/ \______/ |__/  \__/|_______/  \______/ |__/  |_*/

customElements.define('o-checkbox', class extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'background', 'color', 'type'] }
  
  //ELEMENTS
  get input() { return this.shadowRoot.querySelector('input') }

  //FUNCTIONS
  get toggle() { this.input.click(); return this.input.checked }

  //CHECKED ATTRIBUTE
  get checked() { return this.input.checked }
  set checked(val) { this.input.checked = val }

  //DISABLED ATTRIBUTE
  get disabled() { return this.input.disabled }
  set disabled(val) { this.input.disabled = val }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TYPE ATTRIBUTE
  get type() { return getStringAtt(this, 'type') }
  set type(val) { setStringAtt(this, 'type', val, ['reverse']) }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //INPUT
    const input = document.createElement('input')
    input.classList.add('button', 'checkbox')
    input.type = 'checkbox'
    shadow.appendChild(input)
  }

  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //CHECKED
      case 'checked':
        this.input.checked = this.hasAttribute('checked')
        break
      //DISABLED
      case 'disabled':
        this.input.disabled = this.hasAttribute('disabled')
        break
      //BACKGROUND
      case 'background':
        this.input.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        this.input.style.setProperty('--oColor', getOrionColor(val))
        break
      //TYPE
      case 'type':
        if (val == 'reverse')
          this.input.setAttribute('checkbox', val)
        else
          this.input.removeAttribute('checkbox')
        break
    }
  }
})





 /*$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$  /$$$$$$
| $$__  $$ /$$__  $$| $$__  $$|_  $$_/ /$$__  $$
| $$  \ $$| $$  \ $$| $$  \ $$  | $$  | $$  \ $$
| $$$$$$$/| $$$$$$$$| $$  | $$  | $$  | $$  | $$
| $$__  $$| $$__  $$| $$  | $$  | $$  | $$  | $$
| $$  \ $$| $$  | $$| $$  | $$  | $$  | $$  | $$
| $$  | $$| $$  | $$| $$$$$$$/ /$$$$$$|  $$$$$$/
|__/  |__/|__/  |__/|_______/ |______/ \_____*/

customElements.define('o-radio', class extends HTMLElement {
  static get observedAttributes() { return ['name', 'checked', 'disabled', 'background', 'color', 'type'] }
  
  //ELEMENTS
  get input() { return this.querySelector('input') }

  //FUNCTIONS
  get toggle() { this.input.click(); return this.input.checked }

  //NAME ATTRIBUTE
  get name() { this.input.name }
  set name(val) { this.input.name = val }

  //CHECKED ATTRIBUTE
  get checked() { return this.input.checked }
  set checked(val) { this.input.checked = val }

  //DISABLED ATTRIBUTE
  get disabled() { return this.input.disabled }
  set disabled(val) { this.input.disabled = val }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TYPE ATTRIBUTE
  get type() { return getStringAtt(this, 'type') }
  set type(val) { setStringAtt(this, 'type', val, ['reverse']) }

  //CONSTRUCTOR
  constructor() {
    super()
  }

  connectedCallback() {
    const input = document.createElement('input')
    input.classList.add('button', 'radio')
    input.type = 'radio'
    //NAME
    input.name = getStringAtt(this, 'name')
    //CHECKED
    input.checked = this.hasAttribute('checked')
    //DISABLED
    input.disabled = this.hasAttribute('disabled')
    //BACKGROUND
    let background = this.background
    input.style.setProperty('--oBackground', getOrionColor(background))
    //COLOR
    let color = this.color
    input.style.setProperty('--oColor', getOrionColor(color))
    //TYPE
    let type = this.type
    if (type == 'reverse')
      input.setAttribute('radio', type)
    else
      input.removeAttribute('radio')
    //APPEND
    this.appendChild(input)
  }

  attributeChangedCallback(name, oldVal, val) {
    if (this.input == null) return
    switch(name) {
      //NAME
      case 'name':
        this.input.name = val
        break
      //CHECKED
      case 'checked':
        this.input.checked = this.hasAttribute('checked')
        break
      //DISABLED
      case 'disabled':
        this.input.disabled = this.hasAttribute('disabled')
        break
      //BACKGROUND
      case 'background':
        this.input.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        this.input.style.setProperty('--oColor', getOrionColor(val))
        break
      //TYPE
      case 'type':
        if (val == 'reverse')
          this.input.setAttribute('radio', val)
        else
          this.input.removeAttribute('radio')
        break
    }
  }
})





  /*$$$$$  /$$$$$$$$ /$$$$$$$$ /$$   /$$ /$$$$$$$   /$$$$$$  /$$$$$$$ 
 /$$__  $$| $$_____/| $$_____/| $$  /$$/| $$__  $$ /$$__  $$| $$__  $$
| $$  \__/| $$      | $$      | $$ /$$/ | $$  \ $$| $$  \ $$| $$  \ $$
|  $$$$$$ | $$$$$   | $$$$$   | $$$$$/  | $$$$$$$ | $$$$$$$$| $$$$$$$/
 \____  $$| $$__/   | $$__/   | $$  $$  | $$__  $$| $$__  $$| $$__  $$
 /$$  \ $$| $$      | $$      | $$\  $$ | $$  \ $$| $$  | $$| $$  \ $$
|  $$$$$$/| $$$$$$$$| $$$$$$$$| $$ \  $$| $$$$$$$/| $$  | $$| $$  | $$
 \______/ |________/|________/|__/  \__/|_______/ |__/  |__/|__/  |_*/

customElements.define('o-seekbar', class extends HTMLElement {
  static get observedAttributes() { return ['background', 'color', 'min', 'max', 'value'] }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //MIN ATTRIBUTE
  get min() { return this.shadowRoot.querySelector('input').min }
  set min(val) { this.shadowRoot.querySelector('input').min = val }

  //MAX ATTRIBUTE
  get max() { return this.shadowRoot.querySelector('input').max }
  set max(val) { this.shadowRoot.querySelector('input').max = val }

  //VALUE ATTRIBUTE
  get value() { return this.shadowRoot.querySelector('input').value }
  set value(val) { this.shadowRoot.querySelector('input').value = val }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //INPUT
    const input = document.createElement('input')
    input.classList.add('seekbar')
    input.type = 'range'
    shadow.appendChild(input)
  }

  connectedCallback() {
    this.style.position = 'relative'
  }

  attributeChangedCallback(name, oldVal, val) {
    const input = this.shadowRoot.querySelector('input')
    switch(name) {
      //BACKGROUND
      case 'background':
        input.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        input.style.setProperty('--oColor', getOrionColor(val))
        break
      //MIN
      case 'min':
        input.min = val
        break
      //MAX
      case 'max':
        input.max = val
        break
      //VALUE
      case 'value':
        input.value = val
        break
    }
  }
})





  /*$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$$
 /$$__  $$ /$$__  $$| $$__  $$| $$__  $$
| $$  \__/| $$  \ $$| $$  \ $$| $$  \ $$
| $$      | $$$$$$$$| $$$$$$$/| $$  | $$
| $$      | $$__  $$| $$__  $$| $$  | $$
| $$    $$| $$  | $$| $$  \ $$| $$  | $$
|  $$$$$$/| $$  | $$| $$  | $$| $$$$$$$/
 \______/ |__/  |__/|__/  |__/|______*/

customElements.define('o-card', class extends HTMLElement {
  static get observedAttributes() { return ['background', 'color', 'image', 'text'] }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //IMAGE ATTRIBUTE
  get image() { return getStringAtt(this, 'image') }
  set image(val) { setStringAtt(this, 'image', val) }

  //IMAGE ATTRIBUTE
  get text() { return getStringAtt(this, 'text') }
  set text(val) { setStringAtt(this, 'text', val) }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //DIV
    const div = document.createElement('div')
    div.classList.add('button', 'card')
    div.setAttribute('hover', 'none')
    shadow.appendChild(div)
    //IMG
    const img = document.createElement('img')
    div.appendChild(img)
    //TEXT
    const text = document.createElement('div')
    text.id = 'cardText'
    div.appendChild(text)
  }

  attributeChangedCallback(name, oldVal, val) {
    const div = this.shadowRoot.querySelector('div')
    const img = this.shadowRoot.querySelector('img')
    const text = div.querySelector('#cardText')
    switch(name) {
      //BACKGROUND
      case 'background':
        div.style.setProperty('--oBackground', getOrionColor(val))
        break
      //COLOR
      case 'color':
        div.style.setProperty('--oColor', getOrionColor(val))
        break
      //TYPE
      case 'image':
        img.src = val
        break
      //CHECKED
      case 'text':
        text.textContent = val
        break
    }
  }
})





 /*$        /$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$ /$$   /$$  /$$$$$$
| $$       /$$__  $$ /$$__  $$| $$__  $$|_  $$_/| $$$ | $$ /$$__  $$
| $$      | $$  \ $$| $$  \ $$| $$  \ $$  | $$  | $$$$| $$| $$  \__/
| $$      | $$  | $$| $$$$$$$$| $$  | $$  | $$  | $$ $$ $$| $$ /$$$$
| $$      | $$  | $$| $$__  $$| $$  | $$  | $$  | $$  $$$$| $$|_  $$
| $$      | $$  | $$| $$  | $$| $$  | $$  | $$  | $$\  $$$| $$  \ $$
| $$$$$$$$|  $$$$$$/| $$  | $$| $$$$$$$/ /$$$$$$| $$ \  $$|  $$$$$$/
|________/ \______/ |__/  |__/|_______/ |______/|__/  \__/ \_____*/

customElements.define('o-loading', class extends HTMLElement {
  static get observedAttributes() { return ['color', 'type'] }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TYPE ATTRIBUTE
  get type() { return getStringAtt(this, 'type') }
  set type(val) { setStringAtt(this, 'type', val) }

  //CONSTRUCTOR
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    //STYLE
    const style = document.createElement('style')
    style.textContent = `@import url('orion-framework.css')`
    shadow.appendChild(style)
    //INPUT
    const div = document.createElement('div')
    div.classList.add('loading')
    shadow.appendChild(div)
  }

  attributeChangedCallback(name, oldVal, val) {
    const div = this.shadowRoot.querySelector('div')
    switch(name) {
      //COLOR
      case 'color':
        div.style.setProperty('--oColor', getOrionColor(val))
        break
      //TYPE
      case 'type':
        if (val == 'dots' || val == 'spin' || val == 'pulse')
          div.setAttribute('type', val)
        else
          div.removeAttribute('type')
        break
    }
  }
})





 /*$      /$$  /$$$$$$  /$$$$$$$  /$$   /$$ /$$       /$$$$$$$$
| $$$    /$$$ /$$__  $$| $$__  $$| $$  | $$| $$      | $$_____/
| $$$$  /$$$$| $$  \ $$| $$  \ $$| $$  | $$| $$      | $$      
| $$ $$/$$ $$| $$  | $$| $$  | $$| $$  | $$| $$      | $$$$$   
| $$  $$$| $$| $$  | $$| $$  | $$| $$  | $$| $$      | $$__/   
| $$\  $ | $$| $$  | $$| $$  | $$| $$  | $$| $$      | $$      
| $$ \/  | $$|  $$$$$$/| $$$$$$$/|  $$$$$$/| $$$$$$$$| $$$$$$$$
|__/     |__/ \______/ |_______/  \______/ |________/|_______*/

customElements.define('o-module', class extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'button', 'image', 'name'] }
  
  //ELEMENTS
  get div() { return this.querySelector('div') }
  get input() { return this.querySelector('input') }

  //FUNCTIONS
  get toggle() { this.input.click(); return this.input.checked }

  //CHECKED ATTRIBUTE
  get checked() { return this.input.checked }
  set checked(val) { this.input.checked = val }

  //DISABLED ATTRIBUTE
  get disabled() { return this.input.disabled }
  set disabled(val) { this.input.disabled = val }

  //BUTTON ATTRIBUTE
  get button() { return getBooleanAtt(this, 'button') }
  set button(val) { setBooleanAtt(this, 'button', val) }
  
  //IMAGE ATTRIBUTE
  get image() { return getStringAtt(this, 'image') }
  set image(val) { setStringAtt(this, 'image', val) }

  //NAME ATTRIBUTE
  get name() { return getStringAtt(this, 'name') }
  set name(val) { setStringAtt(this, 'name', val) }

  //CONSTRUCTOR
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `<div class="module">
                        <input type="radio" name="module">
                        <img src="${this.image}"></img>
                        <div>${this.name}</div>
                      </div>`
    if (this.hasAttribute('button'))
      this.input.classList.add('button')
  }

  attributeChangedCallback(name, oldVal, val) {
    if (this.input == null) return
    switch(name) {
      //CHECKED
      case 'checked':
        this.input.checked = this.hasAttribute('checked')
        break
      //DISABLED
      case 'disabled':
        this.input.disabled = this.hasAttribute('disabled')
        break
      //BUTTON
      case 'button':
        if (this.hasAttribute('button'))
          this.input.classList.add('button')
        else
          this.input.classList.remove('button')
        break
      //IMAGE
      case 'image': 
        this.input.image = val
        break
      //NAME
      case 'name':
        this.input.name = val
        break
    }
  }
})

/* ASCII FONT: Big Money-ne - https://manytools.org/hacker-tools/ascii-banner */