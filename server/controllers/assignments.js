const { baseUrl } = require('../env')
const Assignment = require('../db-models/assignments')
const AssignmentHelper = require('../helpers/assignments')

exports.getAssignmentList = async function(req, res) {
    const assignments = await Assignment.find()
    const results = assignments.map(assignment => assignment.toResult(req.query.fieldsets || ['basic']))
    res.send(results)
}

exports.getAssignment = async function (req, res) {
    const assignmentInfo = await AssignmentHelper.getAssignmentByQueryTitle(req.params.queryTitle)
    if (assignmentInfo) {
        res.send(assignmentInfo.toResult(req.query.fieldsets))
    } else {
        res.sendStatus(404)
    }
}

exports.createAssignment = async (req, res) => {
    //check to see if user exists and is a teacher
    if(!req.user) return res.sendStatus(403)
    if (!req.user.teacher) return res.sendStatus(403)
    const existing = await Assignment.find({
        title: req.body.title
    })

    if (existing.length > 0) {
        res.status(400)
        res.send("An assignment with that title already exists. Try another!")
    } else {
        const assignment = new Assignment(req.body)
        await assignment.save()
        res.status(200)
        res.set('location', baseUrl + '/api/assignments/' + assignment._id)
        res.send(assignment.toResult(['basic']).basic)
    }
}

exports.updateAssignment = async (req, res) => {
    if(!req.user) return res.sendStatus(403)
    if (!req.user.teacher) return res.sendStatus(403)
    const assignmentInfo = await AssignmentHelper.getAssignmentByQueryTitle(req.params.queryTitle)
    await Assignment.findOneAndUpdate({_id: assignmentInfo.id }, req.body)
    res.send(200)
}

exports.deleteAssignment = async (req, res) => {
    if(!req.user) return res.sendStatus(403)
    if (!req.user.teacher) return res.sendStatus(403)
    const assignmentInfo = await AssignmentHelper.getAssignmentByQueryTitle(req.params.queryTitle)
    await User.findByIdandDelete(assignmentInfo.id)
    res.send(200)
    // const existing = await Assignment.find({
    //     title: req.body.title
    // })
    
    // if (existing.length == 0) {
    //     res.status(400)
    //     res.send("No assignment with that title exists. Try another")
    // } else {
    //     //delete the assignment @existing.name

    // }
}