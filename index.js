const bodyParser = require("body-parser");
const express = require("express");
const { fileUpload } = require("./multer");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//minio fotoğraf ekleme.
app.post("/upload", fileUpload.single("foto"), (req, res, next) => {
  const objectName = req.file.objectName; // minio storage'ına baktığında objectName diye bir parametre girip orada filename dönüyorum. o yüzden objectName diye çekmem gerekiyor farklı isim de verebilirim.
  // objectName = 4b992abd-0f7c-43be-ad21-9174d7c6e68f.png

  res.send(objectName); // Burada originalname sendledim ama
});

//minio foto çekme
app.get("/upload", (req, res, next) => {
  const path = // şimdi yukarıda upload ettiğim zaman aşağıdaki formatta (url+bucketname+objectname) olarak db'ye kaydedip öyle çekerim. burada db ile uğraşmadım diye direkt pathi verdim.
    "http://localhost:9000/cuneyt-bucket/640355f9-0919-46e1-b773-df99b2354cb2.png";

  res.send(path);
});

app.listen(3000, () => {
  console.log("Ayaktayız yıkılmadık");
});
