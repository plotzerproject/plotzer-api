import Assignment from "../model/Assignment.js";

class AssignmentRepository{
    async create(title, description, category, team, author, dateLimit, assignmentAttachments) {
        const assignment = await Assignment.create({title, description, category, team, author, dateLimit, assignmentAttachments})
        await assignment.save()
        return assignment
    }
    async get() {
        const assignments = await Assignment.find({})
        return assignments
    }
    async find(id) {
        const assignment = await Assignment.findById(id)
        return assignment
    }
    async update(id, data) {
        const assignment = await Assignment.findByIdAndUpdate(id, data)
        return assignment
    }
    async destroy(id) {
        const assignment = await Assignment.findByIdAndDelete(id)
        return assignment
    }
}

export default new AssignmentRepository()