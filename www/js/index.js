let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {

    },

    pageLoaded:function(){
        let init = new pinkCalf.placeInit(".app");
        init.init();
    }
};
app.initialize();
app.pageLoaded();