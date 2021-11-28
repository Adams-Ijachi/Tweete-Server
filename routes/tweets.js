import express from 'express';

import { getAllTweets,deleteTweet ,createTweet,updateTweet,addComment ,tweetAction} from '../controllers/tweets.js';
import { auth } from './../middleware/auth.js';
import {userOwnsTweet} from './../middleware/userOwnsTweet.js'


const router = express.Router();

router.get('/', getAllTweets);
router.post('/create-tweet',auth, createTweet);
router.post('/:tweetId/comment', auth, addComment);
router.post('/:tweetId/action', auth, tweetAction);
router
    .route('/:id')
    .put([auth,userOwnsTweet], updateTweet)
    .delete([auth,userOwnsTweet], deleteTweet);

export default router;