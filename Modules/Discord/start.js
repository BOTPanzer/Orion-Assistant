 /*$    /$$                             
| $$   | $$                             
| $$   | $$ /$$$$$$   /$$$$$$   /$$$$$$$
|  $$ / $$/|____  $$ /$$__  $$ /$$_____/
 \  $$ $$/  /$$$$$$$| $$  \__/|  $$$$$$ 
  \  $$$/  /$$__  $$| $$       \____  $$
   \  $/  |  $$$$$$$| $$       /$$$$$$$/
    \_/    \_______/|__/      |______*/ 

let discordClient = undefined
let discordLastId = ''
let discordActivity = {}
let discordReady = false


 /*$$$$$$$                              /$$     /$$                              
| $$_____/                             | $$    |__/                              
| $$    /$$   /$$ /$$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$| $$  | $$| $$__  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__/| $$  | $$| $$  \ $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$ 
| $$   | $$  | $$| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$   |  $$$$$$/| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/    \______/ |__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/ 

function discordConnect(id) {
  let isLoaded = document.getElementById('discordIsLoaded')
  if (discordLastId == id) {
    discordSetActivity()
  } else {
    const RPC = require('discord-rpc')
    //CREATE OR DESTROY CLIENT
    if (discordClient != undefined) 
      discordClient.destroy()
    discordClient = new RPC.Client({ transport: 'ipc' })
    //VARIABLES
    discordLastId = id
    discordReady = false
    if (isLoaded != null)
      isLoaded.style.background = 'var(--danger)'
    //LISTENERS
    discordClient.on('ready', async () => {
      createNoti('Discord' ,'Client connected & ready')
      discordReady = true
      if (isLoaded != null)
        isLoaded.style.background = 'var(--success)'
      discordSetActivity()
    })
    //LOGIN
    discordClient.login({ clientId: id })
  }

  /*createNoti('Discord' ,'Channel ID changes require restart', function() {
    restartAssistant()
  })*/
}

function discordSetActivity() {
  if (discordActivity != {}) 
    discordClient.request("SET_ACTIVITY", { pid: process.pid, activity: discordActivity })
}