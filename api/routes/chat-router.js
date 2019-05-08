const express = require('express');
const axios = require('axios');

const router = express.Router();

const key = process.env.KEY;

router.get('/:chatId', (req, res) => {
    axios.get(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${req.params.chatId}&part=id,snippet,authorDetails&maxResults=200&key=${key}`)
        .then(chat => {
            res.status(200).json(chat);
        })
        .catch(error => {
            res.status(500).json({
                message: "Server could not get chat",
                error
            })
        })
});

module.exports = router;