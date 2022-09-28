require("dotenv").config();
const express = require("express");
const { Upload } = require("./models/upload");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/uploads")
const app = express();
const multer = require('multer');

// database connection
connection();
app.use(cors());
// middlewares
app.use(express.json());

app.use(express.static('public'));
app.use('/public/img', express.static('images'));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
        // cb(null,"../client/public/img")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})


const fileStorageEngineTwo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/img')
        // cb(null, "../client/public/img")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({
    storage: fileStorageEngine
});

const uploadTwo = multer({
    storage: fileStorageEngineTwo
});

const cpUpload = upload.fields([{ name: 'images', maxCount: 1 }, { name: 'uploadedBy' }])
const cpUploadTwo = uploadTwo.fields([{ name: 'images', maxCount: 1 }, { name: 'uploadedBy' }])

app.post('/api/upload', cpUploadTwo, (req, res, next) => {
    console.log(req.files.images[0].filename);

    var today = new Date();
    var yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    today = dd + '/' + mm + '/' + yyyy;
    var data = new Upload({
        photo: req.files.images[0].filename,
        date: today,
        active: 0,
    });
    data.save();
    res.send('Multiple File uploaded successfully');
});



app.get("/api/get/upload", function (req, res) {
    Upload.find(function (err, fileInfo) {
        if (err) {
            res.send(err);
        } else {
            res.send(fileInfo);
        }
    })
})

app.get("/api/get/displayimage", function (req, res) {
    Upload.findOne({ active: 1 }, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})

app.post("/api/post/displayimage", function (req, res) {

    Upload.findOneAndUpdate({ photo: req.body.path }, { active: 1 }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
        }
    });


})

app.post("/api/post/reset", function (req, res) {
    Upload.findOneAndUpdate({ active: 1 }, { active: 0 }, null, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
        }
    });

})

app.post("/api/post/deletepost", function (req, res) {
    Upload.deleteMany({ photo: req.body.pathDelete })
        .then(function () {
            console.log("File Deleted!");
        })
        .catch(function (err) {
            console.log(error)
        })
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

