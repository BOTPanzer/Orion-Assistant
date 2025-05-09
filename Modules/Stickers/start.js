  /*$$$$$                  /$$          
 /$$__  $$                | $$          
| $$  \__/  /$$$$$$   /$$$$$$$  /$$$$$$ 
| $$       /$$__  $$ /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$  | $$| $$$$$$$$
| $$    $$| $$  | $$| $$  | $$| $$_____/
|  $$$$$$/|  $$$$$$/|  $$$$$$$|  $$$$$$$
 \______/  \______/  \_______/ \______*/

//Create stickers shortcut
const stickersModuleMainPath = cModule.mainPath
createShortcut(() => {
    //Screen info
    const mouse = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(mouse)

    //Window info
    const margin = 80
    const size = {
        width: 720,
        height: 460
    }

    //Get position with margin around screen borders
    const pos = {
        x: clamp(mouse.x - size.width / 2, 
                 display.bounds.x + margin,
                 display.bounds.x - margin - size.width + display.bounds.width),
        y: clamp(mouse.y - size.height / 2, 
                 display.bounds.y + margin, 
                 display.bounds.y - margin - size.height + display.bounds.height),
    }

    //Create window
    createOrionWindow(stickersModuleMainPath, null, {
        width: size.width, 
        height: size.height, 
        x: pos.x,
        y: pos.y,
        fullscreenable: false,
    })
}, 'CommandOrControl+Alt+S', {
    tag: 'openStickers',
    permanent: true
})