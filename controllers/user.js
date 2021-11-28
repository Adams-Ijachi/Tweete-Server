import User from '../models/user.js';
import BlacklistedToken from '../models/blacklist.js';
import validator from 'validator';
import {userResponse} from '../utils/response.js';



export const getUser = async (req,res) =>{
    const user = await User.findOne({_id:req.user.id})
    res.status(200).json({user:userResponse(user)})
}

export const register = async (req,res) => {

    try{
        const {email, password, name } = req.body;
   
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Please enter a valid email' });
        }
        if (validator.isEmpty(name)) {
            return res.status(400).json({ msg: 'Please enter a Name' });
        }
        const emailAlreadyExists = await User.findOne({ email });
        if(emailAlreadyExists){
            return res.status(400).json({ msg: 'Email already exists' });
        }
    
        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    
        }
        const username =  name;
        const user = new User({
            email,
            password,
            username,
        });
        await user.save();
        const token = await user.generateAuthToken();
        res.status(200).json({ msg: 'User registered', user:userResponse(user) , token: token });
    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }

};

export const login = async  (req,res) => {
   
    try{

        const {email, password} = req.body;

           
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Please enter a valid email' });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const token = await user.generateAuthToken();
        res.status(200).json({ msg: 'User Logged In', user:userResponse(user) , token: token });

   }
   catch(err){
        res.status(400).json({ msg: err.message });
    }
       
};

export const logout = async (req,res) => {
    try{

        // add to BlacklistedToken
        const blacklist = new BlacklistedToken({token: req.token});
        await blacklist.save();

        res.status(200).json({ msg: 'User Logged Out'});
    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }

}

