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

             /$$$$$$       /$$$$$$       /$$$$$$ 
            /$$__  $$     /$$__  $$     /$$$_  $$
 /$$    /$$|__/  \ $$    |__/  \ $$    | $$$$\ $$
|  $$  /$$/  /$$$$$$/      /$$$$$$/    | $$ $$ $$
 \  $$/$$/  /$$____/      /$$____/     | $$\ $$$$
  \  $$$/  | $$          | $$          | $$ \ $$$
   \  $/   | $$$$$$$$ /$$| $$$$$$$$ /$$|  $$$$$$/
    \_/    |________/|__/|________/|__/ \______*/





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
  let html = `<div id="${id}" class="vc" style="width: 100%; height: calc(100% - 45px); margin-top: 45px; position: fixed; z-index: 99996; align-items: center; background-color: rgba(0, 0, 0, 0.5); opacity: 0;"> 
                <div id="box-${id}" class="vc" style="width: fit-content; max-width: calc(100% - 40px); height: fit-content; max-height: calc(100% - 40px); margin: auto; background: var(--background); border-radius: 15px; box-shadow: var(--shadow2); overflow: hidden;" onclick="event.stopPropagation()">
                  <div class="topBar">
                    <div id="name-${id}" class="topTitle">${title}</div>
                    <div style="flex-grow: 1;"></div>
                    <div id="exit-${id}" class="topButton topButtonExit">✕</div>
                  </div>
                  <div id="window-${id}" class="vc" style="overflow: auto; min-width: 200px; min-height: 100px;">
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





/*$$$$$$$  /$$   /$$ /$$$$$$$$ /$$$$$$$$ /$$$$$$  /$$   /$$  /$$$$$$ 
| $$__  $$| $$  | $$|__  $$__/|__  $$__//$$__  $$| $$$ | $$ /$$__  $$
| $$  \ $$| $$  | $$   | $$      | $$  | $$  \ $$| $$$$| $$| $$  \__/
| $$$$$$$ | $$  | $$   | $$      | $$  | $$  | $$| $$ $$ $$|  $$$$$$ 
| $$__  $$| $$  | $$   | $$      | $$  | $$  | $$| $$  $$$$ \____  $$
| $$  \ $$| $$  | $$   | $$      | $$  | $$  | $$| $$\  $$$ /$$  \ $$
| $$$$$$$/|  $$$$$$/   | $$      | $$  |  $$$$$$/| $$ \  $$|  $$$$$$/
|_______/  \______/    |__/      |__/   \______/ |__/  \__/ \_____*/

customElements.define('o-button', class extends HTMLElement {
  static get observedAttributes() { return ['background', 'color', 'shape', 'content', 'vertical', 'lefticon', 'righticon'] }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //TYPE ATTRIBUTE
  get shape() { return getStringAtt(this, 'shape') }
  set shape(val) { setStringAtt(this, 'shape', val) }

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
  }

  connectedCallback() {
    this.classList.add('button')
    //CONTENT
    if (this.content == '') 
      this.classList.add('button-text')
  }
  
  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //BACKGROUND
      case 'background':
        this.style.setProperty('--oBackground', getOrionColor(this.background))
        break
      //COLOR
      case 'color':
        this.style.setProperty('--oColor', getOrionColor(this.color))
        break
      //CONTENT
      case 'content':
        this.style.padding = ''
        if (this.content == 'emote') {
          this.classList.add('button-emote')
          this.classList.remove('button-text')
        } else if (this.content == 'box') {
          this.classList.remove('button-emote', 'button-text')
        } else {
          this.classList.remove('button-emote')
          this.classList.add('button-text')
          if (this.content == 'textbox')
          this.style.padding = '0'
        }
        break
      //VERTICAL
      case 'vertical':
        if (this.vertical)
          this.style.flexDirection = 'column'
        else
          this.style.flexDirection = 'row'
        break
      //LEFT ICON
      case 'lefticon':
        let leftImg = this.querySelector("#leftButtonImg")
        if (this.lefticon != '') {
          if (leftImg == null) {
            leftImg = document.createElement('img')
            leftImg.id = 'leftButtonImg'
            leftImg.classList.add('button-image')
            this.prepend(leftImg)
          }
          leftImg.src = this.lefticon
          this.style.paddingLeft = '0'
        } else if (leftImg != null) {
          leftImg.remove()
          this.style.paddingLeft = ''
        }
        break
    }
  }
})

customElements.define('o-rbutton', class extends HTMLElement {
  static get observedAttributes() { return ['background', 'color', 'icon', 'text'] }

  //ELEMENTS
  get img() { return this.querySelector("#rbuttonIcon") }
  get span() { return this.querySelector("#rbuttonText") }

  //BACKGROUND ATTRIBUTE
  get background() { return getStringAtt(this, 'background') }
  set background(val) { setStringAtt(this, 'background', val) }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //HOVER ATTRIBUTE
  get hover() { return getStringAtt(this, 'hover') }
  set hover(val) { setStringAtt(this, 'hover', val) }

  //CURSOR ATTRIBUTE
  get cursor() { return getStringAtt(this, 'cursor') }
  set cursor(val) { setStringAtt(this, 'cursor', val) }

  //ICON
  get icon() { return getStringAtt(this, 'icon') }
  set icon(val) { setStringAtt(this, 'icon', val) }

  //TEXT
  get text() { return getStringAtt(this, 'text') }
  set text(val) { setStringAtt(this, 'text', val) }

  //CONSTRUCTOR
  constructor() {
    super()
  }

  connectedCallback() {
    this.classList.add('button', 'rButton')
  }
  
  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //BACKGROUND
      case 'background':
        this.style.setProperty('--oBackground', getOrionColor(this.background))
        break
      //COLOR
      case 'color':
        this.style.setProperty('--oColor', getOrionColor(this.color))
        break
      //ICON
      case 'icon':
        let icon = this.img
        if (this.icon != '') {
          if (icon == null) {
            icon = document.createElement('img')
            icon.id = 'rbuttonIcon'
            this.prepend(icon)
          }
          icon.src = this.icon
        } else if (icon != null) {
          icon.remove()
        }
        break
      //TEXT
      case 'text':
        let text = this.span
        if (this.text != '') {
          if (text == null) {
            text = document.createElement('span')
            text.id = 'rbuttonText'
            this.append(text)
          }
          text.innerHTML = this.text
        } else if (text != null) {
          text.remove()
        }
        break
    }
  }
})

customElements.define('o-sbutton', class extends HTMLElement {
  static get observedAttributes() { return ['color', 'icon', 'text'] }

  //ELEMENTS
  get img() { return this.querySelector("#rbuttonIcon") }
  get span() { return this.querySelector("#rbuttonText") }

  //COLOR ATTRIBUTE
  get color() { return getStringAtt(this, 'color') }
  set color(val) { setStringAtt(this, 'color', val) }

  //ICON
  get icon() { return getStringAtt(this, 'icon') }
  set icon(val) { setStringAtt(this, 'icon', val) }

  //TEXT
  get text() { return getStringAtt(this, 'text') }
  set text(val) { setStringAtt(this, 'text', val) }

  //CONSTRUCTOR
  constructor() {
    super()
  }

  connectedCallback() {
    this.classList.add('sButton')
  }
  
  attributeChangedCallback(name, oldVal, val) {
    switch(name) {
      //COLOR
      case 'color':
        this.style.setProperty('--oColor', getOrionColor(this.color))
        break
      //ICON
      case 'icon':
        let icon = this.img
        if (this.icon != '') {
          if (icon == null) {
            icon = document.createElement('img')
            icon.id = 'rbuttonIcon'
            this.prepend(icon)
          }
          icon.src = this.icon
        } else if (icon != null) {
          icon.remove()
        }
        break
      //TEXT
      case 'text':
        let text = this.span
        if (this.text != '') {
          if (text == null) {
            text = document.createElement('span')
            text.id = 'rbuttonText'
            this.append(text)
          }
          text.innerHTML = this.text
        } else if (text != null) {
          text.remove()
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

/* ASCII FONT: Big Money-ne - https://manytools.org/hacker-tools/ascii-banner */