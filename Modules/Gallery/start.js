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
  },
  albumsInfo: {},
  albums: []
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
    gallery.app.connected = true
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
      gallery.app.connected = false
      console.log('connection closed')
    })

    ws.on('error', (error) => {
      gallery.app.connected = false
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
  //Parse object
  const object = JSON.parse(data.toString())
  //console.log(object)

  //Check action
  switch (object.action) {
    //Info about albums (how many are there, for example)
    case 'albumsInfo': {
      //Save albums info
      gallery.albumsInfo = {
        size: object.size,
        received: 0,
      }

      //Resize albums array
      gallery.albums.length = gallery.albumsInfo.size

      //Request album files
      galleryWS.send(JSON.stringify({
        action: 'requestAlbums'
      }))
      break
    }

    //Received an album
    case 'album': {
      //Save album files
      gallery.albums[object.index] = object.files

      //Finished receiving albums?
      gallery.albumsInfo.received++
      if (gallery.albumsInfo.received >= gallery.albumsInfo.size) console.log("Received all albums")
      break
    }
  }
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