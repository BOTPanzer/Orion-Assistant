 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

var connectModule = cModule
var connectServer = null
var connectSocket = null
var connectLog = ''


 /*$$$$$$$                              /$$     /$$                              
| $$_____/                             | $$    |__/                              
| $$    /$$   /$$ /$$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$| $$  | $$| $$__  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__/| $$  | $$| $$  \ $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$ 
| $$   | $$  | $$| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$   |  $$$$$$/| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/    \______/ |__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/ 

function connectStartFTP() {
  if (connectServer != null) {
    connectAppend('Server is already running<br>')
    return
  }

  const Net = require('net')
  connectServer = new Net.Server()

  connectServer.on('error', (error) => {
    console.log(error)
    connectServer.close()
  })

  connectServer.listen(4444, () => {
    var socket = Net.createConnection(80, 'www.google.com')
    socket.on('connect', () => {
      connectAppend(`Server started on ${socket.address().address} (Port: 4444)<br>`)
      socket.end()
    })
    socket.on('error', (error) => {
      connectAppend(`Server started on localhost (Port: 4444)<br>`)
    })
  })

  connectServer.on('connection', (socket) => {
    connectSocket = socket
    connectSocket.write('Connection established\r\n')
    connectAppend('Connection established<br>')
    if (cModule.path != connectModule.path) createNoti('Connect', 'Connection established', { onClick: () => loadModule(connectModule.name)})
  
    connectSocket.on('data', function(chunk) {
      connectAppend(`<ins>Received:</ins> ${chunk.toString()}<br>`)
      if (cModule.path != connectModule.path) createNoti('Connect', 'Received: '+chunk.toString(), { onClick: () => loadModule(connectModule.name)})
    })

    connectSocket.on('end', () => {
      connectSocket = null
      connectAppend('Connection closed<br>')
      if (cModule.path != connectModule.path) createNoti('Connect', 'Connection closed', { onClick: () => loadModule(connectModule.name)})
    })

    connectSocket.on('error', (error) => {
      connectAppend(`<ins>Error:</ins> ${error}<br>`)
      if (cModule.path != connectModule.path) createNoti('Connect', 'Error: '+error, { onClick: () => loadModule(connectModule.name)})
    })
  })
}

function connectAppend(text) {
  connectLog = connectLog+text
  let elem = document.getElementById('connectLog')
  if (elem != null) {
    elem.innerHTML = connectLog
    elem.scrollTo(0, elem.scrollHeight)
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
if (!connectModule.isHidden && settings.get('start', false)) connectStartFTP()