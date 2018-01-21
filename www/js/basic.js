class App{
  constructor(){}
  initialize(){
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  }
  onDeviceReady(){}
  pageLoaded(){
    let init = new pinkCalf.placeInit(".app");
    init.init();
  }
}
let app = new App();
app.initialize();
app.pageLoaded();
