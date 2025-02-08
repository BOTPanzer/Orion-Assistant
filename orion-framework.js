  /*$$$$$  /$$$$$$$  /$$$$$$  /$$$$$$  /$$   /$$
 /$$__  $$| $$__  $$|_  $$_/ /$$__  $$| $$$ | $$
| $$  \ $$| $$  \ $$  | $$  | $$  \ $$| $$$$| $$
| $$  | $$| $$$$$$$/  | $$  | $$  | $$| $$ $$ $$
| $$  | $$| $$__  $$  | $$  | $$  | $$| $$  $$$$
| $$  | $$| $$  \ $$  | $$  | $$  | $$| $$\  $$$
|  $$$$$$/| $$  | $$ /$$$$$$|  $$$$$$/| $$ \  $$
 \______/ |__/  |__/|______/ \______/ |__/  \__/

 /$$$$$$$$ /$$$$$$$   /$$$$$$  /$$      /$$ /$$$$$$$$ /$$      /$$  /$$$$$$  /$$$$$$$  /$$   /$$
| $$_____/| $$__  $$ /$$__  $$| $$$    /$$$| $$_____/| $$  /$ | $$ /$$__  $$| $$__  $$| $$  /$$/
| $$      | $$  \ $$| $$  \ $$| $$$$  /$$$$| $$      | $$ /$$$| $$| $$  \ $$| $$  \ $$| $$ /$$/ 
| $$$$$   | $$$$$$$/| $$$$$$$$| $$ $$/$$ $$| $$$$$   | $$/$$ $$ $$| $$  | $$| $$$$$$$/| $$$$$/  
| $$__/   | $$__  $$| $$__  $$| $$  $$$| $$| $$__/   | $$$$_  $$$$| $$  | $$| $$__  $$| $$  $$  
| $$      | $$  \ $$| $$  | $$| $$\  $ | $$| $$      | $$$/ \  $$$| $$  | $$| $$  \ $$| $$\  $$ 
| $$      | $$  | $$| $$  | $$| $$ \/  | $$| $$$$$$$$| $$/   \  $$|  $$$$$$/| $$  | $$| $$ \  $$
|__/      |__/  |__/|__/  |__/|__/     |__/|________/|__/     \__/ \______/ |__/  |__/|__/  \__/

             /$$$$$$      /$$$$$$      /$$$$$$ 
            /$$__  $$    /$$$_  $$    /$$$_  $$
 /$$    /$$|__/  \ $$   | $$$$\ $$   | $$$$\ $$
|  $$  /$$/   /$$$$$/   | $$ $$ $$   | $$ $$ $$
 \  $$/$$/   |___  $$   | $$\ $$$$   | $$\ $$$$
  \  $$$/   /$$  \ $$   | $$ \ $$$   | $$ \ $$$
   \  $/   |  $$$$$$//$$|  $$$$$$//$$|  $$$$$$/
    \_/     \______/|__/ \______/|__/ \______/ 





 /*$$$$$$$ /$$                                               /$$
| $$_____/| $$                                              | $$
| $$      | $$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
| $$$$$   | $$ /$$__  $$| $$_  $$_  $$ /$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$__/   | $$| $$$$$$$$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$      | $$| $$_____/| $$ | $$ | $$| $$_____/| $$  | $$  | $$ /$$\____  $$
| $$$$$$$$| $$|  $$$$$$$| $$ | $$ | $$|  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
|________/|__/ \_______/|__/ |__/ |__/ \_______/|__/  |__/   \___/ |______*/

function getBoolean(elem, att) {
  return elem.hasAttribute(att) 
}

function setBoolean(elem, att, val) {
  if (val)
    elem.setAttribute(att, '')
  else 
    elem.removeAttribute(att)
}

function getString(elem, att) {
  if (elem.hasAttribute(att)) return elem.getAttribute(att)
  else return ''
}

function setString(elem, att, val, posib) {
  if (Array.isArray(posib)) {
    if (posib.indexOf(val) != -1)
      elem.setAttribute(att, val)
    else 
      elem.removeAttribute(att)
  } else {
    if (val)
      elem.setAttribute(att, val)
    else 
      elem.removeAttribute(att)
  }
}

function getOrionColor(val) {
  let colors = ['background', 'menu', 'scrollbar', 'scrollbarThumb', 'accent', 'success', 'danger', 'warning', 'progress', 'text', 'textSecondary', 'textHint', 'textWindowButton', 'button', 'buttonBorderColor', 'windowButtonHover', 'windowExitHover']
  if (typeof val !== 'string') val = ''
  if (colors.indexOf(val) >= 0) 
    return `var(--${val})`
  else
    return val
}

function getChildByAtt(att, parent) {
  let elems = parent.getElementsByTagName("*");
  for (let i = 0; i < elems.length; i++) {
    if (getBoolean(elems[i], att))
      return elems[i]
  }
  return null
}

function attIsString(value) {
  return typeof value == 'string' && value != ''
}





 /*$$$$$$                     
| $$__  $$                    
| $$  \ $$  /$$$$$$  /$$   /$$
| $$$$$$$  /$$__  $$|  $$ /$$/
| $$__  $$| $$  \ $$ \  $$$$/ 
| $$  \ $$| $$  | $$  >$$  $$ 
| $$$$$$$/|  $$$$$$/ /$$/\  $$
|_______/  \______/ |__/  \_*/

