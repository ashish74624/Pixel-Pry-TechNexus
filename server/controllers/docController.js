import Doc from '../models/Doc.js'
import Folder from '../models/Folder.js'
import User from '../models/user.js'
// Start with functions now

export const addFolder = async(req, res) => {
    if (!req.body.folderName) {
        return res.status(400).json({ msg: 'Please add a Folder Name' });
    }
    const folderName = req.body.folderName;
    try {
        const user = await User.findOne({ email: req.params.email });
        const doc = await Doc.findOne({ email: req.params.email });

        if (!doc) {
            const newDoc = new Doc({
                email: req.params.email,
                folders: [{ folderName: folderName }]
            });
            await newDoc.save();
            return res.status(201).json({ msg: 'Folder Created' });
        } else {
            const folderExists = doc.folders.some(folder => folder.folderName === folderName);
            if (folderExists) {
                return res.status(400).json({ msg: 'Folder Name already exists' });
            }
            doc.folders.push({ folderName: folderName });
            await doc.save();
            return res.status(201).json({ msg: 'Folder Created' });
        }
    } catch (e) {
        return res.status(500).json({ msg: 'Unable to create folder at the moment' });
    }
};


export const deleteFolder=async(req,res)=>{
    try{
        const doc1 = await Doc.findOne({email:req.body.email});
        if (!doc1) {
            res.status(404).json({msg:'User Not Found'});
        }
        const doc = await Doc.findOneAndUpdate({email:req.body.email},{
            $pull :{
                folders:{_id:req.body.id}
            }
        })   
        const folder = await Folder.deleteMany({folderName:req.body.folderName})
        res.status(200).json({msg:'Deleted Successfully'})
    }catch{
        res.status(500).json({msg:'Bad Request'})
    }
}

export const renameFolder = async (req, res) => {
    const { email } = req.params;
    const { newFolderName, oldFolderName } = req.body;

    try {
        // Step 1: Update the folder name in the Doc model
        const doc = await Doc.findOne({ email });

        if (!doc) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        const folderExists = doc.folders.some(folder => folder.folderName === newFolderName);
        if (folderExists) {
            return res.status(400).json({ msg: 'Folder Name already exists' });
        }

        const folderToUpdate = doc.folders.find(folder => folder.folderName === oldFolderName);
        if (!folderToUpdate) {
            return res.status(404).json({ msg: 'Old Folder Name not found' });
        }

        folderToUpdate.folderName = newFolderName;
        await doc.save();

        // Step 2: Update the folder name in the Folder model
        const updatedFolders = await Folder.updateMany(
            { email, folderName: oldFolderName },
            { $set: { folderName: newFolderName } }
        );

        if (updatedFolders.nModified === 0) {
            return res.status(404).json({ msg: 'No images found with the old folder name' });
        }

        return res.json({ msg: 'Folder name updated successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
};



// app.put('/folders/:email/:oldFolderName', async (req, res) => {
  
// });

export default {addFolder,deleteFolder,renameFolder};