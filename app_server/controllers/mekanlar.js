var express = require('express');
var router = express.Router();

const anaSayfa=function(req,res){
    res.render('anasayfa',{ "title":"Anasayfa"});
}


const yorumSayfasi=function(req, res) {
    res.render('yorumekle', {"title":"Yorum Sayfası"});
};

const mekanBilgisi=function(req, res) {
    const generateAddress = {
        "Starbucks": " İyaş Market Girişi",
        "Arabica" : "İyaş Avm Girişi",
        "İyaş": "Otogar Karşısı"
    }
    console.log( generateAddress[req.params.title])
    res.render('mekanbilgisi', {title:req.params.title, address: generateAddress[req.params.title]});
};

const yorumEkle=function(req, res, next) {
    res.render('yorumekle', {"title":"Yorum ekle"});
};

module.exports={
    anaSayfa,
    mekanBilgisi,
    yorumEkle,
    yorumSayfasi
    
}

