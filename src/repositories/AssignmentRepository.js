import Assignment from "../model/Assignment.js";
// import UserAssignmentRepository from "./UserAssignmentRepository.js";

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
    async find(req) {
        const assignment = await Assignment.findOne(req)
        console.log(assignment)
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
    async getAssignmentUsers(id){
        try {
            const assignments = await Assignment.findById(id).populate("users")
            if(assignments == undefined) throw new Error("ERR_ASSIGNMENT_NOT_FOUND")
            if(assignments == null) throw new Error("ERR_USER_NOT_FOUND")
            // if(assignments == null) throw new Error("ERR_USER_NOT_FOUND")
            return assignments
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getTeamAssignments(team) {
        try {
            
        } catch (error) {
            
        }
    }

    async completeAssignment(id_assignment) {
        try {
            // const a = UserAssignmentRepository.
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new AssignmentRepository()