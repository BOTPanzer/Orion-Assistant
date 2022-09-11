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
    connectAppend('Server is Already Running<br>')
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
      connectAppend(`Server Started on ${socket.address().address} (Port: 4444)<br>`)
      socket.end()
    })
    socket.on('error', function(e) {
      connectAppend(`Server Started on localhost (Port: 4444)<br>`)
    })
  })

  connectServer.on('connection', function(socket) {
    connectSocket = socket
    connectSocket.write('Connection Established\r\n')
    connectAppend('Connection Established<br>')
    if (currentModule != connectModule)
      createNoti('Connect', 'Connection Established', { onclick: () => loadModule(connectModule)})
  
    connectSocket.on('data', function(chunk) {
      connectAppend(`<ins>Received:</ins> ${chunk.toString()}<br>`)
      if (currentModule != connectModule)
        createNoti('Connect', 'Received: '+chunk.toString(), { onclick: () => loadModule(connectModule)})
    })

    connectSocket.on('end', function() {
      connectSocket = null
      connectAppend('Connection Closed<br>')
      if (currentModule != connectModule)
        createNoti('Connect', 'Connection Closed', { onclick: () => loadModule(connectModule)})
    })

    connectSocket.on('error', function(err) {
      connectAppend(`<ins>Error:</ins> ${err}<br>`)
      if (currentModule != connectModule)
        createNoti('Connect', 'Error: '+err, { onclick: () => loadModule(connectModule)})
    })
  })
}

function connectAppend(text) {
  connectLog = connectLog+text
  if (document.getElementById('connectLog') != null)
    document.getElementById('connectLog').innerHTML = connectLog
}