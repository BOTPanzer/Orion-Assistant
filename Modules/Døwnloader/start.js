// /$$    /$$  /$$$$$$  /$$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$$  /$$       /$$$$$$$$  /$$$$$$ 
//| $$   | $$ /$$__  $$| $$__  $$|_  $$_/ /$$__  $$| $$__  $$| $$      | $$_____/ /$$__  $$
//| $$   | $$| $$  \ $$| $$  \ $$  | $$  | $$  \ $$| $$  \ $$| $$      | $$      | $$  \__/
//|  $$ / $$/| $$$$$$$$| $$$$$$$/  | $$  | $$$$$$$$| $$$$$$$ | $$      | $$$$$   |  $$$$$$ 
// \  $$ $$/ | $$__  $$| $$__  $$  | $$  | $$__  $$| $$__  $$| $$      | $$__/    \____  $$
//  \  $$$/  | $$  | $$| $$  \ $$  | $$  | $$  | $$| $$  \ $$| $$      | $$       /$$  \ $$
//   \  $/   | $$  | $$| $$  | $$ /$$$$$$| $$  | $$| $$$$$$$/| $$$$$$$$| $$$$$$$$|  $$$$$$/
//    \_/    |__/  |__/|__/  |__/|______/|__/  |__/|_______/ |________/|________/ \______/

downI = -1
downFrom = 1
downTag = ''
downDest = ''
downLogText = ''
downURLs = []
downErrors = []
downStarted = false


// /$$$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$  /$$   /$$  /$$$$$$ 
//| $$_____/| $$  | $$| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$| $$$ | $$ /$$__  $$
//| $$      | $$  | $$| $$$$| $$| $$  \__/   | $$     | $$  | $$  \ $$| $$$$| $$| $$  \__/
//| $$$$$   | $$  | $$| $$ $$ $$| $$         | $$     | $$  | $$  | $$| $$ $$ $$|  $$$$$$ 
//| $$__/   | $$  | $$| $$  $$$$| $$         | $$     | $$  | $$  | $$| $$  $$$$ \____  $$
//| $$      | $$  | $$| $$\  $$$| $$    $$   | $$     | $$  | $$  | $$| $$\  $$$ /$$  \ $$
//| $$      |  $$$$$$/| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/| $$ \  $$|  $$$$$$/
//|__/       \______/ |__/  \__/ \______/    |__/   |______/ \______/ |__/  \__/ \______/

function fixURLs() {
  if (downStarted) return
  //GET LINES
  let text = document.getElementById('downURLS').value
  let lines = text.split('\n')
  //REMOVE DUPLICATES & NON URLS
  let lines2 = [...new Set(lines)]
  downURLs = []
  downErrors = []
  for (i in lines2) {
    let line = lines2[i].trim()
    if (line.startsWith('https://')) 
    downURLs.push(line)
  }
  //UPDATE TEXT
  document.getElementById('downURLS').value = downURLs.join('\n')
}

function startDown() {
  if (downStarted) return
  //GET TAG
  let tag = document.getElementById('downTagInput').value.trim()
  if (tag == '') {
    createNoti('D??wnloader', 'Tag is necesary')
    return
  }
  //GET FROM
  let from = document.getElementById('downFromInput').value.trim()
  if (from != '') {
    from = Number(from)
    if (isNaN(from)) {
      createNoti('D??wnloader', 'Start from is not a number')
      return
    }
  } else from = 1
  //GET DESTINATION
  let dest = document.getElementById('downDestination').value.trim()
  if (dest == '') {
    createNoti('D??wnloader', 'Destination is necesary')
    return
  }
  if (!dest.endsWith('\\')) dest = dest+'\\'
  if (!fs.existsSync(dest)) {
    installerLog('Destination does not exist')
    return
  }
  //FIX URLS & START
  fixURLs()
  downI = -1
  downTag = tag
  downFrom = from
  downDest = dest
  downStarted = true
  //DOWNLOAD
  nextItem()
}

