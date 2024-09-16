  /*$$$$$   /$$
 /$$__  $$ | $$
| $$  \__//$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
|  $$$$$$|_  $$_/   /$$__  $$ /$$__  $$ /$$__  $$ /$$_____/
 \____  $$ | $$    | $$  \ $$| $$  \__/| $$$$$$$$|  $$$$$$
 /$$  \ $$ | $$ /$$| $$  | $$| $$      | $$_____/ \____  $$
|  $$$$$$/ |  $$$$/|  $$$$$$/| $$      |  $$$$$$$ /$$$$$$$/
 \______/   \___/   \______/ |__/       \_______/|______*/

class Store {

  //Store id & name
  id = 'elamigos'
  name = 'ElAmigos'

  //Urls for opening outside, home items & search items
  url =       'https://www.elamigos-games.net/'
  urlHome =   'https://www.elamigos-games.net/'
  urlSearch = 'https://www.elamigos-games.net/?q='

  //Other
  search

  constructor() {}

  //Search
  async create(storeUpdateTime, search) {
    //Start search
    searchingResults(this.id)
    this.search = search

    //Get HTML
    const url = (search == '' ? this.urlHome : this.urlSearch + search)
    const result = await getHTML(url)

    //Check if module changed or if it timed out
    if (cModule.path != storePath || storeUpdateTime != storeLastUpdateTime) return

    //Check if result is valid
    if (typeof result !== 'string') {
      noResults(this.id)
      return
    }

    //Create store
    const items = this.getItems(this.split(result))

    //No results
    if (items.length == 0) {
      noResults(this.id)
      return
    }
    
    //Store type
    let isRow = (storeCreated % 2)
    if (isRow) {
      createStoreRow(this.id, this.url, this.name)
    } else {
      createStore(this.id, this.url, this.name)
    }

    //Add games
    for(i in items) {
      //Data
      let id = items[i].id = `${this.id}-${i}-${Date.now()}`
      let link = items[i].link
      let image = items[i].image
      let name = items[i].name
      let info = items[i].info

      //Create item element
      if (isRow) {
        document.getElementById('list-' + this.id).insertAdjacentHTML('beforeend', createStoreItemRowHTML(id, image, name, info))
        addListenerRow(id, link, this.id, name, info)
      } else {
        document.getElementById('list-' + this.id).insertAdjacentHTML('beforeend', createStoreItemHTML(id, image, name, info))
        addListener(id, link, this.id, name, info)
      }

      //Item created
      this.onCreateItem(items[i])
    }

    //Select first
    if (!isRow && document.getElementById('list-' + this.id).childNodes.length > 0) document.getElementById('list-' + this.id).firstChild.click()
  }

  //Parsing HTML items
  split(result) {
    //Split into parts
    return result
  }

  getItems(parts) {
    //Get item links, names & images
    const items = []

    //Return items
    return items
  }

  //Other
  async onCreateItem(item) {}
}

class StoreElAmigos extends Store {

  //Store id & name
  id = 'elamigos'
  name = 'El Amigos'

  //Urls for opening outside, home items & search items
  url =       'https://www.elamigos-games.net/'
  urlHome =   'https://www.elamigos-games.net/'
  urlSearch = 'https://www.elamigos-games.net/?q='

  constructor() { super() }

  //Parsing HTML items
  split(result) {
    //Split into parts
    return result.substring(result.indexOf('class="row"')).split('portfolio-item')
  }

  getItems(parts) {
    //Get item links, names & images
    const items = []
    for(i in parts) {
      //Reached max length
      if (items.length == 12) break

      //Link
      let tmp = parts[i].substring(parts[i].lastIndexOf('href="') + 6)
      tmp = tmp.substring(0, tmp.indexOf('<'))
      let link = tmp.substring(0, tmp.indexOf('"'))

      //Image
      let img = parts[i].substring(parts[i].indexOf('src="')+5)
      img = 'https://www.elamigos-games.net' + img.substring(0, img.indexOf('"'))

      //Name
      let name = tmp.substring(tmp.indexOf('>')+1)

      //Info
      let info = parts[i].substring(parts[i].lastIndexOf('<small>')+7)
      info = info.substring(0, info.indexOf('</small>'))
      info = info.replaceAll('+', '').trim()

      //Create item object
      if (link != '' && img != '' && link.startsWith('https://www.elamigos-games.net')) {
        items.push({
          link: link,
          image: img,
          name: titleCase(name),
          info: info
        })
      }
    }

    //Return items
    return items
  }
}

