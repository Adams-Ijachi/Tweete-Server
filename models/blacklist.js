import mongoose from 'mongoose';



// blacklisted tokens
const TokenSchema = new mongoose.Schema({

    token:{
        type: String,
        required: [true, 'Please provide token'],

    },
}, {
    timestamps: true,
});

export default  mongoose.model('BlacklistedToken', TokenSchema);
