import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const register = async(req,res)=>{
    const newPasssword = await bcrypt.hash(req.body.password,10)
    try {
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser){
            // 409 Conflict.
            res.status(409).json({msg:'User already exists'});
        }
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email:req.body.email,
            password:newPasssword
        })
        await user.save()
        res.status(201).json({msg:'Registration complete'})
    } catch (error) {
        // 400 -bad request
        res.status(400).json({msg:'User not registered'})
    }
}

export const login = async(req,res)=>{
    try {

        let user = await User.findOne({email : req.body.email})
        const isPasswordValid = await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordValid){
            // 401 Unauthorized
            return res.status(401).json({msg:'Invalid Password'})
        }
        if(user){
            const token = jwt.sign({
                _id:user._id,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email},process.env.JWT_SECRET,
                // {expiresIn:"3h"}
            );

            return res.status(200).json({msg:'User found',user:token});
        }else{
            return res.status(404).json({msg:'User not found'});
        }
    } catch (error) {
        res.status(400).json({msg:'Bad request'})
    }
}

export const verifyToken= async(req,res)=>{
    const token = req.headers['x-access-token'];
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded){
            res.status(200).json({msg:'User Authenticated'});
        }else{
            res.status(401).json({msg:'Invalid user'})
        }

    }catch{
        res.status(401).json({msg:'Unable to verify at the moment'});
    }
}

export default { register , login , verifyToken }