class OrionElement extends HTMLElement {
  static get observedAttributes() { return ['background', 'color', 'width', 'height', 'corner'] }

  //Attributes
  get background() { return getString(this, 'background') }
  set background(val) { setString(this, 'background', val) }
  get color() { return getString(this, 'color') }
  set color(val) { setString(this, 'color', val) }
  get width() { return getString(this, 'width') }
  set width(val) { setString(this, 'width', val) }
  get height() { return getString(this, 'height') }
  set height(val) { setString(this, 'height', val) }
  get hover() { return getString(this, 'hover') }
  set hover(val) { setString(this, 'hover', val) }
  get corner() { return getString(this, 'corner') }
  set corner(value) { setString(this, 'corner', value) }

  
  constructor() { super() }

  connectedCallback() {    
    //On create for child classes
    this.onCreate()
  }
  
  attributeChangedCallback(name, oldValue, value) {
    switch(name) {
      case 'background':
        this.style.setProperty('--oBackground', getOrionColor(value))
        break
      case 'color':
        this.style.setProperty('--oColor', getOrionColor(value))
        break
      case 'width':
        if (this.hasAttribute('width'))
          this.style.setProperty('--oWidth', value)
        else
          this.style.removeProperty('--oWidth')
      break
      case 'height':
        if (this.hasAttribute('height'))
          this.style.setProperty('--oHeight', value)
        else
          this.style.removeProperty('--oHeight')
        break
      case 'corner':
        if (!value) this.style.removeProperty('--oCorner')
        else this.style.setProperty('--oCorner', value)
        break
      default:
        this.onAttributeChanged(name, oldValue, value)
        break
    }
  }

  //Custom
  onCreate() {}

  onAttributeChanged(name, oldValue, value) {}
}

class OrionBox extends OrionElement {

  //Elements
  #hover

  
  constructor() { super() }

  connectedCallback() { 
    //Add class
    this.classList.add('o-box')
    
    //Add hover element
    this.#hover = document.createElement('o-hover')
    this.insertAdjacentElement('afterbegin', this.#hover)

    //On create for child classes
    this.onCreate()
  }
}

customElements.define('o-box', OrionBox)





