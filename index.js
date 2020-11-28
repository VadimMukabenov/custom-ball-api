const path = require("path");
// Подключаем модуль
var EasyYandexS3 = require("easy-yandex-s3");

// Инициализация
var s3 = new EasyYandexS3({
    auth: {
        accessKeyId: "",
        secretAccessKey: "",
    },
    Bucket: "my-storage", // например, "my-storage",
    debug: false // Дебаг в консоли, потом можете удалить в релизе
});

async function start(){
    var upload = await s3.Upload({
        path: path.resolve(__dirname, "./photo.png")
    },  "/images/" );
    console.log(upload);
}

start();