 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

let connectM = sModule
let connectServer = null
let connectSocket = null
let connectLog = ''
let connect = getKey('connect')


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

  connectServer.on('error', function (e) {
    console.log(e)
    connectServer.close()
  })

  connectServer.listen(4444, function() {
    var socket = Net.createConnection(80, 'www.google.com')
    socket.on('connect', function() {
      connectAppend(`Server started on ${socket.address().address} (Port: 4444)<br>`)
      socket.end()
    })
    socket.on('error', function(e) {
      connectAppend(`Server started on localhost (Port: 4444)<br>`)
    })
  })

  connectServer.on('connection', function(socket) {
    connectSocket = socket
    connectSocket.write('Connection established\r\n')
    connectAppend('Connection established<br>')
    if (cModule.path != connectM.path)
      createNoti('Connect', 'Connection established', { onClick: () => loadModule(connectM.name)})
  
    connectSocket.on('data', function(chunk) {
      connectAppend(`<ins>Received:</ins> ${chunk.toString()}<br>`)
      if (cModule.path != connectM.path)
        createNoti('Connect', 'Received: '+chunk.toString(), { onClick: () => loadModule(connectM.name)})
    })

    connectSocket.on('end', function() {
      connectSocket = null
      connectAppend('Connection closed<br>')
      if (cModule.path != connectM.path)
        createNoti('Connect', 'Connection closed', { onClick: () => loadModule(connectM.name)})
    })

    connectSocket.on('error', function(err) {
      connectAppend(`<ins>Error:</ins> ${err}<br>`)
      if (cModule.path != connectM.path)
        createNoti('Connect', 'Error: '+err, { onClick: () => loadModule(connectM.name)})
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

//Settings key
if (connect == undefined) {
  connect = { start: false }
  setKey('connect', connect)
}

//Start server
if (!connectM.hidden && connect.start) connectStartFTP()