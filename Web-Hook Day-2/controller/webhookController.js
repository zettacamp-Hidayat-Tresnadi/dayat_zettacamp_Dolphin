const fetch = require('node-fetch')
const Song = require('../model/songSchema')
class WebhookController {
    static async updateSong(req, res, next) {
        try {
            const token = req.headers.authorization
            let authenticationCode = token.split(" ")[1]
            const { songId } = req.params
            const { title, duration, genre, artist } = req.body
            let errorMessages =[]
            if(!songId){
                errorMessages.push('Please input songId')
            }
            if(!title){
                errorMessages.push('Please input title')
            }
            if(!duration){
                errorMessages.push('Please input duration')
            }
            if(!genre){
                errorMessages.push('Please input genre')
            }
            if(!artist){
                errorMessages.push('Please input artist')
            }
            if(errorMessages.length>0){
                throw {name:'The data is required',messages:errorMessages}
            }
            const response = await fetch('https://webhook.site/b393bd30-ab25-400c-97fb-ef6c20c4da42', {
                method: 'POST',
                body: JSON.stringify({authorization:authenticationCode,songId, title, duration, genre, artist }),
                headers:{
                    "authorization":authenticationCode
                }
            })
            const inputPlaylists = await response.json()
            if (response.status === 200) {
                await Song.updateOne({ _id: songId }, {
                    title,
                    duration,
                    artist,
                    genre,
                })
            }
            res.status(200).json(inputPlaylists)
        } catch (error) {
            if(error.name==='The data is required'){
                res.status(400).json({messages:error.messages})
            }
            else {
                res.status(400).json({message:error.message})
            }
        }
    }
}
module.exports = { WebhookController }