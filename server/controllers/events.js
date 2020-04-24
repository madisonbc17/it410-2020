const { baseUrl } = require('../env')
const Event = require('../db-models/events')

exports.getEventList = async function(req, res) {
    const events = await Event.find()
    const results = events.map(event => event.toResult(req.query.fieldsets || ['basic']))
    res.send(results)
}

exports.getEvent = async function (req, res) {
    const event = await Event.findById(req.params.eventId)
    if (event) {
        res.send(event.toResult(req.query.fieldsets))
    } else {
        res.sendStatus(404)
    }
}

exports.createEvent = async function (req, res) {
    const existing = await Event.find({
        title: req.body.title
    })

    if (existing.length > 0) {
        res.status(400)
        res.send("An event with that title already exists. Try another!")
    } else {
        const event = new Event(req.body)
    }
    await event.save()

    res.status(200)
    res.set('location', baseUrl + '/api/events/' + event._id)
    res.send(event.toResult(['basic']).basic)
  }