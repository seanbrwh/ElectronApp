const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

let MainWindow;
let addWindow;


app.on('ready', ()=>{
  MainWindow = new BrowserWindow({})

  MainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainwindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  MainWindow.on('closed',()=>{
    app.quit()
  })
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)

})

function createAddWindow(){
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add Shopping List Item'
  })

  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))
  addWindow.on('close',()=>{
    addWindow = null;
  })
}

ipcMain.on('item:add', (e, item)=>{
  console.log(item)
  MainWindow.webContents.send('item:add', item)
  addWindow.close;

})

const mainMenuTemplate = [
  {
    label : 'File',
    submenu:[
      {
        label: 'Add Item',
        click(){
          createAddWindow()
        }
      },
      {
        label: 'Clear Items',
        click(){
          MainWindow.webContents.send('item:clear')
        }
      },
      {
        label:'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  }
]

if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({})
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Dev tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools()
        }
      },
      {
        role:'reload'
      }
    ]
  })
}