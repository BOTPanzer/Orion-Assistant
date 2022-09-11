// /$$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$ 
//| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$
//| $$$$| $$| $$  \ $$   | $$     | $$  | $$  \__/
//| $$ $$ $$| $$  | $$   | $$     | $$  |  $$$$$$ 
//| $$  $$$$| $$  | $$   | $$     | $$   \____  $$
//| $$\  $$$| $$  | $$   | $$     | $$   /$$  \ $$
//| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/
//|__/  \__/ \______/    |__/   |______/ \______/

let oNotiActive = false
let oNotis = []
let oNotisSaved = []

function createNoti(title, content, click) {
  oNotis.push({title, content, click})
  oNotisSaved.push({title, content, click})
  if (!oNotiActive) oNotiManager()
}

function oNotiManager() {
  if (!oNotiActive) n1()

  function n1() { 
    if (oNotis.length > 0) {
      oNotiActive = true
      n2()
    } else oNotiActive = false
  }

  function n2() { 
    let title = oNotis[0].title
    let content = oNotis[0].content
    let click = oNotis[0].click
    oNotis.shift()
    
    $('#oNoti').off()
    $('#oNotiClose').off()
    let html = `<div id="oNoti" class="button" style="width: 230px; padding: 15px; gap: 10px; position: fixed; bottom: 20px; right: 20px; flex-direction: column; box-shadow: var(--shadow2); opacity: 0;">
                  <div style="width: 200px; font-size: 16px; line-height: normal; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;">${title}</div>
                  <div style="width: 200px; font-size: 14px; line-height: normal; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; color: var(--textSecondary);">${content}</div>
                </div>`
    document.body.insertAdjacentHTML('beforeend', html)

    $( "#oNoti" ).fadeTo(100 , 1, function() {
      const timeout = setTimeout(() => hideNoti(), 1500)
      clickListener('oNoti', function() {
        clearTimeout(timeout)
        hideNoti()
        if (typeof click === 'function') click()
      })
    })

    function hideNoti() {
      $( "#oNoti" ).fadeTo(250 , 0, function() {
        document.getElementById('oNoti').remove()
        setTimeout(function() {
          n1()
        }, 200)
      })
    }
  }
}


// /$$$$$$$  /$$$$$$  /$$$$$$  /$$        /$$$$$$   /$$$$$$ 
//| $$__  $$|_  $$_/ /$$__  $$| $$       /$$__  $$ /$$__  $$
//| $$  \ $$  | $$  | $$  \ $$| $$      | $$  \ $$| $$  \__/
//| $$  | $$  | $$  | $$$$$$$$| $$      | $$  | $$| $$ /$$$$
//| $$  | $$  | $$  | $$__  $$| $$      | $$  | $$| $$|_  $$
//| $$  | $$  | $$  | $$  | $$| $$      | $$  | $$| $$  \ $$
//| $$$$$$$/ /$$$$$$| $$  | $$| $$$$$$$$|  $$$$$$/|  $$$$$$/
//|_______/ |______/|__/  |__/|________/ \______/  \______/

function createDialog(winhtml, title) {
  let id = "oDialog"+Date.now()
  if (title == undefined) title = ''
  let html = `<div id="${id}" class="vc" style="width: 100%; height: calc(100% - 20px); top: 20px; left: 0; z-index: 9999; align-items: center; position: fixed; background-color: rgba(0, 0, 0, 0.5); opacity: 0;">
                <div class="vc" style="width: fit-content; max-width: calc(100% - 40px); height: fit-content; max-height: calc(100% - 40px); margin: auto; background: var(--background); border-radius: 10px; box-shadow: var(--shadow2); overflow: hidden;">
                  <div class="hc" style="width: 100%; height: 20px; flex-direction: row-reverse; background: var(--menu); position: relative;">
                    <div id="name-${id}" style="width: 100%; height: 20px; top: 0; left: 0; position: absolute; text-align: center; font-family: Name; color: var(--textTitleBar); pointer-events: none;">${title}</div>
                    <div id="exit-${id}" class="button-top button-exit">✕</div>
                  </div>
                  <div id="window-${id}" class="vc">
                    ${winhtml}
                  </div>
                </div>
              </div>`
  document.body.insertAdjacentHTML('beforeend', html)

  $(`#${id}`).fadeTo(150 , 1, function() {
    clickListener('exit-'+id, function() {
      hideDialog(id)
    })
  })
  return id
}

