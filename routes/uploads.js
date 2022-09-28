const router = require("express").Router();
const { Upload } = require("../models/upload");
const formidable = require('formidable');
const { User } = require("../models/user");
const fs = require('fs');


const userData = (req, res) => {
    const form = new formidable.IncomingForm();


    form.parse(req, (err, fields, file) => {
        if (fields) {
            console.log(fields);
            const { uploadedBy, description } = fields;
            if (!uploadedBy || !description) {
                return res.status(400).json({
                    error: "Fill all the fields"
                })
            }

            const user = new Upload(fields)

            if (file) {


                console.log(file);

                user.save((err, user) => {
                    if (err) {
                        return res.status(400).json({
                            error: "Not saved in DB!",
                        })
                    }

                    return res.json(user);
                })
            }
        }
    })
}

router.post("/", userData);

module.exports = router;

