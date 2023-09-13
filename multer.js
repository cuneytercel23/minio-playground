const minio = require("minio");
const { randomUUID } = require("crypto");
const multerMinio = require("multer-minio-storage-engine"); // multer storage'i için.
const multer = require('multer');
const path = require("path");
require('dotenv').config();


var minioClient = new minio.Client({
    endPoint: "localhost", // bunuda dockerda verdiğimiz şeyden vermek zorundayız, default portu 9000
    port:9000,
    useSSL: false,
    accessKey:  process.env.accessKEY, // dockerdan user ve password oluşturarak locale kurdum, o kısımda direkt accessKey ve secretKey var. Ben bucket kurunca gelmedi yani.
    secretKey: process.env.secretKEY,
  });
  
 

storage = multerMinio({
    minio: minioClient,
    bucketName: "cuneyt-bucket",
    metaData: function (req, file, cb) {
      cb(null, { mimetype: file.mimetype, "x-amz-acl": "public-read" });
    },
    objectName: function (req, file, cb) {
      const fileExt = path.extname(file.originalname.toLocaleLowerCase());
      const fileName = randomUUID() + fileExt;
      cb(null, fileName);
    },
  });

  const fileUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const fileExt = path.extname(file.originalname.toLocaleLowerCase());
  
      if (fileExt !== ".jpg" && fileExt !== ".jpeg" && fileExt !== ".png") {
        return cb(new Error("You just can upload this types of files"), false);
      }
  
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("File is not an image"), false);
      }
  
      cb(null, true);
    },
  });


  module.exports = {fileUpload}