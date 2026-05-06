import User from '../models/User.js'
import jwt from 'jsonwebtoken';

export let protect = async (req,res,next) => {
    
      

    
    let token = req.headers.authorization?.split(' ')[1];
     
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const userId = decoded.id;
        const user = await User.findById(userId)
        if(!user){
            return res.json({success:false, message:'Not Authorized,User not found'})
            }
            req.user = user;
            next();
       
    } catch (error) {
          
        res.status(401).json({message : 'Not Authorizes,Token Failed '})
    }
}