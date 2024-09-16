 /*$$$$$$$                              /$$     /$$                              
| $$_____/                             | $$    |__/                              
| $$    /$$   /$$ /$$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$| $$  | $$| $$__  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__/| $$  | $$| $$  \ $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$ 
| $$   | $$  | $$| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$   |  $$$$$$/| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/    \______/ |__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/ 

function stickersCreateWindow() {
  //Screen info
  const mouse = screen.getCursorScreenPoint()
  const display = screen.getDisplayNearestPoint(mouse)

  //Window info
  const size = {
    width: 720,
    height: 460
  }
  const margin = 80

  //Get position with margin around screen borders
  let pos = {
    x: clamp(mouse.x - size.width / 2, 
              display.bounds.x + margin,
              display.bounds.x - margin - size.width + display.bounds.width),
    y: clamp(mouse.y - size.height / 2, 
              display.bounds.y + margin, 
              display.bounds.y - margin - size.height + display.bounds.height),
  }

  //Create window
  createOrionWindow(stickersModulePath + 'main.html', stickersModulePath, { 
    width: size.width, 
    height: size.height, 
    x: pos.x,
    y: pos.y,
    fullscreenable: false,
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

//Create stickers shortcut
const stickersModulePath = sModule.path
createShortcut('CommandOrControl+Alt+S', stickersCreateWindow, {
  tag: 'openStickers',
  permanent: true
})