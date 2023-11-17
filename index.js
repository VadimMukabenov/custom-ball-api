const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

let express = require('express');
let app = express();
app.listen(8000);

let multer = require('multer');
var EasyYandexS3 = require('easy-yandex-s3').default;

let s3 = new EasyYandexS3({
  auth: {
    accessKeyId: 'YCAJEJs5531bVIpMHE4ZhKAF8',
    secretAccessKey: 'YCNKM4foto0Udap5mc4v8ZeYlseXhSdpGz1DMqpV',
  },
  Bucket: 'custom-ball',
  debug: false,
});

app.use(multer().any());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, multipart/form-data'
  );
  next();
});
// app.use(cors());

app.post('/uploadFiles', async (req, res) => {
  const files = req.files;
  const uuid = uuidv4();
  const uploads = [];

  files.forEach((file) => {
    let buffer = file.buffer;
    if (buffer) {
      let upload = s3.Upload(
        { buffer, name: file.originalname },
        `${uuid}/${file.fieldname}`
      );
      uploads.push(upload);
    }
  });

  try {
    await Promise.all(uploads);
    res.json({ status: true });
  } catch (err) {
    console.error(err);
    res.json({ status: false, mes: err });
  }
});
