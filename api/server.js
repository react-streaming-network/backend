const express = require('express');

const applyMiddleware = require('./middleware.js');
const channelRouter = require('./routes/channel-router.js');
const authenticationRouter = require('./routes/authentication-router.js');
const chatRouter = require('./routes/chat-router.js');

const server = express();

applyMiddleware(server);
server.use('/api/channels', channelRouter);
server.use('/api/auth', authenticationRouter);
server.use('/api/chat', chatRouter);

module.exports = server;