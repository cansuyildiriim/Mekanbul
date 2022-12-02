var express = require("express");
const axios = require("axios");

var apiSecenekleri = {
  // sunucu: "http://localhost:3000",
  sunucu:  "https://mekanbul.beyzagursoy.repl.co",
  apiYolu: "/api/mekanlar/",
};

var mesafeyiFormatla = (mesafe) => {
  var yeniMesafe, birim;
  if (mesafe > 1) {
    yeniMesafe = parseFloat(mesafe).toFixed(1);
    birim = " km";
  } else {
    yeniMesafe = parseInt(mesafe * 1000, 10);
    birim = " m";
  }
  return yeniMesafe + birim;
};

var anaSayfaOlustur = (res, mekanListesi) => {
  var mesaj;
  if (!(mekanListesi instanceof Array)) {
    mesaj = "API HATASI: Bir şeyler ters gitti.";
    mekanListesi = [];
  } else {
    if (!mekanListesi.length) {
      mesaj = "Civarda herhangi bir mekan yok";
    }
  }
  res.render("anasayfa", {
    baslik: "Anasayfa",
    sayfaBaslik: {
      siteAd: "MekanBul",
      slogan: "Civardaki Mekanları Keşfet!",
    },
    mekanlar: mekanListesi,
    mesaj: mesaj,
  });
};

var detaySayfasiOlustur = (res, mekanDetaylari) => {
  mekanDetaylari.koordinat = {
    enlem: mekanDetaylari.koordinat[0],
    boylam: mekanDetaylari.koordinat[1],
  };
  res.render("mekanbilgisi", {
    mekanBaslik: mekanDetaylari.ad,
    mekanDetay: mekanDetaylari,
  });
};

var hataGoster = (res, hata) => {
  var mesaj;
  if (hata.response.status == 404) {
    mesaj = "404, Sayfa Bulunamadı!";
  } else {
    mesaj = hata.response.status + " hatası";
  }
  res.status(hata.response.status);
  res.render("error", {
    mesaj: mesaj,
  });
};

/* GET home page. */
const anaSayfa = function (req, res) {
  const requestUrl = apiSecenekleri.sunucu + apiSecenekleri.apiYolu;
  axios
    .get(requestUrl, {
      params: {
        enlem: req.query.enlem,
        boylam: req.query.boylam,
      },
    })
    .then((response) => {
      var i, mekanlar;
      mekanlar = response.data;
      for (i = 0; i < mekanlar.length; i++) {
        mekanlar[i].mesafe = mesafeyiFormatla(mekanlar[i].mesafe);
      }
      anaSayfaOlustur(res, mekanlar);
    })
    .catch((hata) => {
      anaSayfaOlustur(res, hata);
    });
};

const mekanBilgisi = function (req, res, next) {
  axios
    .get(apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid)
    .then((response) => {
      detaySayfasiOlustur(res, response.data);
    })
    .catch((hata) => {
      hataGoster(res, hata);
    });
};

const yorumEkle = function (req, res, next) {
  res.render("yorumekle", { title: "Yorum Ekle" });
};

module.exports = {
  anaSayfa,
  mekanBilgisi,
  yorumEkle,
};
