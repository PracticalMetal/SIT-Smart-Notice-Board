const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
	// uploadedBy: { type: String, required: true },
	photo: { type:String,contentType:String },
	// description: {type: String,required: true},
	date: { type: String},
	active:{type:Number}
	
});

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = { Upload };