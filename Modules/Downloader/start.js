 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

const down = {
  //State
  started: false,
  log: '',

  //Current download
  current: -1,

  //Current batch
  tag: '',
  from: 1,
  destination: '',
  
  //URLs
  urls: [],
  errors: []
}


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
  if (down.started) return

  //Get URLs
  const urls = document.getElementById('downURLs').value.split('\n')

  //Remove duplicates & non URLs
  down.urls = []
  down.errors = []
  for (i in urls) {
    const line = urls[i].trim()
    if (line.startsWith('https://')) 
    down.urls.push(line)
  }

  //Update text
  document.getElementById('downURLs').value = down.urls.join('\n')
}

function startDown() {
  //Downloading
  if (down.started) return

  //Get tag
  const tag = document.getElementById('downTagInput').value.trim()
  if (tag == '') {
    createNoti('Downloader', 'Tag is necesary')
    return
  }

  //Get from
  let from = document.getElementById('downFromInput').value.trim()
  if (from != '') {
    from = Number(from)
    if (isNaN(from)) {
      createNoti('Downloader', 'Start from is not a number')
      return
    }
  } else {
    from = 1
  }

  //Get destination
  let dest = document.getElementById('downDestinationInput').value.trim()
  if (dest == '') {
    createNoti('Downloader', 'Destination is necesary')
    return
  }
  if (!dest.endsWith('\\')) dest = dest + '\\'
  if (!fs.existsSync(dest)) {
    installerLog('Destination does not exist')
    return
  }

  //Fix URLs
  fixURLs()
  if (down.urls.length == 0) {
    createNoti('Downloader', 'There are no valid URLs')
    return
  }

  //Start download
  down.current = -1
  down.tag = tag
  down.from = from
  down.destination = dest
  down.started = true
  nextItem()
}

function nextItem() {
  //Stop if finished
  if (down.current + 1 >= down.urls.length) {
    //Finish
    down.started = false
    const downFromInput = document.getElementById('downFromInput')
    if (downFromInput != null) downFromInput.value = down.from + down.current + 1
    if (down.errors.length > 0) console.log(down.errors)

    //Notify finish
    createNoti('Downloader', `Finished 🦖 (${down.errors.length} errors)`)
    downLog(`Finished 🦖 (${down.errors.length} errors)`)
    return
  }
  
  //Check URL
  down.current++
  checkURL(down.urls[down.current])
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
    xhr.onerror = (e) => { downError(url, e) }
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
        fs.writeFile(`${down.destination}${down.tag}${down.current + down.from}.${type[1]}`, buffer, () => {
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
          //JPG Church
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
  down.errors.push({
    url: url,
    number: down.from + down.current
  })
  
  //Log & continue
  downLog(e)
  nextItem()
}

function downLog(text, log) {
  if (typeof log != 'boolean') log = true

  //Update text
  down.log = `${down.tag + (down.current + down.from)} - ${text}`

  //Log text
  if (log)
    console.log(down.log)
  if (document.getElementById('downLog') != null)
    document.getElementById('downLog').innerText = down.log
}