var mongoose=require("mongoose");
require("./mekansema");
var dbURI = 'mongodb://localhost/mekanbul'; 
mongoose.connect(dbURI);
function kapat(msg, callback){
    mongoose.connection.close(function () {
    console.log(msg);
    callback();
}
);
}
process.on("SIGINT",function() {
    kapat("Uygulama kapatıldı!",function(){
        process.exit(0);
    }    
    );
}
)
mongoose.connection.on("connected", function(){
    console.log(dbURI+" adresteki veritabanına bağlandı");
}
);
mongoose.connection.on("disconnected", function(){
    console.log(dbURI+" adresteki veritabanı bağlantısı koptu");
}
);
mongoose.connection.on("error", function(){
    console.log(dbURI+"Bağlantı hatası");
}
);