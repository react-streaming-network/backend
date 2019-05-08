const express = require('express');
const axios = require('axios');

const db = require('../../db/helpers/streamersDb');
const authMiddleware = require('../../custom_middleware/authMiddleware')

const router = express.Router();

router.use(express.json());

const key = process.env.KEY;

let streamers = [];
let channels = [];

async function populateChannelInfo(streamerInfo){

  streamers = await db.get().then(streamers => streamers).catch(error => console.log(error))

    async function getChannelStatus(streamerInfo){
      try {
          const updatedStreamerPromises = streamers.map(async streamer => {
            const response = await axios({
              url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${streamer.youtube}&type=video&eventType=live&key=${key}`,
              method: 'GET'
            })
          if(response){
            console.log('status:', 'sent api call', `(${streamer.channelName})`)
            if(response.data.items.length > 0){
              return{
                ...streamer,
                status: {
                  live: response.data.items.length > 0,
                  videoId: response.data.items[0].id.videoId,
                  ...response.data.items[0].snippet,
                }
              }
            }
            return {
              ...streamer,
              status: {
                live: response.data.items.length > 0,
              } 
            }
          }else{
            res.status(404).json("streamer not found")
          }
        })
        const results = await Promise.all(updatedStreamerPromises)
        
        channelsWithStatus = results
      } catch (error) {
        console.log(`\n*** API Call to youtube failed ***\n`)
      }
    }
    
    async function getLiveStatus(){
      try {
          const updatedStreamerPromises = channelsWithStatus.map(async streamer => {
            if(streamer.status.live){
              const response = await axios({
                url: `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${streamer.status.videoId}&key=${key}`,
                method: 'GET'
              })
              console.log('live info:', 'sent api call', `(${streamer.channelName})`)
              return {
                ...streamer,
                status:{
                  ...streamer.status,
                liveStatus: response.data.items[0].liveStreamingDetails,
              }
            }
          }
          return {
            ...streamer,
            // Last Livestream data here
          }
        })
        const results = await Promise.all(updatedStreamerPromises)
        channelsWithLive = results
      } catch (error) {
        console.log(`\n*** API Call to youtube failed ***\n`)
      }
    }
    
    async function getThumbnail(){
      try {
          const updatedStreamerPromises = channelsWithLive.map(async streamer => {
            const response = await axios({
              url:`https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails&id=${streamer.youtube}&key=${key}`
            })
            console.log('thumbnail:', 'sent api call', `(${streamer.channelName})`)
            return {
              channelThumbnails: response.data.items[0].snippet.thumbnails,
              ...streamer
          }
        })
        const results = await Promise.all(updatedStreamerPromises)
        channels = results
      } catch (error) {
        console.log(`\n*** API Call to youtube failed ***\n`)
      }
    }

    await getChannelStatus();
    await getLiveStatus();
    await getThumbnail();
}

const startDataFetch = async() => {
  await populateChannelInfo(streamers);
    console.log('loaded streamers');
}

startDataFetch();

setInterval( async() => { 
    await populateChannelInfo(streamers);
    console.log('loaded streamers');
}, 60000)

router.get('/', (req, res) => {
    res.send(channels);
});

router.get('/:id', (req, res) => {
  const channel = channels.find(f => f.id == req.params.id);

  if (channel) {
    res.status(200).json(channel);
  } else {
    res.status(404).send({ msg: 'Channel not found' });
  }
});

router.put('/:id', authMiddleware.restricted, authMiddleware.checkIfAdmin, (req, res) => {
  try {
    db.update(req.params.id, req.body)
      .then(count => {
        if(count){
          res.status(200).json({
            message: `Streamer with id ${req.params.id} was updated`
          })
          populateChannelInfo(streamers);
        }else{
          res.status(404).json({
            message: `Could not find streamer with id ${req.params.id}`
          })
        }
      })
      .catch(error => {
        res.status(400).json({
          message: "Bad request, please provide required fields to update",
          error
        })
      })
  } catch (error) {
    res.status(500).json({
      message:"Server could not update streamer",
      error
    })
  }
});

router.post('/', authMiddleware.restricted, authMiddleware.checkIfAdmin, (req, res) => {
  try {
    db.insert(req.body)
      .then(streamer => {
        res.status(201).json({
          message:"Streamer was added to the database"
        });
        populateChannelInfo(streamers);
      })
      .catch(error => {
        res.status(400).json({
          message: "Bad request, You must provide the required fields",
          error
        })
      })
  } catch (error) {
    res.status(500).json({
      message: "Server could not add the streamer to the database",
      error
    })
  }
  
});

router.delete('/:id', authMiddleware.restricted, authMiddleware.checkIfAdmin, (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if(count){
        res.status(204).end();
        populateChannelInfo(streamers);
      }else{
        res.status(404).json({
          message: "Streamer with given ID could not be found"
        })
      }
    })
    .catch(error => {
      res.status(500).json({
          message:"Server could not remove streamer",
          error  
      })
    })
});

module.exports = router;