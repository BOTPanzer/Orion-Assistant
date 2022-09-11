//NOTIS
let oNotiActive = false
let oNotis = []
let oNotisSaved = []

function oCreateNoti(title, content, click) {
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

//DATA FUNCTIONS
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

//BUTTON LISTENERS
function clickListener(id, click) {
  $('#'+id).bind('click', function() {
    if (event.which != 1) return
    click()
  })
}

function clickCustomListener(id, mousedown, mouseup, click) {
  $('#'+id).bind('mousedown', function() {
    if (event.which != 1) return
    mousedown()
  })
  
  $(window).bind('mouseup', function() {
    if (event.which != 1) return
    mouseup()
  })

  $('#'+id).bind('click', function() {
    if (event.which != 1) return
    click()
  })
}

function clickRightListener(id, click) {
  $('#'+id).bind('contextmenu', function() {
    if (event.which != 3) return
    click()
  })
}
  
function checkboxListener(id, checked, unchecked) {
  $('#'+id).bind('change', function() {
    if (this.checked)
      checked()
    else 
      unchecked()
  })
}

//RESIZE BASE64 IMAGE
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