function nextItem() {
  //STOP IF FINISHED
  if (downI+1 >= downURLs.length) {
    createNoti('D??wnloader', `Finished ???? (${downErrors.length} errors)`)
    downLog(`Finished ???? (${downErrors.length} errors)`)
    if (downErrors.length > 0) console.log(downErrors)
    downStarted = false
    return
  }
  //CHECK URL
  downI++
  checkURL(downURLs[downI])
}

function checkURL(url) {
  downLog('Check')
  //CHECK
  try {
    var xhr = new XMLHttpRequest()
    xhr.open('HEAD', url, true)
    xhr.responseType = 'blob'
    xhr.onload = (e) => {
      //DATA
      let blob = e.currentTarget.response
      let type = blob.type.split('/')
      //DOWNLOAD
      switch(type[0]) {
        case 'image': 
          downloadFile(url)
          break
        case 'video': 
          downloadFile(url)
          break
        case 'text': 
          if (type[1] == 'html') 
            findContent(url)
          else
            downError(url, 'Nothing to check')
          break
      }
    }
    xhr.send()
  } catch (e) {
    //ERROR
    downError(url, e)
  }
}

function downloadFile(url) {
  downLog('Downloading file')
  //GET FILE
  try {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = async (e) => {
      //DOWNLOAD
      try {
        let blob = e.currentTarget.response
        let type = blob.type.split('/')
        if (type[1].includes('+')) type[1] = type[1].substring(0, type[1].indexOf('+'))
        //CREATE FILE
        const buffer = Buffer.from(await blob.arrayBuffer())
        fs.writeFile(`${downDest}${downTag}${downI+downFrom}.${type[1]}`, buffer, () => {
          downLog('File saved')
          nextItem()
        })
      } catch(e) {
        //ERROR
        downError(url, e)
      }
    }
    xhr.onprogress = async (e) => {
      //PROGRESS
      downLog(`Downloading file... (${Math.floor(e.loaded/e.total*100)}%)`, false)
    }
    xhr.send()
  } catch(e) {
    //ERROR
    downError(url, e)
  }
}

function findContent(url) {
  let lUrl = url.toLowerCase()
  downLog('Searching for content')
  //GET PAGE
  try {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = async (e) => {
      //PARSE CONTENT
      try {
        let blob = e.currentTarget.responseText
        let items = blob.replaceAll('\n', '')
        items = items.split('<')
        //SEARCH VIDEOS
        let vSrcs = []
        for (i in items) {
          let item = items[i]
          if ((item.startsWith('video') || item.startsWith('source')) && item.includes('src="')) {
            let src = item.substring(item.indexOf('src="')+5)
            src = src.substring(0, src.indexOf('"'))
            vSrcs.push(src)
          }
        }
        //SEARCH IMAGES
        let iSrcs = []
        for (i in items) {
          let item = items[i]
          if ((item.startsWith('img')) && item.includes('src="')) {
            let src = item.substring(item.indexOf('src="')+5)
            src = src.substring(0, src.indexOf('"'))
            iSrcs.push(src)
          }
        }
        //CUSTOM IMAGE PAGE
        if (iSrcs.length > 0) {
          //JPG CHURCH
          if (lUrl.startsWith('https://jpg.church/') ) {
            iSrcs[0] = iSrcs[1].replaceAll('.md.', '.').replaceAll('.th.', '.')
          }
        }
        //CHECK SOURCES
        if (vSrcs.length > 0)
          downloadFile(vSrcs[0])
        else if (iSrcs.length > 0)
          downloadFile(iSrcs[0])
        else
          downError(url, "Couldn't find source")
      } catch(e) {
        //ERROR
        downError(url, e)
      }
    }
    xhr.send()
  } catch(e) {
    //ERROR
    downError(url, e)
  }
}

function downError(url, e) {
  downErrors.push({
    url: url,
    number: downI+downFrom
  })
  downLog(e)
  nextItem()
}

function downLog(text, log) {
  if (typeof log != 'boolean') log = true
  //TEXT
  downLogText = `${downTag+(+downI+downFrom)} - ${text}`
  //LOG
  if (log)
    console.log(downLogText)
  if (document.getElementById('downLog') != null)
    document.getElementById('downLog').innerText = downLogText
}