 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

var galleryModule = cModule
var galleryWSS = null
var galleryWS = null
var gallery = {
  app: {
    //State
    connected: false,
    backing: false,
    //Albums
    albums: [], //Array of albums in this computer (albums are arrays of file names)
    //Image request
    request: {
      albumIndex: -1,
      imageIndex: -1,
      lastModified: -1,
      onData: null
    },
    //Missing images
    missing: [], 
    missingLength: 0, 
  },
  client: {
    //Albums
    albums: [], //Array of albums in the client/phone (albums are arrays of file names)
  },
}



 /*$$$$$$$                              /$$     /$$                              
| $$_____/                             | $$    |__/                              
| $$    /$$   /$$ /$$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$| $$  | $$| $$__  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__/| $$  | $$| $$  \ $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$ 
| $$   | $$  | $$| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$   |  $$$$$$/| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/    \______/ |__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/ 

function galleryStart() {
  //Gallert server already running
  if (galleryWSS != null) {
    console.log('Server is already running')
    return
  }

  //Create server
  console.log('Creating server...')
  const { WebSocketServer } = require('ws')
  galleryWSS = new WebSocketServer({ port: 8080 })
  console.log('Server created')

  //Add connection event
  galleryWSS.on('connection', (ws) => {
    //Too many connections
    if (galleryWSS.clients > 1) {
      ws.close()
      return
    }

    //Connected succesfully
    console.log('Connection open')
    gallerySetConnected(true)
    galleryWS = ws
    
    //Socket message
    ws.on('message', (data, isBinary) => {
      if (isBinary)
        galleryParseBinary(data)
      else
        galleryParseString(data)
    })

    //Socket closed or had an error
    ws.on('close', () => {
      gallerySetConnected(false)
      console.log('Connection closed')
    })

    ws.on('error', (error) => {
      gallerySetConnected(false)
      console.error(error)
      ws.close()
    })
  })
}

function galleryParseBinary(data) {
  //Image data received -> Parse info & save file
  const request = gallery.app.request

  //Run onData
  if (typeof request.onData !== 'function') return
  request.onData(data)
}

function galleryParseString(data) {
  //Get client & app (for better readability)
  const client = gallery.client
  const app = gallery.app

  //Parse object
  const object = JSON.parse(data.toString())

  //Check action
  switch (object.action) {
    //Received albums
    case 'albums': {
      //Save album files
      client.albums = object.albums
      console.log("Received all albums")
      break
    }

    //Received an image
    case 'imageInfo': {
      //Check if image info is for the current request
      if (app.request.albumIndex != object.albumIndex) break
      if (app.request.imageIndex != object.imageIndex) break

      //Save image info
      app.request.lastModified = object.lastModified
      
      //Request image data
      galleryWS.send(JSON.stringify({
        action: 'requestImageData',
        albumIndex: object.albumIndex,
        imageIndex: object.imageIndex,
      }))
      break
    }
  }
}

function gallerySetConnected(connected) {
  //Disconnected
  if (!connected) {
    gallery.app.backing = false
    gallery.app.albums = []
    gallery.app.missing = []
    gallery.client.albums = []
  }

  //Update state
  gallery.app.connected = connected
  galleryUpdateIsLoaded()
}

function galleryUpdateIsLoaded() {
  const galleryIsConnected = document.getElementById('galleryIsConnected')
  if (!galleryIsConnected) return
  galleryIsConnected.style.background = gallery.app.connected ? 'var(--success)' : 'var(--danger)'
}

function galleryRequestImage(albumIndex, imageIndex, onData) {
  //Check if types are valid
  if (typeof albumIndex !== 'number') return
  if (typeof imageIndex !== 'number') return
  if (typeof onData !== 'function') return

  //Save request info
  const request = gallery.app.request
  request.albumIndex = albumIndex
  request.imageIndex = imageIndex
  request.onData = onData

  //Request image info
  galleryWS.send(JSON.stringify({
    action: 'requestImageInfo',
    albumIndex: albumIndex,
    imageIndex: imageIndex,
  }))
}

function galleryRequestMissingImages() {
  //Disconnected
  if (!gallery.app.connected) return

  //Get next index
  const nextIndex = gallery.app.missing.length - 1

  //No missing files -> Finish albums download
  if (nextIndex < 0) {
    createNoti('Gallery', 'Finished albums download')
    console.log('Finished albums download')
    galleryUpdateIsBacking(false)
    return
  }

  //Request next
  const next = gallery.app.missing.pop()
  galleryRequestImage(next.albumIndex, next.imageIndex, (data) => {
    //Require path for joining folders with files
    const path = require('path')
    
    //Get request
    const request = gallery.app.request

    //Image data received -> Parse info & save file
    const fileName = gallery.client.albums[request.albumIndex][request.imageIndex]
    const filePath = path.join(paths[request.albumIndex].images, fileName)
    const lastModified = new Date(request.lastModified)

    //Save file
    fs.writeFileSync(filePath, data)
    fs.utimesSync(filePath, lastModified, lastModified)
    
    //Log progress
    const progressSize = gallery.app.missingLength
    const progressCurrent = progressSize - gallery.app.missing.length
    const percent = progressCurrent / progressSize * 100
    console.log(`Image received (${progressCurrent}/${progressSize}, ${percent}%): ` + fileName)

    //Request next
    galleryRequestMissingImages()
  })
}



  /*$$$$$                  /$$          
 /$$__  $$                | $$          
| $$  \__/  /$$$$$$   /$$$$$$$  /$$$$$$ 
| $$       /$$__  $$ /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$  | $$| $$$$$$$$
| $$    $$| $$  | $$| $$  | $$| $$_____/
|  $$$$$$/|  $$$$$$/|  $$$$$$$|  $$$$$$$
  \______/  \______/  \_______/ \______*/


//Module isn't hidden -> Try to start server
if (!galleryModule.isHidden) galleryStart()