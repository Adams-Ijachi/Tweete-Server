

export const userOwnsTweet = async (req,res, next)=>{
    try{

        const isUsersTweet = await req.user.hasTweet(req.params.id)
        if(!isUsersTweet){
         return res.status(401).json({ msg: "Unauthorized" });
        }
        next();

    }
    catch(e){
        return res.status(401).json({ msg: e.message });
    }
}