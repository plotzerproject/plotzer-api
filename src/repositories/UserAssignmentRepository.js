import UserAssignment from "../model/UserAssignment.js";
import UserRepository from "./UserRepository.js";

class UserAssignmentRepository{
    async create(team, assignment, users) {
        const assignments = await UserAssignment.create({team, assignment, users})
        await assignments.save()
        return assignments
    }
    async get() {
        const assignments = await UserAssignment.find({}).populate("users")
        return assignments
    }
    async find(id) {
        const assignment = await UserAssignment.findById(id)
        return assignment
    }
    async update(id, data) {
        const assignment = await UserAssignment.findByIdAndUpdate(id, data)
        return assignment
    }
    async destroy(id) {
        const assignment = await UserAssignment.findByIdAndDelete(id)
        return assignment
    }
    async getUserAssignments(id) {
        try {
            const assignments = await UserAssignment.find({ 'users.user': id }).populate("assignment")
            return assignments

        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new UserAssignmentRepository()