class StoreFitgirl extends Store {
  
  //Store id & name
  id = 'fitgirl'
  name = 'Fitgirl'

  //Urls for opening outside, home items & search items
  url =       'https://fitgirl-repacks.site/'
  urlHome =   'https://fitgirl-repacks.site/'
  urlSearch = 'https://fitgirl-repacks.site/?s='

  constructor() { super() }

  //Parsing HTML items
  split(result) {
    //Split into parts
    const parts = result.split('<article id')
    parts.shift(0, 1)
    return parts
  }

  getItems(parts) {
    //Get item links, names & images
    const items = []
    for(i in parts) {
      //Remove uncategorized (not games)
      if (parts[i].includes('>Uncategorized</a>')) continue

      //Link
      let link = parts[i].substring(parts[i].indexOf('entry-title'))
      link = link.substring(link.indexOf('href="https://fitgirl-repacks.site/')+6)
      link = link.substring(0, link.indexOf('"'))

      //Image
      let img = ''
      if (this.search == '' && parts[i].includes('src="')) {
        img = parts[i].substring(parts[i].indexOf('src="')+5)
        img = img.substring(0, img.indexOf('"'))
      }

      //Name
      let name = parts[i].substring(parts[i].indexOf('rel="bookmark">')+15)
      name = name.substring(0, name.indexOf('<'))
      if (name.toLowerCase().includes('updates digest')) continue
      
      //Info
      let info = ''
      if (name.includes('&#8211;')) {
        let name2 = name.substring(0, name.indexOf('&#8211;')).trim()
        info = name.substring(name.indexOf('&#8211;')+7).trim()
        name = name2
      }

      //Create item object
      if (link != '' && name != '' && name != 'Upcoming repacks') {
        items.push({
          link: link,
          image: img,
          name: titleCase(name),
          info: info
        })
      }
    }

    //Return items
    return items
  }

  //Other
  async onCreateItem(item) {
    //Get HTML for image
    const html = await getHTML(item.link)
    if (html == undefined) return
    
    //Get image
    let img = html.substring(html.indexOf('<h1 class="entry-title">'))
    img = img.substring(img.indexOf('src="')+5)
    img = img.substring(0, img.indexOf('"'))
    
    //Set image
    let imgElement = document.getElementById('img-' + item.id)
    if (imgElement != null) {
      if (imgElement.tagName == 'IMG')
        imgElement.src = img
      else {
        imgElement.style.backgroundImage = `url('${img}')`
        if (document.getElementById('link-fitgirl').innerHTML == item.link)
          document.getElementById('featured-fitgirl').style.backgroundImage = `url('${img}')`
      }
    }
  }
}

class StorePivi extends Store {
  
  //Store id & name
  id = 'pivi'
  name = 'Pivi'

  //Urls for opening outside, home items & search items
  url =       'https://pivigames.blog/'
  urlHome =   'https://pivigames.blog/'
  urlSearch = 'https://pivigames.blog/?s='

  constructor() { super() }

  //Parsing HTML items
  split(result) {
    //Split into parts
    let part = result.substring(result.indexOf('<div id="gp-content-wrapper"')) //remove top bar
    part = part.substring(part.indexOf('<section class="gp-post-item gp-standard-post'))
    return part.split('<section')
  }

  getItems(parts) {
    //Get item links, names & images
    const items = []
    for(i in parts) {
      //Exclusions
      let tmp = parts[i].toLowerCase()
      if (tmp.includes('>estrenos<') || tmp.includes('>tops<') || tmp.includes('>promociones<') || tmp.includes('>oferta<') || tmp.includes('>free to play<') || tmp.includes('>destacadas<')) continue

      //Link
      let link = parts[i].substring(parts[i].indexOf('href="')+6)
      link = link.substring(0, link.indexOf('"')-1)

      //Image
      let img = parts[i].substring(parts[i].indexOf('src="')+5)
      img = img.substring(0, img.indexOf('"'))

      //Name
      let name = parts[i].substring(parts[i].indexOf('title="')+7)
      name = name.substring(0, name.indexOf('"'))

      //Info
      let info = ''
      if (name.toLowerCase().includes('pc ')) {
        let name2 = name.substring(0, name.toLowerCase().indexOf('pc ')).trim()
        info = name.substring(name.toLowerCase().indexOf('pc ')+2).replaceAll('+', '').trim()
        name = name2
      }

      //Create item object
      if (link != '' && name != '' && !name.toLowerCase().includes('sorteo') && img != '' && link.startsWith('https://pivigames.blog/') && !link.startsWith('https://pivigames.blog/dmca')) {
        items.push({
          link: link,
          image: img,
          name: titleCase(name),
          info: info
        })
      }
    }

    //Return items
    return items
  }
}

