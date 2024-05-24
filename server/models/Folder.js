import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
    email:{type: String, required:true},
    folderName: {type: String , required: true},
    imageName : {type: String , required: true},
    imageCaption :{type:String,required:true},
    imageCloud : {type:{
        versionName:{type:String},
        generatedName:{type:String}},
        default:{}},
},
{collection:'Folder'});

const Folder = mongoose.model('Folder',FolderSchema);

export default Folder;