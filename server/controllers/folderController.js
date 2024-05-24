import Doc from '../models/Doc.js'
import Folder from '../models/Folder.js'
import cloudinary from '../config/cloudinaryConfig.js';
import multer from 'multer'
// Start writing functions

export const getFolders = async(req,res)=>{
    // console.log(req.params.email)
    try{
        const doc = await Doc.find({email:req.params.email});
        // console.log(doc[0].folders)
        const array = doc[0].folders
        const arr = array.reverse();
        res.status(200).json({folderList: arr})
    }catch{
        res.status(404).json({msg:'File Not Found'});
    }
}

export const getFolderData = async(req,res)=>{
    const folderName = req.params.folderName
    const email = req.params.email
    // console.log(folderName)
    try {
        const folder = await Folder.find({folderName:folderName,email:email});
        // console.log(folder);
        res.status(200).json(folder);
    } catch (error) {
        res.status(404).json({msg:'File Data Not Found'});        
    }
}

export const getImage = async(req,res)=>{
    console.log(req.params.email)
    try{
        const folders = await Folder.find({folderName:req.params.folderName,email:req.params.email});
        if(!folders){
             res.status(404).json({msg:'Folder Not Found'});
        }
        const imageName = await Folder.findOne(
            {$and:
                [
                    {email:req.params.email},
                    {folderName: req.params.folderName},
                    {imageName:req.params.image}
                ]
            }
        ); // $and operator
        if(!imageName){
            res.status(404).json({msg:'Image Not Found'});
        }
        const version = imageName.imageCloud.versionName;
        const generatedName = imageName.imageCloud.generatedName;
        res.redirect(`https://res.cloudinary.com/deirqjd6e/image/upload/v${version}/${generatedName}`)
    }catch(err){
        res.status(500).json({msg:'Error Fetching Image'});
    }
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadImage = async(req,res)=>{
    console.log(typeof req.body.text);
    console.log(req.params.email);
    try {
        // console.log(req.body.image)
        const imageName = await Folder.find({$and:[{folderName:req.body.folderName},{imageName:req.body.imageName},{email:req.params.email}]});
        // The problem is that even if there's no matching document in the database, the Folder.find() method will return an empty array ([]), so we need to add imageName.length >0
        if(imageName.length>0){
            res.status(409).json({msg:"Image Name Already exists"});
        }
        else{
                const result = await cloudinary.uploader.upload(req.body.image);
                const folderData = new Folder({
                email:req.params.email,
                folderName: req.body.folderName,
                imageName: req.body.imageName,
                imageCaption:req.body.text,
                imageCloud:{
                    versionName:result.version,
                    generatedName:result.public_id,
                }
            });
            await folderData.save();
            res.status(200).json({msg:"Done"});
        }
    } catch (error) {
        // console.log(error)
        res.status(500).json({msg:error});
    }
}

export const deleteImage = async(req,res)=>{
    let id=req.params.id;
    try {
        const image = await Folder.findOneAndDelete({_id:id},{new:true});
        if (!image) {
            // Image not found in the database
            return res.status(404).json({ msg: 'Image not found' });
          }
      
          // Successful deletion
          res.status(200).json({ msg: 'Image deleted successfully' });
    } catch (error) {
        console.log("Failder to delet picture");
        res.status(500).json({ error: 'Failed to delete picture' });
    }
}

export const renameImage = async(req,res)=>{
    // const { email, folderName, currentImageName, newImageName } = req.body;
    const id = req.body.id;
    const folderName= req.body.folderName;
    const newImageName = req.body.newImageName;
    const email = req.body.email;

    if (!id || !folderName  || !newImageName) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        // Find the folder that matches the email and folderName

        const existingImageSearch = await Folder.findOne({email:email,folderName:folderName,imageName:newImageName});
        
        if(existingImageSearch){
            return res.status(400).json({ msg: 'Image name already exists' });
        }

        const folder = await Folder.findById({_id:id});
        if (!folder) {
            return res.status(404).json({ msg: 'Folder not found' });
        }
        
        console.log(folder)

        // Check if the new image name already exists in the folder
        if (folder.imageName === newImageName) {
            return res.status(400).json({ msg: 'The new image name already exists' });
        }

        // Update the image name
        folder.imageName = newImageName;
        await folder.save();

        return res.status(200).json({ msg: 'Image name updated successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error });
    }
}

export default { getFolders,getFolderData,uploadImage,deleteImage,getImage,renameImage }