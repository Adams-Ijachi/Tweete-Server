import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import tweetRoutes from './routes/tweets.js';
import authRoutes from './routes/user.js';
// import dotenv
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));


app.use('/api/v1/tweet', tweetRoutes);
app.use('/api/v1/auth', authRoutes);



const connection_url = process.env.CONNECTION_URL

const port = process.env.PORT || 5000;
console.log(port);

mongoose.connect(connection_url).then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    }
    );
})
.catch(err => {
    console.log(err);
}
);
