import UserAssignment from "../model/UserAssignment.js";

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
    async getIndex(id) {
        console.log(id)
        try {
            const assignment = await UserAssignment.findOne({assignment: id})
            if(assignment == null) throw new Error("ERR_ASSIGNMENT_NOT_FOUND")

            return assignment
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getUserAssignments(id) {
        try {
            let assignments = await UserAssignment.find({ 'users.user': id }).populate("assignment")
            assignments.forEach((assignment)=>{
                let index = assignment?.users.findIndex((user) => {
                    return user.user.toString() === id;
                });
                // if (index < 0) throw new Error("ERR_USER_NOT_FOUND")
                if (index >= 0) assignment.userIndex = index
            })
            return assignments

        } catch (error) {
            throw new Error(error.message)
        }
    }

    async verifyUserHasAssignment(id_assignment, id_user) {
        try {
            const assignment = await UserAssignment.findById(id_assignment)
            if (!assignment) throw new Error("ERR_ASSIGNMENT_NOT_FOUND");
            let index = assignment?.users.findIndex((user) => {
                return user.user.toString() === id_user;
            });
            if (index < 0) throw new Error("ERR_USER_NOT_FOUND")
            return {index, assignment};
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // async completeAssignment(id_assignment, id_user, filesUrl) {
    async completeAssignment(index, assignment, id_user, filesUrl) {
        try {
            // const {index, assignment} = await this.verifyUserHasAssignment(id_assignment, id_user)
            console.log(assignment)
            assignment.users[index].status = "sent"
            assignment.users[index].userAttachments = [...assignment.users[index].userAttachments, ...filesUrl]
            await assignment.save()
            assignment.userIndex = index

            const assignmentPopulate = assignment.populate("assignment")
            return assignmentPopulate
        } catch (error) {
            throw new Error(error.message)
        }
    } 
}

export default new UserAssignmentRepository()