class StoreSteamUnlocked extends Store {
  
  //Store id & name
  id = 'steamunlocked'
  name = 'Steam Unlocked'

  //Urls for opening outside, home items & search items
  url =       'https://steamunlocked.net/'
  urlHome =   'https://steamunlocked.net/'
  urlSearch = 'https://steamunlocked.net/?s='

  constructor() { super() }

  //Parsing HTML items
  split(result) {
    //Split into parts
    let parts
    if (this.search == '') {
      //Homepage
      let part = result.substring(result.indexOf('class="homepage-category"')) //remove top
      part = part.substring(0, part.indexOf('class="homepage-category__btn"')) //remove bottom
      parts = part.split('class="cover-item"')
    } else {
      //Search
      let part = result.substring(result.indexOf('class="cover-items"')) //remove top
      part = part.substring(0, part.indexOf('class="col-lg-4"')) //remove bottom
      parts = part.split('class="cover-item category"')
    }
    return parts
  }

  getItems(parts) {
    //Get item links, names & images
    const items = []
    for(i in parts) {
      //Reached max length
      if (items.length == 12) break

      //Link
      let link = parts[i].substring(parts[i].indexOf('href="') + 6)
      link = link.substring(0, link.indexOf('"') - 1)

      //Image
      let img = parts[i].substring(parts[i].lastIndexOf('src="') + 5)
      img = img.substring(0, img.indexOf('"'))

      //Name
      let name
      if (this.search == '') {
        //Homepage
        name = parts[i].substring(parts[i].indexOf('class="cover-item-content__title"') + 34)
        name = name.substring(0, name.indexOf('</div>'))
      } else {
        //Search
        name = parts[i].substring(parts[i].indexOf('<h1>') + 4)
        name = name.substring(0, name.indexOf('</h1>'))
      }
      
      //Info
      let info = ''
      if (name.toLowerCase().includes('free download')) {
        let tmp = name.substring(0, name.toLowerCase().indexOf('free download')).trim()
        info = name.substring(name.toLowerCase().indexOf('free download') + 13).trim()
        name = tmp
      }

      //Create item object
      if (link != '' && name != '' && img != '') {
        items.push({
          link: link,
          image: img,
          name: titleCase(name),
          info: info
        })
      }
    }

    //Return items
    return items
  }
}

class StoreOnlineFix extends Store {
  
  //Store id & name
  id = 'onlinefix'
  name = 'Online Fix'

  //Urls for opening outside, home items & search items
  url =       'https://online-fix.me/'
  urlHome =   'https://online-fix.me/'
  urlSearch = 'https://online-fix.me/index.php?do=search&subaction=search&story='

  constructor() { super() }

  //Parsing HTML items
  split(result) {
    //Split into parts
    let parts = ''
    try {
      let part = result.substring(result.indexOf('class="article clr"')) //remove top
      if (this.search != '')
        part = part.substring(0, part.indexOf('class="sidebar"')) //to bot
      else
        part = part.substring(0, part.indexOf('class="game-rating clr"')) //to bot
      parts = part.split('class="article clr')
    } catch(e) {
      noResults(this.id)
    }
    return parts
  }

  getItems(parts) {
    //Get item links, names & images
    const items = []
    for(i in parts) {
      //Reached max length
      if (items.length == 12) break

      //Link
      let link = parts[i].substring(parts[i].indexOf('href="')+6)
      link = link.substring(0, link.indexOf('"'))

      //Image
      let img = parts[i].substring(parts[i].indexOf('data-src="')+10)
      img = img.substring(0, img.indexOf('"'))

      //Name
      let name = parts[i].substring(parts[i].indexOf('class="title"')+14)
      name = name.substring(0, name.indexOf('</h2>'))
      name = name.replaceAll('по сети', '').trim()

      //Info
      let info = parts[i].substring(parts[i].indexOf('class="edit"')+13)
      info = info.substring(0, info.indexOf('</div>'))
      info = info.replaceAll('по сети', '').replaceAll('&nbsp;', '').trim()

      //Create item object
      if (link != '' && name != '' && img != '') {
        items.push({
          link: link,
          image: img,
          name: name,
          info: info
        })
      }
    }

    //Return items
    return items
  }
}