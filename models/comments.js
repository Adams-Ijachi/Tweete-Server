import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({

    comment:{
        type: String,
        required: [true, 'Please provide comment'],
    },

    tweet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: [true, 'Please provide tweet'],
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
}, {
    timestamps: true,
});


export default  mongoose.model('Comment', CommentSchema);
