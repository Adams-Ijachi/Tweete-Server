import Tweet from "../models/tweets.js";
import Comment from "../models/comments.js"
import mongoose from 'mongoose';


export const getTweets = (req, res) => {
    res.send('Hello world');
};


export const createTweet = async (req, res) =>{

    try{

        const {tweet} = req.body
        

        const newTweet = new Tweet({
            tweet
        });
        newTweet.user = req.user.id;
        await newTweet.save();
        // populate the user
        await newTweet.populate('user', 'username _id email');
        res.status(200).json({
            message: 'Tweet created',
            tweet: newTweet
        });

       

    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }
}

export const updateTweet = async (req, res) =>{
    try{

        const { id } = req.params;

        const { tweet } = req.body;
        console.log(tweet, 'tweet')
        const existingTweet = await Tweet.findByIdAndUpdate(id, {tweet}, {new: true}).populate('user', 'username _id email').populate('comments', 'comment tweet _id');
        console.log(existingTweet, 'existingTweet')
        res.status(200).json({msg: 'Tweet updated', tweet: existingTweet});
    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }
}

export const deleteTweet = async (req, res) =>{
    try{

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Tweet with id: ${id}`);
        const tweet = await Tweet.findOne({_id:id});
        if(!tweet){
            res.status(404).json({msg:"Tweet Not Found"})
        }

        await tweet.remove()
        res.status(200).json({msg: 'Tweet deleted'});
    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }
}

export const getAllTweets = async (req,res) =>{
    try{

        const tweets = await Tweet.find({}).populate('user', 'username _id email').populate('comments', 'comment tweet _id').sort({createdAt: -1});
        // order by date


        res.status(200).json({msg:"tweets found", tweets});
    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }
}

export const addComment = async (req,res) =>{
    try{
        const { tweetId } = req.params;
        const tweet = await Tweet.find({_id:tweetId});
        if(!tweet){
            res.status(404).json({msg:"Tweet Not Found"})
        }
        const { comment } = req.body;
        const newComment = new Comment({
            comment
        });
        newComment.user = req.user.id;
        newComment.tweet = tweetId;
        await newComment.save();
        const tweetWithComment = await Tweet.findByIdAndUpdate(tweetId, {$push:{comments:newComment._id}}, {new:true})
        .populate('user', 'username _id email')
        .populate('comments','comment tweet _id');
        res.status(200).json({msg:"Comment added", tweet:tweetWithComment});

    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }
}

export const tweetAction = async (req,res) =>{

    try{
        const { tweetId } = req.params;
        const tweet = await Tweet.findOne({_id:tweetId}).populate('user', 'username _id email').populate('comments', 'comment tweet _id');
        if(!tweet){
            res.status(404).json({msg:"Tweet Not Found"})
        }
        
        if(tweet.likes.includes(req.user.id)){
            const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {$pull:{likes:req.user.id}}, {new:true}).populate('user', 'username _id email').populate('comments', 'comment tweet _id')

           return  res.status(200).json(updatedTweet);
            
        }


        const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {$push:{likes:req.user.id}}, {new:true}).populate('user', 'username _id email').populate('comments', 'comment tweet _id');

        res.status(200).json(updatedTweet);
    }
    catch(err){
        res.status(400).json({ msg: err.message });
    }

}


    


