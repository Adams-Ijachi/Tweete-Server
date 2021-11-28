import mongoose from 'mongoose';

const TweetSchema = new mongoose.Schema({

    tweet : {
        type: String,
        required: [true, 'Please provide tweet'],
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },

    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
}, {timestamps: true,});

TweetSchema.pre('remove',async function(){
    // if tweet has comments
    if(this.comments.length > 0){
        await this.model('Comment').deleteMany({ tweet: this._id });
    }
})


export default  mongoose.model('Tweet', TweetSchema);