 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

const gallery = {
  //Server & socket
  server: null,
  socket: null,
  //App & client info
  app: {
    //State
    started: false,
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
    //Queue for images/metadata files
    queue: [], 
    queueSize: 0, 
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

//Server
function galleryStart() {
  //Gallert server already running
  if (gallery.server != null) {
    console.log('Server is already running')
    return
  }

  //Create server
  const { WebSocketServer } = require('ws')
  gallery.server = new WebSocketServer({ port: 6969 })
  gallerySetStarted(true)
  console.log('Gallery server created')

  //Add connection event
  gallery.server.on('connection', (ws) => {
    //Connected succesfully
    console.log('Connection open')
    gallerySetConnected(true)
    gallery.socket = ws
    
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

  //Add close & error events
  gallery.server.on('close', (ws) => {
    gallerySetStarted(false)
  })

  gallery.server.on('error', (error) => {
    gallerySetStarted(false)
    console.error(error)
    gallery.server.close()
  })
}

function galleryParseBinary(data) {
  //Data received -> Get request
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
      gallery.socket.send(JSON.stringify({
        action: 'requestImageData',
        albumIndex: object.albumIndex,
        imageIndex: object.imageIndex,
      }))
      break
    }
  }
}

//State
function gallerySetStarted(started) {
  //Not started
  if (!started) gallery.server = null

  //Update state
  gallery.app.started = started
  galleryUpdateStatus()
}

function gallerySetConnected(connected) {
  //Disconnected
  if (!connected) {
    gallery.app.syncing = false
    gallery.app.albums = []
    gallery.app.queue = []
    gallery.client.albums = []
  }

  //Update state
  gallery.app.connected = connected
  galleryUpdateStatus()
}

function galleryUpdateStatus() {
  const galleryIsStarted = document.getElementById('galleryIsStarted')
  if (galleryIsStarted) galleryIsStarted.style.background = gallery.app.started ? 'var(--success)' : 'var(--danger)'
  const galleryIsConnected = document.getElementById('galleryIsConnected')
  if (galleryIsConnected) galleryIsConnected.style.background = gallery.app.connected ? 'var(--success)' : 'var(--danger)'
}

function galleryUpdateSyncing(syncing) {
  //Update is backing variable
  if (typeof syncing === 'boolean')
    gallery.app.syncing = syncing
  else
    syncing = gallery.app.syncing
  
  //Update UI
  const container = document.getElementById('albumsContainer')
  if (container) {
    container.style.pointerEvents = syncing ? 'none' : ''
    container.style.opacity = syncing ? '0.5' : '1'
  }
}

//Requests
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
  gallery.socket.send(JSON.stringify({
    action: 'requestImageInfo',
    albumIndex: albumIndex,
    imageIndex: imageIndex,
  }))
}

function galleryRequestQueueImages() {
  //Disconnected
  if (!gallery.app.connected) return

  //Get next index
  const nextIndex = gallery.app.queue.length - 1

  //No files in queue -> Finish albums sync
  if (nextIndex < 0) {
    createNoti('Gallery', 'Finished albums sync')
    console.log('Finished albums sync')
    galleryUpdateSyncing(false)
    return
  }

  //Request next
  const next = gallery.app.queue.pop()
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
    const progressSize = gallery.app.queueSize
    const progressCurrent = progressSize - gallery.app.queue.length
    const percent = progressCurrent / progressSize * 100
    console.log(`Image received (${progressCurrent}/${progressSize}, ${percent}%): ${fileName}`)

    //Request next
    galleryRequestQueueImages()
  })
}

function galleryRequestMetadata(albumIndex, onData) {
  //Check if types are valid
  if (typeof albumIndex !== 'number') return
  if (typeof onData !== 'function') return

  //Save request info
  const request = gallery.app.request
  request.albumIndex = albumIndex
  request.onData = onData

  //Request image info
  gallery.socket.send(JSON.stringify({
    action: 'requestMetadataData',
    albumIndex: albumIndex,
  }))
}

function galleryRequestQueueMetadata() {
  //Disconnected
  if (!gallery.app.connected) return

  //Get next index
  const nextIndex = gallery.app.queue.length - 1

  //No files in queue -> Finish metadata sync
  if (nextIndex < 0) {
    createNoti('Gallery', 'Finished metadata sync')
    console.log('Finished metadata sync')
    galleryUpdateSyncing(false)
    return
  }

  //Request next
  const next = gallery.app.queue.pop()
  galleryRequestMetadata(next.albumIndex, (data) => {
    //Require path for joining folders with files
    const path = require('path')
    
    //Get request
    const request = gallery.app.request

    //Metadata data received -> Parse info & save file
    const fileName = 'Album ' + request.albumIndex
    const filePath = paths[request.albumIndex].metadata

    //Save file
    fs.writeFileSync(filePath, data)
    
    //Log progress
    const progressSize = gallery.app.queueSize
    const progressCurrent = progressSize - gallery.app.queue.length
    const percent = progressCurrent / progressSize * 100
    console.log(`Metadata received (${progressCurrent}/${progressSize}, ${percent}%): ${fileName}`)

    //Request next
    galleryRequestQueueMetadata()
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
if (!cModule.isHidden) galleryStart()