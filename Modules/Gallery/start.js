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
    albums: []  //Array of albums in this computer (albums are arrays of file names)
  },
  client: {
    albumsInfo: {},
    albums: []  //Array of albums in the client/phone (albums are arrays of file names)
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
  console.log('Creating server')
  const { WebSocketServer } = require('ws')
  galleryWSS = new WebSocketServer({ port: 8080 })

  //Add connection event
  galleryWSS.on('connection', (ws) => {
    //Too many connections
    if (galleryWSS.clients > 1) {
      ws.close()
      return
    }

    //Connected succesfully
    console.log('connection open')
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
      console.log('connection closed')
    })

    ws.on('error', (error) => {
      gallerySetConnected(false)
      console.error(error)
      ws.close()
    })
  })
}

function galleryParseBinary(data) {
  console.log(data)
  //fs.writeFileSync(galleryModule.path + 'image.jpg', data)
  //ws.send('something')
}

function galleryParseString(data) {
  //Get client (for better readability)
  const client = gallery.client

  //Parse object
  const object = JSON.parse(data.toString())

  //Check action
  switch (object.action) {
    //Info about albums (how many albums are there, for example)
    case 'albumsInfo': {
      //Save albums info
      client.albumsInfo.size = object.size
      client.albumsInfo.received = 0

      //Resize albums array
      client.albums.length = client.albumsInfo.size

      //Request album files
      galleryWS.send(JSON.stringify({
        action: 'requestAlbums'
      }))
      break
    }

    //Received an album
    case 'album': {
      //Save album files
      client.albums[object.index] = object.files

      //Finished receiving albums?
      client.albumsInfo.received++
      if (client.albumsInfo.received >= client.albumsInfo.size) console.log("Received all albums")
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