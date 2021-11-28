import jwt, {decode} from 'jsonwebtoken';
import User from '../models/user.js';
import { findToken } from '../utils/isTokenBlacklisted.js'; 


export const auth = async (req,res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const isBlacklisted = await findToken(token);
        if(isBlacklisted){
            return res.status(401).json({ msg: 'Please Authenticate' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        return res.status(401).json({ msg: 'Please Authenticate' });
    }
}
