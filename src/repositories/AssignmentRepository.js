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
        return assignment
    }
    async update(id, data) {
        try {
            const assignment = await Assignment.findByIdAndUpdate(id, data)
            return assignment
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async destroy(id) {
        try {
            const assignment = await Assignment.findByIdAndDelete(id)
            return assignment
        } catch (error) {
            throw new Error(error.message)
        }
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
    // async getTeamAssignments(id_team, id_user) {
    //     //repensar nesse
    //     //talvez seja bom eu buscar pelo UserAssignment e de la verificar a equipe, acho que seria melhor!!
    //     try {
    //         const assignments = await Assignment.find({team: id_team}).populate("users")
    //         if(assignments == null) throw new Error("ERR_ASSIGNMENT_NOT_FOUND")
    //         return assignments
    //     } catch (error) {
    //         throw new Error(error.message)
    //     }
    // }

    async completeAssignment(id_assignment) {
        try {
            // const a = UserAssignmentRepository.
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new AssignmentRepository()