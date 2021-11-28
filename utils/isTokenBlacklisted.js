import BlacklistedToken from '../models/blacklist.js';


export const findToken = async (token) =>{
    const isInBlacklist = await BlacklistedToken.findOne({token:token});
    return isInBlacklist;
    
}