function hideDialog(id) {
  if (document.getElementById(id) == null) return
  $(`#${id} *`).off()
  $(`#${id}`).fadeTo(250 , 0, function() {
    document.getElementById(id).remove()
  })
}


// /$$       /$$$$$$  /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$$   /$$$$$$ 
//| $$      |_  $$_/ /$$__  $$|__  $$__/| $$_____/| $$$ | $$| $$_____/| $$__  $$ /$$__  $$
//| $$        | $$  | $$  \__/   | $$   | $$      | $$$$| $$| $$      | $$  \ $$| $$  \__/
//| $$        | $$  |  $$$$$$    | $$   | $$$$$   | $$ $$ $$| $$$$$   | $$$$$$$/|  $$$$$$ 
//| $$        | $$   \____  $$   | $$   | $$__/   | $$  $$$$| $$__/   | $$__  $$ \____  $$
//| $$        | $$   /$$  \ $$   | $$   | $$      | $$\  $$$| $$      | $$  \ $$ /$$  \ $$
//| $$$$$$$$ /$$$$$$|  $$$$$$/   | $$   | $$$$$$$$| $$ \  $$| $$$$$$$$| $$  | $$|  $$$$$$/
//|________/|______/ \______/    |__/   |________/|__/  \__/|________/|__/  |__/ \______/

function clickListener(id, click) {
  $('#'+id).on('click', function() {
    if (event.which != 1) return
    click()
  })
}

function clickCustomListener(id, mousedown, mouseup, click) {
  $('#'+id).on('mousedown', function() {
    if (event.which != 1) return
    mousedown()
  })
  
  $(window).on('mouseup', function() {
    if (event.which != 1) return
    mouseup()
  })

  $('#'+id).on('click', function() {
    if (event.which != 1) return
    click()
  })
}

function clickRightListener(id, click) {
  $('#'+id).on('contextmenu', function() {
    if (event.which != 3) return
    click()
  })
}
  
function checkboxListener(id, checked, unchecked) {
  $('#'+id).on('change', function() {
    if (this.checked)
      checked()
    else 
      unchecked()
  })
}


// /$$$$$$$   /$$$$$$  /$$$$$$$$ /$$$$$$ 
//| $$__  $$ /$$__  $$|__  $$__//$$__  $$
//| $$  \ $$| $$  \ $$   | $$  | $$  \ $$
//| $$  | $$| $$$$$$$$   | $$  | $$$$$$$$
//| $$  | $$| $$__  $$   | $$  | $$__  $$
//| $$  | $$| $$  | $$   | $$  | $$  | $$
//| $$$$$$$/| $$  | $$   | $$  | $$  | $$
//|_______/ |__/  |__/   |__/  |__/  |__/

let json = {}

function refreshData() {
  let jsonPath = data.data+'settings.json'
  if (fs.existsSync(jsonPath)) 
    json = JSON.parse(fs.readFileSync(jsonPath))
  else {
    json = {}
    fs.writeFile(jsonPath, json, function(err) {if (err) console.log(err)})
  }
}

function setData(key, value) {
  refreshData()
  json[key] = value
  fs.writeFileSync(data.data+'settings.json', JSON.stringify(json))
}

function getData(key) {
  refreshData()
  return json[key]
}


// /$$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$$  /$$$$$$  /$$   /$$
//| $$__  $$ /$$__  $$ /$$__  $$| $$_____/ /$$__  $$| $$  | $$
//| $$  \ $$| $$  \ $$| $$  \__/| $$      | $$  \__/| $$  | $$
//| $$$$$$$ | $$$$$$$$|  $$$$$$ | $$$$$   | $$$$$$$ | $$$$$$$$
//| $$__  $$| $$__  $$ \____  $$| $$__/   | $$__  $$|_____  $$
//| $$  \ $$| $$  | $$ /$$  \ $$| $$      | $$  \ $$      | $$
//| $$$$$$$/| $$  | $$|  $$$$$$/| $$$$$$$$|  $$$$$$/      | $$
//|_______/ |__/  |__/ \______/ |________/ \______/       |__/

const resizeBase64Image = (base64) => {
  return new Promise((resolve) => {
    let img = new Image()
    img.src = base64
    img.onload = () => {
      let canvas = document.createElement('canvas')
      const MAX_WIDTH = 128
      const MAX_HEIGHT = 128
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
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