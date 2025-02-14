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
    connected: false,
    albums: [], //Array of albums in this computer (albums are arrays of file names)
    request: {
      albumIndex: -1,
      imageIndex: -1,
      lastModified: -1,
    },
  },
  client: {
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
  const fileName = gallery.client.albums[request.albumIndex][request.imageIndex]
  const filePath = galleryModule.path + fileName
  const lastModified = new Date(request.lastModified)

  //Save file
  fs.writeFileSync(filePath, data)
  fs.utimesSync(filePath, lastModified, lastModified)
  console.log("Image received: " + fileName)
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

      galleryWS.send(JSON.stringify({
        action: 'requestImageInfo',
        albumIndex: 0,
        imageIndex: 0,
      }))
      break
    }

    //Received an image
    case 'imageInfo': {
      //Save image info
      app.request.albumIndex = object.albumIndex
      app.request.imageIndex = object.imageIndex
      app.request.lastModified = object.lastModified
      
      //Save image
      console.log(object)
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
  gallery.app.connected = connected
  galleryUpdateIsLoaded()
}

function galleryUpdateIsLoaded() {
  const galleryIsLoaded = document.getElementById('galleryIsLoaded')
  if (!galleryIsLoaded) return
  galleryIsLoaded.style.background = gallery.app.connected ? 'var(--success)' : 'var(--danger)'
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