 /*$$$$$$              /$$     /$$
| $$__  $$            | $$    | $$
| $$  \ $$ /$$   /$$ /$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$
| $$$$$$$ | $$  | $$|_  $$_/|_  $$_/   /$$__  $$| $$__  $$
| $$__  $$| $$  | $$  | $$    | $$    | $$  \ $$| $$  \ $$
| $$  \ $$| $$  | $$  | $$ /$$| $$ /$$| $$  | $$| $$  | $$
| $$$$$$$/|  $$$$$$/  |  $$$$/|  $$$$/|  $$$$$$/| $$  | $$
|_______/  \______/    \___/   \___/   \______/ |__/  |_*/

customElements.define('o-button', class extends OrionBox {
  static get observedAttributes() { return ['text', 'lefticon', 'righticon', 'id'].concat(OrionBox.observedAttributes) }

  //Elements
  #text

  //Attributes
  get text() { return getString(this, 'text') }
  set text(value) { setString(this, 'text', value) }
  get size() { return getString(this, 'size') }
  set size(value) { setString(this, 'size', value) }
  get leftIcon() { return getString(this, 'lefticon') }
  set leftIcon(value) { setString(this, 'lefticon', value) }
  get rightIcon() { return getString(this, 'righticon') }
  set rightIcon(value) { setString(this, 'righticon', value) }

  
  constructor() { super() }

  onCreate() {
    //Add class
    this.classList.add('o-button')

    //Create text element
    this.#text = document.createElement('span')
    this.#text.innerText = getString(this, 'text')
    this.#text.id = 'text-' + this.id
    setBoolean(this.#text, 'text', true)

    //Add text (before right icon if it already exists)
    const rightIcon = getChildByAtt('righticon', this)
    if (!rightIcon) this.appendChild(this.#text)
    else this.insertBefore(this.#text, rightIcon)
  }
  
  onAttributeChanged(name, oldValue, value) {
    switch(name) {
      case 'text':
        if (this.#text) this.#text.innerText = value
        break
      case 'lefticon':
        if (!oldValue) {
          //Create icon
          const leftIcon = document.createElement('img')
          this.insertBefore(leftIcon, this.firstChild)
          setBoolean(leftIcon, 'lefticon', true)
          leftIcon.id = 'lefticon-' + this.id
          leftIcon.alt = 'Button left icon'
          leftIcon.src = value
        } else {
          //Update icon
          const leftIcon = getChildByAtt('lefticon', this)
          if (value) leftIcon.src = value   //Update icon
          else leftIcon.remove()            //Remove icon
        }
        break
      case 'righticon':
        if (!oldValue) {
          //Create icon
          const rightIcon = document.createElement('img')
          this.appendChild(rightIcon, this.firstChild)
          setBoolean(rightIcon, 'righticon', true)
          rightIcon.id = 'righticon-' + this.id
          rightIcon.alt = 'Button right icon'
          rightIcon.src = value
        } else {
          //Update icon
          const rightIcon = getChildByAtt('righticon', this)
          if (value) rightIcon.src = value  //Update icon
          else rightIcon.remove()           //Remove icon
        }
        break
      case 'id': {
        //Update text & icons id
        if (this.#text) this.#text.id = 'text-' + this.id
        const leftIcon = getChildByAtt('lefticon', this)
        if (leftIcon) leftIcon.id = 'lefticon-' + this.id
        const rightIcon = getChildByAtt('righticon', this)
        if (rightIcon) rightIcon.id = 'righticon-' + this.id
        break
      }
    }
  }
})





  /*$$$$$                                        
 /$$__  $$                                       
| $$  \ $$  /$$$$$$   /$$$$$$  /$$$$$$  /$$   /$$
| $$$$$$$$ /$$__  $$ /$$__  $$|____  $$| $$  | $$
| $$__  $$| $$  \__/| $$  \__/ /$$$$$$$| $$  | $$
| $$  | $$| $$      | $$      /$$__  $$| $$  | $$
| $$  | $$| $$      | $$     |  $$$$$$$|  $$$$$$$
|__/  |__/|__/      |__/      \_______/ \____  $$
                                       /$$  | $$
                                      |  $$$$$$/
                                       \_____*/

customElements.define('o-array', class extends HTMLElement {
  static get observedAttributes() { return [] }

  
  constructor() { super() }

  connectedCallback() {
    //Add class
    this.classList.add('o-array')
  }
})





  /*$$$$$                /$$   /$$               /$$      
 /$$__  $$              |__/  | $$              | $$      
| $$  \__/ /$$  /$$  /$$ /$$ /$$$$$$    /$$$$$$$| $$$$$$$ 
|  $$$$$$ | $$ | $$ | $$| $$|_  $$_/   /$$_____/| $$__  $$
 \____  $$| $$ | $$ | $$| $$  | $$    | $$      | $$  \ $$
 /$$  \ $$| $$ | $$ | $$| $$  | $$ /$$| $$      | $$  | $$
|  $$$$$$/|  $$$$$/$$$$/| $$  |  $$$$/|  $$$$$$$| $$  | $$
 \______/  \_____/\___/ |__/   \___/   \_______/|__/  |_*/

customElements.define('o-switch', class extends OrionBox {
  static get observedAttributes() { return ['value', 'disabled', 'checked'].concat(OrionBox.observedAttributes) }
  
  //Elements
  #input

  //Attributes
  get value() { return this.checked }
  set value(value) { this.checked = value }
  get disabled() { return this.#input.disabled }
  set disabled(value) { this.#input.disabled = value }
  get checked() { return this.#input.checked }
  set checked(value) { this.#input.checked = value }

  //Toggle function
  toggle() { this.#input.click(); return this.#input.checked }

  
  constructor() { super() }

  onCreate() {
    //Add class
    this.classList.add('o-switch')

    //Input element
    this.#input = document.createElement('input')
    this.#input.type = 'checkbox'
    this.appendChild(this.#input)

    //Attributes
    this.disabled = this.hasAttribute('disabled')
    this.checked = this.hasAttribute('checked')
  }

  onAttributeChanged(name, oldValue, value) {
    if (!this.#input) return
    switch(name) {
      case 'disabled':
        this.#input.disabled = value
        break
      case 'checked':
        this.#input.checked = value
        break
    }
  }
})





  /*$$$$$  /$$                           /$$       /$$                          
 /$$__  $$| $$                          | $$      | $$                          
| $$  \__/| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$| $$$$$$$   /$$$$$$  /$$   /$$
| $$      | $$__  $$ /$$__  $$ /$$_____/| $$  /$$/| $$__  $$ /$$__  $$|  $$ /$$/
| $$      | $$  \ $$| $$$$$$$$| $$      | $$$$$$/ | $$  \ $$| $$  \ $$ \  $$$$/ 
| $$    $$| $$  | $$| $$_____/| $$      | $$_  $$ | $$  | $$| $$  | $$  >$$  $$ 
|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$| $$$$$$$/|  $$$$$$/ /$$/\  $$
 \______/ |__/  |__/ \_______/ \_______/|__/  \__/|_______/  \______/ |__/  \_*/

customElements.define('o-checkbox', class extends OrionBox {
  static get observedAttributes() { return ['value', 'disabled', 'checked'].concat(OrionBox.observedAttributes) }

  //Elements
  #input

  //Attributes
  get value() { return this.checked }
  set value(value) { this.checked = value }
  get disabled() { return this.#input.disabled }
  set disabled(value) { this.#input.disabled = value }
  get checked() { return this.#input.checked }
  set checked(value) { this.#input.checked = value }

  //Toggle function
  toggle() { this.#input.click(); return this.#input.checked }

  
  constructor() { super() }

  onCreate() {
    //Add class
    this.classList.add('o-checkbox')

    //Input element
    this.#input = document.createElement('input')
    this.#input.type = 'checkbox'
    this.appendChild(this.#input)

    //Attributes
    this.disabled = this.hasAttribute('disabled')
    this.checked = this.hasAttribute('checked')
  }

  onAttributeChanged(name, oldValue, value) {
    if (!this.#input) return
    switch(name) {
      case 'disabled':
        this.#input.disabled = value
        break
      case 'checked':
        this.#input.checked = value
        break
    }
  }
})





 /*$$$$$$                  /$$ /$$          
| $$__  $$                | $$|__/          
| $$  \ $$  /$$$$$$   /$$$$$$$ /$$  /$$$$$$ 
| $$$$$$$/ |____  $$ /$$__  $$| $$ /$$__  $$
| $$__  $$  /$$$$$$$| $$  | $$| $$| $$  \ $$
| $$  \ $$ /$$__  $$| $$  | $$| $$| $$  | $$
| $$  | $$|  $$$$$$$|  $$$$$$$| $$|  $$$$$$/
|__/  |__/ \_______/ \_______/|__/ \_____*/

customElements.define('o-radio', class extends OrionBox {
  static get observedAttributes() { return ['value', 'disabled', 'checked', 'name'].concat(OrionBox.observedAttributes) }

  //Elements
  #input

  //Attributes
  get value() { return this.checked }
  set value(value) { this.checked = value }
  get disabled() { return this.#input.disabled }
  set disabled(value) { this.#input.disabled = value }
  get checked() { return this.#input.checked }
  set checked(value) { this.#input.checked = value }
  get name() { return this.#input.name }
  set name(value) { this.#input.name = value }

  //Toggle function
  toggle() { this.#input.click(); return this.#input.checked }

  
  constructor() { super() }

  onCreate() {
    //Add class
    this.classList.add('o-radio')

    //Input element
    this.#input = document.createElement('input')
    this.#input.type = 'radio'
    this.appendChild(this.#input)

    //Attributes
    this.disabled = this.hasAttribute('disabled')
    this.checked = this.hasAttribute('checked')
    if (this.hasAttribute('name')) this.name = this.getAttribute('name')
  }

  onAttributeChanged(name, oldValue, value) {
    if (!this.#input) return
    switch(name) {
      case 'disabled':
        this.#input.disabled = value
        break
      case 'checked':
        this.#input.checked = value
        break
      case 'name':
        this.#input.name = value
        break
    }
  }
})





 /*$$$$$                                 /$$
|_  $$_/                                | $$
  | $$   /$$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$
  | $$  | $$__  $$ /$$__  $$| $$  | $$|_  $$_/
  | $$  | $$  \ $$| $$  \ $$| $$  | $$  | $$
  | $$  | $$  | $$| $$  | $$| $$  | $$  | $$ /$$
 /$$$$$$| $$  | $$| $$$$$$$/|  $$$$$$/  |  $$$$/
|______/|__/  |__/| $$____/  \______/    \___/
                  | $$
                  | $$
                  |_*/

class OrionInput extends OrionBox {
  static get observedAttributes() { return ['value', 'disabled', 'hint', 'minlength', 'max', 'readonly', 'type', 'label'].concat(OrionBox.observedAttributes) }
  static get types() { return ['text', 'password', 'number'] }

  //Elements
  #input
  #label

  //Attributes
  get value() { return this.#input.value }
  set value(value) { this.#input.value = value }
  get disabled() { return this.#input.disabled }
  set disabled(value) { this.#input.disabled = value }
  get hint() { return this.#input.placeholder }
  set hint(value) { 
    this.#input.placeholder = value; 
    if (getString(this, 'label') == '') this.#label.innerText = value 
  }
  get max() { return this.#input.maxLength }
  set max(value) { this.#input.maxLength = value }
  get readOnly() { return this.#input.readOnly }
  set readOnly(value) { this.#input.readOnly = value }
  get type() { return this.#input.type }
  set type(value) { this.#input.type = OrionInput.types.includes(value) ? value : 'text' }
  get label() { return getString(this, 'label') }
  set label(value) { 
    if (typeof value === 'string') this.setAttribute('label', value)
    else if (typeof value === 'boolean' && value) this.setAttribute('label', '')
    else this.removeAttribute('label')
  }

  
  constructor() { super() }

  onCreate() {
    //Add class
    this.classList.add('o-input')
    
    //Label element
    this.#label = document.createElement('span')
    this.#label.setAttribute('label', '')
    
    //Input element
    this.#input = document.createElement('input')
    this.#input.setAttribute('autocomplete', 'off')
    this.#input.setAttribute('autocorrect', 'off')
    this.#input.setAttribute('autocapitalize', 'off')
    this.#input.setAttribute('spellcheck', 'false')

    //Add input, then label
    this.appendChild(this.#input)
    this.appendChild(this.#label)

    //Attributes
    this.disabled = this.hasAttribute('disabled')
    this.readOnly = this.hasAttribute('readOnly')
    if (this.hasAttribute('value')) this.value = getString(this, 'value')
    if (this.hasAttribute('hint')) this.hint = getString(this, 'hint')
    if (this.hasAttribute('max')) this.max = getString(this, 'max')
    if (this.hasAttribute('type')) this.type = getString(this, 'type')
    this.label = getString(this, 'label')
  }
  
  onAttributeChanged(name, oldValue, value) {
    if (!this.#input) return
    switch(name) {
      case 'value':
        this.value = value
        break
      case 'disabled':
        this.disabled = value
        break
      case 'hint':
        this.placeholder = value
        this.innerText = value
        break
      case 'max':
        this.maxLength = value
        break
      case 'readonly':
        this.readOnly = value
        break
      case 'type':
        this.type = value
        break
      case 'label': {
        const label = getString(this, 'label')
        this.#label.innerText = label != '' ? label : getString(this, 'hint')
        break
      }
    }
  }
}

customElements.define('o-input', OrionInput)





  /*$$$$$                      /$$       /$$                          
 /$$__  $$                    | $$      | $$                          
| $$  \__/  /$$$$$$   /$$$$$$ | $$   /$$| $$$$$$$   /$$$$$$   /$$$$$$ 
|  $$$$$$  /$$__  $$ /$$__  $$| $$  /$$/| $$__  $$ |____  $$ /$$__  $$
 \____  $$| $$$$$$$$| $$$$$$$$| $$$$$$/ | $$  \ $$  /$$$$$$$| $$  \__/
 /$$  \ $$| $$_____/| $$_____/| $$_  $$ | $$  | $$ /$$__  $$| $$      
|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$ \  $$| $$$$$$$/|  $$$$$$$| $$      
 \______/  \_______/ \_______/|__/  \__/|_______/  \_______/|_*/

customElements.define('o-seekbar', class extends OrionElement {
  static get observedAttributes() { return ['value', 'disabled', 'min', 'max'].concat(OrionBox.observedAttributes) }

  //Elements
  #input
  
  //Attributes
  get value() { return this.#input.value }
  set value(value) { this.#input.value = value }
  get disabled() { return this.#input.disabled }
  set disabled(value) { this.#input.disabled = value }
  get min() { return this.#input.min }
  set min(value) { this.#input.min = value }
  get max() { return this.#input.max }
  set max(value) { this.#input.max = value }

  
  constructor() { super() }

  onCreate() {
    //Seekbar class
    this.classList.add('o-seekbar')

    //Create element
    this.#input = document.createElement('input')
    this.#input.type = 'range'
    this.appendChild(this.#input)

    //Attributes
    this.disabled = this.hasAttribute('disabled')
    if (this.hasAttribute('value')) this.value = getString(this, 'value')
    if (this.hasAttribute('min')) this.min = getString(this, 'min')
    if (this.hasAttribute('max')) this.max = getString(this, 'max')
  }

  onAttributeChanged(name, oldValue, value) {
    if (!this.#input) return
    switch(name) {
      case 'value':
        this.value = value
        break
      case 'disabled':
        this.disabled = this.hasAttribute('disabled')
        break
      case 'min':
        this.min = value
        break
      case 'max':
        this.max = value
        break
    }
  }
})





 /*$                                 /$$ /$$                    
| $$                                | $$|__/                    
| $$        /$$$$$$   /$$$$$$   /$$$$$$$ /$$ /$$$$$$$   /$$$$$$ 
| $$       /$$__  $$ |____  $$ /$$__  $$| $$| $$__  $$ /$$__  $$
| $$      | $$  \ $$  /$$$$$$$| $$  | $$| $$| $$  \ $$| $$  \ $$
| $$      | $$  | $$ /$$__  $$| $$  | $$| $$| $$  | $$| $$  | $$
| $$$$$$$$|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$| $$  | $$|  $$$$$$$
|________/ \______/  \_______/ \_______/|__/|__/  |__/ \____  $$
                                                       /$$  \ $$
                                                      |  $$$$$$/
                                                       \_____*/ 

customElements.define('o-loading', class extends HTMLElement {
  static get observedAttributes() { return ['color', 'type'] }

  //Attributes
  get color() { return getString(this, 'color') }
  set color(value) { setString(this, 'color', value) }
  get type() { return getString(this, 'type') }
  set type(value) { 
    if (attIsString(value))
      this.setAttribute('type', value)
    else
      this.removeAttribute('type') 
  }


  constructor() { super() }

  connectedCallback() {
    //Loading class
    this.classList.add('o-loading')
  }

  attributeChangedCallback(name, oldValue, value) {
    switch(name) {
      //Color
      case 'color':
        this.style.setProperty('--oColor', getOrionColor(value))
        break
    }
  }
})










 /*$   /$$             /$$     /$$
| $$$ | $$            | $$    |__/
| $$$$| $$  /$$$$$$  /$$$$$$   /$$  /$$$$$$$
| $$ $$ $$ /$$__  $$|_  $$_/  | $$ /$$_____/
| $$  $$$$| $$  \ $$  | $$    | $$|  $$$$$$
| $$\  $$$| $$  | $$  | $$ /$$| $$ \____  $$
| $$ \  $$|  $$$$$$/  |  $$$$/| $$ /$$$$$$$/
|__/  \__/ \______/    \___/  |__/|______*/

var oNotiActive = false
var oNotis = []
var oNotisHistory = []

function createNoti(title, content, options) {
  //Default values
  if (typeof title !== 'string') title = 'title'
  if (typeof content !== 'string') content = 'content'
  if (typeof options !== 'object') options = {}

  //Push notification
  oNotis.push({title, content, options})
  oNotisHistory.push({title, content, options})

  //Refresh noti manager
  if (!oNotiActive) oNotiManager()
}

function oNotiManager() {
  if (!oNotiActive) notiManager()

  //Noti manager
  function notiManager() {
    if (oNotis.length > 0) {
      //Notis left -> Show noti
      oNotiActive = true
      notiCreator()
    } else {
      //No notis left -> Stop
      oNotiActive = false
    }
  }

  //Noti creator
  function notiCreator() {
    //Get noti & remove it from list
    let title = oNotis[0].title
    let content = oNotis[0].content
    let options = oNotis[0].options
    oNotis.shift()

    //Default values
    if (typeof title !== 'string') title = 'title'
    if (typeof content !== 'string') content = 'content'
    if (typeof options !== 'object') options = {}

    //Create noti
    let id = "oNoti"+Date.now()
    let html = `<div id="${id}" class="o-box o-noti">
                  <div id="exit-${id}">✕</div>
                  <div>${title}</div>
                  <div>${content}</div>
                </div>`
    document.body.insertAdjacentHTML('beforeend', html)

    //Noti duration
    let duration = 3000
    if (typeof options.duration === 'number') duration = options.duration
    const timeout = setTimeout(closeNoti, duration)

    //Noti listeners
    document.getElementById(id).addEventListener('click', (event) =>  {
      if (typeof options.onClick === 'function') options.onClick()
      closeNoti()
    })
    document.getElementById('exit-'+id).addEventListener('click', (event) => {
      event.stopPropagation()
      closeNoti()
    })

    //Hide function
    function closeNoti() {
      //Clear timeout
      clearTimeout(timeout)

      //Add an event that prevents the others
      document.getElementById(id).addEventListener('click', (event) => { event.stopImmediatePropagation() }, true) 

      //Hide noti animation
      document.getElementById(id).setAttribute('hidden', '')
      setTimeout(() => {
        document.getElementById(id).remove()
        notiManager()
      }, 700)
    }
  }
}





  /*$$$$$  /$$$$$$$$ /$$   /$$       /$$      /$$                              
 /$$__  $$|__  $$__/| $$  / $$      | $$$    /$$$                              
| $$  \__/   | $$   |  $$/ $$/      | $$$$  /$$$$  /$$$$$$  /$$$$$$$  /$$   /$$
| $$         | $$    \  $$$$/       | $$ $$/$$ $$ /$$__  $$| $$__  $$| $$  | $$
| $$         | $$     >$$  $$       | $$  $$$| $$| $$$$$$$$| $$  \ $$| $$  | $$
| $$    $$   | $$    /$$/\  $$      | $$\  $ | $$| $$_____/| $$  | $$| $$  | $$
|  $$$$$$/   | $$   | $$  \ $$      | $$ \/  | $$|  $$$$$$$| $$  | $$|  $$$$$$/
 \______/    |__/   |__/  |__/      |__/     |__/ \_______/|__/  |__/ \_____*/

function createCTXMenu(event, items, title) {
  //Default values
  if (typeof event !== 'object') return ''
  if (!Array.isArray(items)) items = []
  if (typeof title !== 'string') title = 'Menu'

  //Create menu
  let id = "oCTXMenu"+Date.now()
  let html = `<div id="${id}" class="o-ctx-menu">
                <div id="box-${id}" class="o-box" onclick="event.stopPropagation()">
                  <span>${title}</span>
                </div>
              </div>`
  document.body.insertAdjacentHTML('beforeend', html)

  //Add items
  const cmenu = document.getElementById('box-'+id)
  for (i in items) {
    //Item data
    let iid = items[i].id
    if (iid == undefined || typeof iid !== 'string') continue
    else iid = 'oMenu-'+iid
    let label = items[i].label
    if (label == undefined || typeof label !== 'string') continue
    let click = items[i].click
    if (click == undefined || typeof click !== 'function') click = null
    let frontElement = items[i].frontElement
    if (frontElement == undefined || typeof frontElement !== 'string')
      frontElement = `<svg class="button-svg" viewBox="0 0 24 24" style="margin: 0 10px 0 0;">
                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM17 17.25H7C6.59 17.25 6.25 16.91 6.25 16.5C6.25 16.09 6.59 15.75 7 15.75H17C17.41 15.75 17.75 16.09 17.75 16.5C17.75 16.91 17.41 17.25 17 17.25ZM17 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H17C17.41 11.25 17.75 11.59 17.75 12C17.75 12.41 17.41 12.75 17 12.75ZM17 8.25H7C6.59 8.25 6.25 7.91 6.25 7.5C6.25 7.09 6.59 6.75 7 6.75H17C17.41 6.75 17.75 7.09 17.75 7.5C17.75 7.91 17.41 8.25 17 8.25Z"/>
                      </svg>`

    //Create item
    let item = `<div id="${iid}" class="o-ctx-item">
                  ${frontElement}
                  ${label}
                </div>`
    cmenu.insertAdjacentHTML('beforeend', item)

    //Add listener
    if (click != null)
    document.getElementById(iid).addEventListener('click', () => {
      closeCTXMenu(id)
      click()
    })
  }

  //Get mouse position & sizes
  const { clientX: mouseX, clientY: mouseY } = event
  const winW = document.body.clientWidth
  const winH = document.body.clientHeight
  const menuW = cmenu.clientWidth+1
  const menuH = cmenu.clientHeight+1

  //Overflow
  let posX = mouseX
  if (mouseX + menuW > winW) posX = winW-menuW
  let posY = mouseY
  if (mouseY + menuH > winH) posY = winH-menuH

  //Move & show menu
  cmenu.style.left = posX+'px'
  cmenu.style.top = posY+'px'
  cmenu.style.visibility = 'visible'

  //Menu listeners
  document.getElementById(id).addEventListener('click', () => { closeCTXMenu(id) })
  document.getElementById(id).addEventListener('contextmenu', () => { closeCTXMenu(id) })
  return id
}

function closeCTXMenu(id) {
  //Default values
  if (typeof id !== 'string') return

  //Close menu if it exists
  const menu = document.getElementById(id)
  if (menu != null) document.getElementById(id).remove()
}





 /*$$$$$$  /$$           /$$                    
| $$__  $$|__/          | $$                    
| $$  \ $$ /$$  /$$$$$$ | $$  /$$$$$$   /$$$$$$ 
| $$  | $$| $$ |____  $$| $$ /$$__  $$ /$$__  $$
| $$  | $$| $$  /$$$$$$$| $$| $$  \ $$| $$  \ $$
| $$  | $$| $$ /$$__  $$| $$| $$  | $$| $$  | $$
| $$$$$$$/| $$|  $$$$$$$| $$|  $$$$$$/|  $$$$$$$
|_______/ |__/ \_______/|__/ \______/  \____  $$
                                       /$$  \ $$
                                      |  $$$$$$/
                                       \_____*/

function createDialog(content, title, options) {
  //Default values
  if (typeof content !== 'string') return ''
  if (typeof title !== 'string') title = 'Dialog'
  if (typeof options !== 'object') options = {}
  
  //Create dialog
  const id = "oDialog" + Date.now()
  let html = `<div id="${id}" class="o-dialog"> 
                <div id="box-${id}" onclick="event.stopPropagation()">
                  <div class="o-dialogTop">
                    <div id="name-${id}" class="o-dialogTopTitle">${title}</div>
                    <div style="flex-grow: 1;"></div>
                    <div id="exit-${id}" class="o-dialogTopButton o-dialogTopButtonExit">✕</div>
                  </div>
                  <div id="window-${id}" class="o-dialogWindow">${content}</div>
                </div>
              </div>`
  document.body.insertAdjacentHTML('beforeend', html)

  //Show dialog animation
  const dialog = document.getElementById(id)
  const exit = document.getElementById('exit-' + id)
  const box = document.getElementById('box-' + id)
  setTimeout(() => { 
    //Dialog listeners
    if (options.hideClose == true) {
      exit.remove()
    } else {
      //Exit button
      exit.addEventListener('click', close)

      //Close on background click
      let clickedElement = ''
      box.addEventListener('mousedown', (event) => {
        event.stopPropagation()
        clickedElement = ''
      })
      dialog.addEventListener('mousedown', (event) => { clickedElement = 'bg' })
      dialog.addEventListener('mouseup', closeWindow)

      //Dialog close function
      function close() {
        if (typeof options.onClose === 'function') 
          options.onClose()
        else 
          closeDialog(id)
      }

      //Window close function
      function closeWindow(event) {
        //Didn't click background
        if (clickedElement != 'bg') return

        //Not left mouse button
        if (event.button != 0) return 
        
        //Remove listener & close
        dialog.removeEventListener('mouseup', closeWindow)
        close()
      }
    }
  }, 200)

  return id
}

function closeDialog(id) {
  //Check args
  if (typeof id !== 'string') return

  //Check if dialog exists
  const dialog = document.getElementById(id)
  if (dialog == null) return

  //Add an event that prevents the others
  dialog.addEventListener('click', (event) => { event.stopImmediatePropagation() }, true)

  //Hide dialog
  dialog.setAttribute('hidden', '')
  setTimeout(() => {
    dialog.remove()
  }, 200)
}

function renameDialog(id, title) {
  //Check args
  if (typeof id !== 'string') return
  if (typeof title !== 'string') return

  //Rename if dialog exists
  const dialog = document.getElementById('name-' + id)
  if (dialog != null) dialog.innerHTML = title
}

class DialogBuilder {
  static get CUSTOM() { return 0 }
  static get INFO() { return 1 }
  static get ALERT() { return 2 }
  static get CONFIRM() { return 3 }
  static get INPUT() { return 4 }


  constructor() {}

  static build(type, options) {
    //Default values
    if (typeof type !== 'number') type = DialogBuilder.INFO
    if (typeof options !== 'object') options = {}

    //Dialog data
    const id = "oDialog-" + Date.now()
    const dialog = { content: '' }
    let content = options.content

    //Check type
    switch(type) {
      default:
      case DialogBuilder.INFO: {
        //Content
        if (typeof content !== 'string') content = ''

        //HTML
        dialog.content = `<div class="o-dialogContent">
                            ${content}
                          </div>`
        break
      }
      case DialogBuilder.ALERT: {
        //Content
        if (typeof content !== 'string') content = ''

        //HTML
        dialog.confirmId = 'confirm-' + id
        dialog.content = `<div class="o-dialogContent">
                            ${content}
                            <o-button id="${dialog.confirmId}" text="Ok" style="margin: 20px 0 0 auto;"></o-button>
                          </div>`
        break
      }
      case DialogBuilder.CONFIRM: {
        //Content
        if (typeof content !== 'string') content = ''

        //HTML
        dialog.confirmId = 'confirm-' + id
        dialog.cancelId = 'cancel-' + id
        dialog.content = `<div class="o-dialogContent">
                            ${content}
                            <div class="hc" style="margin: 20px 0 0 auto; gap: 10px;">
                              <o-button id="${dialog.confirmId}" text="Confirm"></o-button>
                              <o-button id="${dialog.cancelId}" text="Cancel"></o-button>
                            </div>
                          </div>`
        break
      }
      case DialogBuilder.INPUT: {
        //Content
        let text = options.text
        if (typeof text !== 'string') text = ''
        let hint = options.hint
        if (typeof hint !== 'string') hint = ''

        //HTML
        dialog.inputId = 'input-' + id
        dialog.confirmId = 'confirm-' + id
        dialog.content = `<div class="o-dialogContent">
                            <o-input id="${dialog.inputId}" size="big" value="${text}" hint="${hint}" label style="width: 100%;"></o-input>
                            <o-button id="${dialog.confirmId}" text="Confirm" style="margin: 20px 0 0 auto;"></o-button>
                          </div>`
        break
      }
      case DialogBuilder.CUSTOM: {
        //Content
        if (typeof content !== 'string') content = ''

        //Buttons
        let buttons = options.buttons
        let buttonsHTML = ''
        if (!Array.isArray(buttons)) buttons = []
        buttons.forEach(button => {
          if (typeof button.id !== 'string') button.id = ''
          if (typeof button.text !== 'string') button.text = ''
          if (typeof button.lefticon !== 'string') button.lefticon = ''
          if (typeof button.righticon !== 'string') button.righticon = ''
          buttonsHTML += `<o-button id="${button.id}" text="${button.text}" ${button.lefticon ? `lefticon="${button.lefticon}"` : ''} ${button.righticon ? `righticon="${button.righticon}"` : ''}></o-button>`
        });

        //HTML
        dialog.content = `<div class="o-dialogContent">
                            ${content}
                            <div class="hc" style="margin: 20px 0 0 auto; gap: 10px;">${buttonsHTML}</div>
                          </div>`
        break
      }
    }

    //Return dialog
    return dialog
  }
}










 /*$       /$$             /$$                                                      
| $$      |__/            | $$                                                      
| $$       /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
| $$      | $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
| $$      | $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$ 
| $$      | $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
| $$$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
|________/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |______*/ 

function clickListener(elem, func) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return

  //Add listener
  if (elem != null) elem.onclick = func
}

function doubleClickListener(elem, func) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return

  //Add listener
  if (elem != null) elem.ondblclick = func
}

function longpressListener(elem, func, delay) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return
  if (typeof delay !== 'number') return

  //Timer
  let timer = null

  //Add listener
  if (elem != null) {
    elem.onmouseup = () => { clearTimeout(timer) }
    elem.onmousedown = () => { timer = setTimeout(func, delay) }
  }
}

function contextListener(elem, func) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return

  //Add listener
  if (elem != null) elem.oncontextmenu = func
}

function changeListener(elem, func) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return

  //Add listener
  if (elem != null) elem.onchange = func
}

function inputListener(elem, func) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return

  //Add listener
  if (elem != null) elem.oninput = func
}

function keydownListener(elem, func) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof func !== 'function') return

  //Add listener
  if (elem != null) elem.onkeydown = func
}

function dropListener(elem, over, leave, drop) {
  //Element is an id
  if (typeof elem === 'string') elem = document.getElementById(elem)

  //Missing values
  if (typeof elem !== 'object') return
  if (typeof over !== 'function') return
  if (typeof leave !== 'function') return
  if (typeof drop !== 'function') return

  //Add listener
  if (elem != null) {
    elem.ondragover = (event) => { 
      event.preventDefault()
      event.stopPropagation()
      over()
    }
    elem.ondragleave = (event) => { 
      event.preventDefault()
      event.stopPropagation()
      leave() 
    }
    elem.ondrop = drop
  }
}










  /*$$$$$    /$$     /$$                          
 /$$__  $$  | $$    | $$                          
| $$  \ $$ /$$$$$$  | $$$$$$$   /$$$$$$   /$$$$$$ 
| $$  | $$|_  $$_/  | $$__  $$ /$$__  $$ /$$__  $$
| $$  | $$  | $$    | $$  \ $$| $$$$$$$$| $$  \__/
| $$  | $$  | $$ /$$| $$  | $$| $$_____/| $$      
|  $$$$$$/  |  $$$$/| $$  | $$|  $$$$$$$| $$      
 \______/    \___/  |__/  |__/ \_______/|_*/  

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/* ASCII font: https://patorjk.com/software/taag/#p=display&f=Big%20Money-ne */