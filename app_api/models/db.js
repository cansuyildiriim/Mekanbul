var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/mekanbul';
//var dbURI = "mongodb+srv://cansuyildirim:1234@mekanbul.rhpaw4c.mongodb.net/mekanbul?retryWrites=true&w=majority";
require("./mekansema");

function kapat(msg,callback){
    mongoose.connection.close(function(){
        console.log(msg);
        callback();
    });
}

process.on("SIGINT",function(){
    kapat("Uygulama kapatıldı!",function(){
        process.exit(0);
    })
})


mongoose.connect(dbURI);
mongoose.connection.on(
    'connected', function(){
        console.log(dbURI + " adresindeki veritabanına bağlanıldı!\n");
    });
    
mongoose.connection.on(
    'error', function(){
        console.log(dbURI + "Bağlantı hatası!\n");
    });
    
mongoose.connection.on(
    'disconnected', function(){
        console.log(dbURI + "Bağlantı koptu!\n");
    });
    
