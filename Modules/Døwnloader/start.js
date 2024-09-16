 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

downI = -1
downFrom = 1
downTag = ''
downDest = ''
downLogText = ''
downURLs = []
downErrors = []
downStarted = false


 /*$$$$$$$                              /$$     /$$                              
| $$_____/                             | $$    |__/                              
| $$    /$$   /$$ /$$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$| $$  | $$| $$__  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__/| $$  | $$| $$  \ $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$ 
| $$   | $$  | $$| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$   |  $$$$$$/| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/    \______/ |__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/ 

function fixURLs() {
  //Downloading
  if (downStarted) return

  //Get lines
  let text = document.getElementById('downURLS').value
  let lines = text.split('\n')

  //Remove duplicates & non URLs
  let lines2 = [...new Set(lines)]
  downURLs = []
  downErrors = []
  for (i in lines2) {
    let line = lines2[i].trim()
    if (line.startsWith('https://')) 
    downURLs.push(line)
  }

  //Update text
  document.getElementById('downURLS').value = downURLs.join('\n')
}

function startDown() {
  //Downloading
  if (downStarted) return

  //Get tag
  let tag = document.getElementById('downTagInput').value.trim()
  if (tag == '') {
    createNoti('Døwnloader', 'Tag is necesary')
    return
  }

  //Get from
  let from = document.getElementById('downFromInput').value.trim()
  if (from != '') {
    from = Number(from)
    if (isNaN(from)) {
      createNoti('Døwnloader', 'Start from is not a number')
      return
    }
  } else from = 1

  //Get destination
  let dest = document.getElementById('downDestination').value.trim()
  if (dest == '') {
    createNoti('Døwnloader', 'Destination is necesary')
    return
  }
  if (!dest.endsWith('\\')) dest = dest+'\\'
  if (!fs.existsSync(dest)) {
    installerLog('Destination does not exist')
    return
  }

  //Fix URLs & start download
  fixURLs()
  downI = -1
  downTag = tag
  downFrom = from
  downDest = dest
  downStarted = true
  nextItem()
}

function nextItem() {
  //Stop if finished
  if (downI+1 >= downURLs.length) {
    createNoti('Døwnloader', `Finished 🦖 (${downErrors.length} errors)`)
    downLog(`Finished 🦖 (${downErrors.length} errors)`)
    if (downErrors.length > 0) console.log(downErrors)
    downStarted = false
    return
  }
  
  //Check URL
  downI++
  checkURL(downURLs[downI])
}

function checkURL(url) {
  //Log state
  downLog('Check')

  //Check
  try {
    var xhr = new XMLHttpRequest()
    xhr.open('HEAD', url, true)
    xhr.responseType = 'blob'
    xhr.onload = (e) => {
      //Data
      let blob = e.currentTarget.response
      let type = blob.type.split('/')
      
      //Download
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
    //Error
    downError(url, e)
  }
}

function downloadFile(url) {
  //Log state
  downLog('Downloading file')

  //Get file
  try {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = async (e) => {
      //Download
      try {
        let blob = e.currentTarget.response
        let type = blob.type.split('/')
        if (type[1].includes('+')) type[1] = type[1].substring(0, type[1].indexOf('+'))

        //Create file
        const buffer = Buffer.from(await blob.arrayBuffer())
        fs.writeFile(`${downDest}${downTag}${downI+downFrom}.${type[1]}`, buffer, () => {
          downLog('File saved')
          nextItem()
        })
      } catch(e) {
        //Error
        downError(url, e)
      }
    }
    xhr.onprogress = async (e) => {
      //Progress
      downLog(`Downloading file... (${Math.floor(e.loaded/e.total*100)}%)`, false)
    }
    xhr.send()
  } catch(e) {
    //Error
    downError(url, e)
  }
}

function findContent(url) {
  //Log state
  let lUrl = url.toLowerCase()
  downLog('Searching for content')

  //Get page
  try {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = async (e) => {
      //Parse content
      try {
        let blob = e.currentTarget.responseText
        let items = blob.replaceAll('\n', '')
        items = items.split('<')

        //Search videos
        let vSrcs = []
        for (i in items) {
          let item = items[i]
          if ((item.startsWith('video') || item.startsWith('source')) && item.includes('src="')) {
            let src = item.substring(item.indexOf('src="')+5)
            src = src.substring(0, src.indexOf('"'))
            vSrcs.push(src)
          }
        }
        
        //Search images
        let iSrcs = []
        for (i in items) {
          let item = items[i]
          if ((item.startsWith('img')) && item.includes('src="')) {
            let src = item.substring(item.indexOf('src="')+5)
            src = src.substring(0, src.indexOf('"'))
            iSrcs.push(src)
          }
        }

        //Custom image page
        if (iSrcs.length > 0) {
          //JPG CHURCH
          if (lUrl.startsWith('https://jpg.church/') ) {
            iSrcs[0] = iSrcs[1].replaceAll('.md.', '.').replaceAll('.th.', '.')
          }
        }

        //Chech sources
        if (vSrcs.length > 0)
          downloadFile(vSrcs[0])
        else if (iSrcs.length > 0)
          downloadFile(iSrcs[0])
        else
          downError(url, "Couldn't find source")
      } catch(e) {
        //Error
        downError(url, e)
      }
    }
    xhr.send()
  } catch(e) {
    //Error
    downError(url, e)
  }
}

function downError(url, e) {
  //Add error to list
  downErrors.push({
    url: url,
    number: downI+downFrom
  })
  
  //Log & continue
  downLog(e)
  nextItem()
}

function downLog(text, log) {
  if (typeof log != 'boolean') log = true

  //Update text
  downLogText = `${downTag+(+downI+downFrom)} - ${text}`

  //Log text
  if (log)
    console.log(downLogText)
  if (document.getElementById('downLog') != null)
    document.getElementById('downLog').innerText = downLogText
}