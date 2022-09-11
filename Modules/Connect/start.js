// /$$    /$$  /$$$$$$  /$$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$$  /$$       /$$$$$$$$  /$$$$$$ 
//| $$   | $$ /$$__  $$| $$__  $$|_  $$_/ /$$__  $$| $$__  $$| $$      | $$_____/ /$$__  $$
//| $$   | $$| $$  \ $$| $$  \ $$  | $$  | $$  \ $$| $$  \ $$| $$      | $$      | $$  \__/
//|  $$ / $$/| $$$$$$$$| $$$$$$$/  | $$  | $$$$$$$$| $$$$$$$ | $$      | $$$$$   |  $$$$$$ 
// \  $$ $$/ | $$__  $$| $$__  $$  | $$  | $$__  $$| $$__  $$| $$      | $$__/    \____  $$
//  \  $$$/  | $$  | $$| $$  \ $$  | $$  | $$  | $$| $$  \ $$| $$      | $$       /$$  \ $$
//   \  $/   | $$  | $$| $$  | $$ /$$$$$$| $$  | $$| $$$$$$$/| $$$$$$$$| $$$$$$$$|  $$$$$$/
//    \_/    |__/  |__/|__/  |__/|______/|__/  |__/|_______/ |________/|________/ \______/

let connectModule = lastStartModule
let connectServer = null
let connectSocket = null
let connectLog = ''
let connect = getKey('connect')


//  /$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$$$
// /$$__  $$ /$$__  $$| $$__  $$| $$_____/
//| $$  \__/| $$  \ $$| $$  \ $$| $$      
//| $$      | $$  | $$| $$  | $$| $$$$$   
//| $$      | $$  | $$| $$  | $$| $$__/   
//| $$    $$| $$  | $$| $$  | $$| $$      
//|  $$$$$$/|  $$$$$$/| $$$$$$$/| $$$$$$$$
// \______/  \______/ |_______/ |________/

//SETTINGS KEY
if (connect == undefined) {
  connect = { start: false }
  setKey('connect', connect)
}

//START SERVER
if (!fs.existsSync(connectModule+'hidden') && connect.start) connectStartFTP()


// /$$$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$  /$$   /$$  /$$$$$$ 
//| $$_____/| $$  | $$| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$| $$$ | $$ /$$__  $$
//| $$      | $$  | $$| $$$$| $$| $$  \__/   | $$     | $$  | $$  \ $$| $$$$| $$| $$  \__/
//| $$$$$   | $$  | $$| $$ $$ $$| $$         | $$     | $$  | $$  | $$| $$ $$ $$|  $$$$$$ 
//| $$__/   | $$  | $$| $$  $$$$| $$         | $$     | $$  | $$  | $$| $$  $$$$ \____  $$
//| $$      | $$  | $$| $$\  $$$| $$    $$   | $$     | $$  | $$  | $$| $$\  $$$ /$$  \ $$
//| $$      |  $$$$$$/| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/| $$ \  $$|  $$$$$$/
//|__/       \______/ |__/  \__/ \______/    |__/   |______/ \______/ |__/  \__/ \______/

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
    if (currentModule != connectModule)
      createNoti('Connect', 'Connection established', { onClick: () => loadModule(connectModule)})
  
    connectSocket.on('data', function(chunk) {
      connectAppend(`<ins>Received:</ins> ${chunk.toString()}<br>`)
      if (currentModule != connectModule)
        createNoti('Connect', 'Received: '+chunk.toString(), { onClick: () => loadModule(connectModule)})
    })

    connectSocket.on('end', function() {
      connectSocket = null
      connectAppend('Connection closed<br>')
      if (currentModule != connectModule)
        createNoti('Connect', 'Connection closed', { onClick: () => loadModule(connectModule)})
    })

    connectSocket.on('error', function(err) {
      connectAppend(`<ins>Error:</ins> ${err}<br>`)
      if (currentModule != connectModule)
        createNoti('Connect', 'Error: '+err, { onClick: () => loadModule(connectModule)})
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