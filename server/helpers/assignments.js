const Assignment = require('../db-models/assignments')

exports.getAssignmentList = () => {
    return Assignment.find()
}

exports.getAssignmentById = async (assignmentId) => {
    return Assignment.findById(assignmentId)
}

exports.getAssignmentByQueryTitle = async (queryTitle) => {
    return Assignment.findOne({queryTitle})
}

exports.createAssignment = async (assignment) => {
    const existing = await Assignment.find({
        title: assignment.title
    })
    if (existing.length > 0) {
        return false
    } else {
        const newAssignment = new Assignment(assignment)
        await newAssignment.save()
        return newAssignment
    }
}

exports.updateAssignment = async (assignment) => {
    return Assignment.findOneAndUpdate(assignment.id, assignment)
}

exports.deleteAssignment = async (assignmentId) => {
    return Assignment.findByIdAndDelete(assignmentId)
}

