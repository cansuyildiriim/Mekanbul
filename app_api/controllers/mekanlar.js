var mongoose = require("mongoose");
var Mekan = mongoose.model("mekan");

const cevapOlustur = (res, status, content) => {
  res.status(status).json(content);
};

var cevrimler = (() => {
  var dunyaYariCap = 6371; 
  var radyan2Kilometre = (radyan) => {
    return parseFloat(radyan * dunyaYariCap);
  };
  var kilometre2Radyan = (mesafe) => {
    return parseFloat(mesafe / dunyaYariCap);
  };
  return {
    radyan2Kilometre: radyan2Kilometre,
    kilometre2Radyan: kilometre2Radyan,
  };
})();

const mekanlariListele = async (req, res) => {
  var boylam = parseFloat(req.query.boylam);
  var enlem = parseFloat(req.query.enlem);

  var koordinat = {
    type: "Point",
    coordinates: [enlem, boylam],
  };

  var geoOptions = {
    distanceField: "mesafe",
    spherical: true,
  };

  if (!enlem || !boylam) {
    cevapOlustur(res, 404, { hata: "enlem ve boylam zorunlu parametreler" });
    return;
  }

  try {
    const sonuc = await Mekan.aggregate([
      {
        $geoNear: {
          near: koordinat,
          ...geoOptions,
        },
      },
    ]);

    const mekanlar = sonuc.map((mekan) => {
      return {
        mesafe: cevrimler.kilometre2Radyan(mekan.mesafe),
        ad: mekan.ad,
        adres: mekan.adres,
        puan: mekan.puan,
        imkanlar: mekan.imkanlar,
        _id: mekan._id,
      };
    });
    cevapOlustur(res, 200, mekanlar);
  } catch (e) {
    cevapOlustur(res, 404, e);
  }
};

const mekanEkle = (req, res) => {
  Mekan.create(
    {
      ad: req.body.ad,
      adres: req.body.adres,
      imkanlar: req.body.imkanlar.split(","),
      koordinat: [parseFloat(req.body.enlem), parseFloat(req.body.boylam)],
      saatler: [
        {
          gunler: req.body.gunler1,
          acilis: req.body.acilis1,
          kapanis: req.body.kapanis1,
          kapali: req.body.kapali1,
        },
        {
          gunler: req.body.gunler2,
          acilis: req.body.acilis2,
          kapanis: req.body.kapanis2,
          kapali: req.body.kapali2,
        },
      ],
    },
    (hata, mekan) => {
      if (hata) {
        cevapOlustur(res, 400, hata);
      } else {
        cevapOlustur(res, 201, mekan);
      }
    }
  );
};

const mekanGetir = (req, res) => {
  if (req.params && req.params.mekanid) {
    Mekan.findById(req.params.mekanid).exec((hata, mekan) => {
      if (!mekan) {
        cevapOlustur(res, 404, { hata: "Böyle bir mekan yok!" });
      } else if (hata) {
        cevapOlustur(res, 404, { hata: hata });
      } else {
        cevapOlustur(res, 200, mekan);
      }
    });
  } else {
    cevapOlustur(res, 404, { hata: "İstekte mekanid yok!" });
  }
};

const mekanGuncelle = (req, res) => {
  if (!req.params.mekanid) {
    cevapOlustur(res, 404, { mesaj: "Bulunamadı, mekanid gerekli" });
    return;
  } 
  Mekan.findById(req.params.mekanid)
    .select("-yorumlar -puan")
    .exec((hata, gelenMekan) => {
      if (!gelenMekan) {
        cevapOlustur(res, 404, { mesaj: "mekanid bulunamadı" });
        return;
      } else if (hata) {
        cevapOlustur(res, 404, hata);
        return;
      }
      gelenMekan.ad = req.body.ad;
      gelenMekan.adres = req.body.adres;
      gelenMekan.imkanlar = req.body.imkanlar.split(",");
      gelenMekan.koordinat = [
        parseFloat(req.body.enlem),
        parseFloat(req.body.boylam),
      ];
      gelenMekan.saatler = [
        {
          gunler: req.body.gunler1,
          acilis: req.body.acilis1,
          kapanis: req.body.kapanis1,
          kapali: req.body.kapali1,
        },
        {
          gunler: req.body.gunler2,
          acilis: req.body.acilis2,
          kapanis: req.body.kapanis2,
          kapali: req.body.kapali2,
        },
      ];
      gelenMekan.save((hata, mekan) => {
        if (hata) {
          cevapOlustur(res, 404, hata);
        } else {
          cevapOlustur(res, 200, mekan);
        }
      });
    });
};

const mekanSil = (req, res) => {
  var mekanid = req.params.mekanid;
  if (mekanid) {
    Mekan.findByIdAndRemove(mekanid).exec((hata, gelenMekan) => {
      if (hata) {
        cevapOlustur(res, 404, hata);
        return;
      }
      cevapOlustur(res, 200, {
        durum: "Mekan Silindi!",
        "Silinen Mekan": gelenMekan.ad,
      });
    });
  } else {
    cevapOlustur(res, 404, {
      mesaj: "mekanid bulunamadı",
    });
  }
};

module.exports = {
  mekanEkle,
  mekanGetir,
  mekanGuncelle,
  mekanSil,
  mekanlariListele,
};