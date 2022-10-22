var express = require("express");

/* GET home page. */
const anaSayfa = function (req, res, next) {
  res.render("anasayfa", {
    baslik: "Anasayfa",
    sayfaBaslik: {
      siteAd: "MekanBul",
      slogan: "Civardaki Mekanları Keşfet!",
    },
    mekanlar: [
      {
        ad: "Starbucks",
        puan: 4,
        adres: "Centrum Garden AVM",
        imkanlar: ["Dünya Kahveleri", "Kekler", "Pastalar"],
        mesafe: "10km",
      },
      {
        ad: "Gloria Jeans",
        puan: 3,
        adres: "Sdü Doğu Kampüsü",
        imkanlar: ["Kahve", "Çay", "Pasta"],
        mesafe: "5km",
      },
       
    ],
  });
};

const mekanBilgisi = function (req, res, next) {
  res.render("mekanbilgisi", {
    baslik: "Mekan Bilgisi",
    mekanBaslik: "Starbucks",
    mekanDetay: {
      ad: "Starbucks",
      puan: "4",
      adres: "Centrum Garden AVM",
      saatler: [
        {
          gunler: "Pazartesi-Cuma",
          acilis: "9:00",
          kapanis: "23:00",
          kapali: false,
        },
        {
          gunler: "Cumartesi-Pazar",
          acilis: "8:00",
          kapanis: "22:00",
          kapali: false,
        },
      ],
      imkanlar: ["Dünya Kahveleri", "Kekler", "Pastalar"],
      koordinatlar: {
        enlem: 37.78,
        boylam: 30.56,
      },
      yorumlar: [
        {
          yorumYapan: "Cansu Yıldırım",
          yorumMetni: "Kahveler güzel",
          tarih: "20 Ekim 2022",
          puan: "4",
        },
      ],
    },
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