import { permissions, teamPermissions } from "../middlewares/VerifyUser.js";
import AssignmentRepository from "../repositories/AssignmentRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import UserAssignmentRepository from "../repositories/UserAssignmentRepository.js";
import { errApplication, errAssignmentNotFound, errDeleteAssignment, errGetAssignment, errInvalidData, errUnauthorized, errUpdateAssignment, errUserNotFound } from "../utils/errors.js";
import { AssignmentReturn, TeamAssignmentReturn, UserAssignmentReturn } from "../utils/returns.js";

class AssignmentController {
    async me(req, res, next) { //ok
        res.locals.id = res.locals.user.id;
        next();
      }
    async create(req, res, next) { //ok
        let {title, description, category, id_team, dateLimit, users} = req.body
        const {user} = res.locals

        if(!title || !id_team || !dateLimit || !users) {
            return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        }

        //precisa validar se todos os usuarios dessa lista estão ativos na equipe!

        if(typeof users == 'string') {
            users = [
                {user: users}
            ]
        } else {
            users = users.map((u, i)=>{
                const data = {
                    user: u,
                }
                return data
            })
        }

        const files = req.files
        let fileUrl = []
        if(files) {
            files.forEach((file)=>{
                const fileData = {
                    url: `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/uploads/${file.filename}`,
                    format: file.mimetype,
                    name: file.originalname,
                    size: file.size
                }
                fileUrl.push(fileData)
            })
        }

        try {
            const assignment = await AssignmentRepository.create(title, description, category, id_team, user.id, dateLimit, fileUrl)
            const userAssignment = await UserAssignmentRepository.create(id_team, assignment.id, users)
            
            const userAssignmentId = {
                users: userAssignment.id
            }

            await AssignmentRepository.update(assignment.id, userAssignmentId)

            return res.status(201).json({data: "Criado com sucesso"})
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({errors: [errApplication]})
        }
    }
    async get(req, res, next) { //ok
        try {
            const assignments = await AssignmentRepository.get()
            return res.status(200).json({data: assignments.map(AssignmentReturn)})
        } catch (error) {
            return res.json(error)
        }
    }
    async find(req, res, next) { //ok
        const { id_assignment } = req.params
        if(!id_assignment) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

        const {users} = req.query
        try {
            let assignment = {}
            if(users) {
                assignment = await UserAssignmentRepository.getAssignment(id_assignment, users)
            } else {
                assignment = await AssignmentRepository.find({ _id: id_assignment });
                if (assignment == null) return res.status(errAssignmentNotFound.status).json({ errors: [errAssignmentNotFound] })
                const {user} = res.locals
                const team = user.teams.find((t)=>t.toString() == assignment.team.toString())
                if(team || user.applicationPermissions >= permissions) {
                    return res.status(200).json({ data: AssignmentReturn(assignment) })
                } else {
                    return res.status(errUnauthorized.status).json({errors: [errUnauthorized]})
                }
            }
            
            if (assignment == null) return res.status(errAssignmentNotFound.status).json({ errors: [errAssignmentNotFound] })

            return res.status(200).json({data: TeamAssignmentReturn(assignment)})
        } catch (error) {
            console.log(error)
            return res.status(errGetAssignment.status).json({ errors: [errGetAssignment] })
        }
    }
    async update(req, res, next) { //ok
        try {
            const {assignment, id} = res.locals

            const {dateLimit, assignmentAttachments, category, description, title} = req.body
            const data = {dateLimit, assignmentAttachments, category, description, title}

            const assignmentUpdate = await AssignmentRepository.update(id, data)
            
            return res.status(200).json({data: AssignmentReturn(assignmentUpdate)})
        } catch (error) {
            console.log(error)
            return res.status(errUpdateAssignment.status).json({ errors: [errUpdateAssignment] })
        }
    }

    async destroy(req, res, next) { //ok
        try {
            const id = res.locals.id
            
            const assignmentDestroy = await AssignmentRepository.destroy(id)
            const userAssignmentDestroy = await UserAssignmentRepository.getIndex(assignmentDestroy.id)
            await userAssignmentDestroy.delete()

            return res.status(200).json({ data: "Tarefa deletada com sucesso!" })

        } catch (error) {
            console.log(error)
            return res.status(errDeleteAssignment.status).json({ errors: [errDeleteAssignment] })
        }
    }

    async getUserAssignments(req, res, next) { //ok
        const id = res.locals.id || req.params.id || req.query.id
        
        if(!id) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

        try {
            const assignments = await UserAssignmentRepository.getUserAssignments(id, true)
            if(!assignments) return res.status(errApplication.status).json({errors: [errApplication]})
            else if(assignments.length == 0) return res.status(errAssignmentNotFound.status).json({errors: [errAssignmentNotFound]})

            return res.status(200).json({data: assignments.map(UserAssignmentReturn)})
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({errors: [errApplication]})
        }
    }
    async completeAssignment(req, res, next) { //ok
        // const {id_assignment} = req.params

        try {
            const files = req.files
            let fileUrl = []
            if(files) {
                files.forEach((file)=>{
                    const fileData = {
                        url: `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/uploads/${file.filename}`,
                        format: file.mimetype,
                        name: file.originalname,
                        size: file.size
                    }
                    fileUrl.push(fileData)
                })
            }

            const index = res.locals.index
            const assignment = res.locals.assignment
            const completedAt = new Date()
            const completeUserAssignment = await UserAssignmentRepository.completeAssignment(index, assignment, res.locals.id, fileUrl, completedAt)
            return res.status(200).json({data: UserAssignmentReturn(completeUserAssignment)})
        } catch (error) {
            console.log(error)
            if(error.message == "ERR_ASSIGNMENT_NOT_FOUND") {
                return res.status(errAssignmentNotFound.status).json({errors: [errAssignmentNotFound]})
            }
            return res.status(errApplication.status).json({errors: [errApplication]})
        }
    }

    async getAssignmentUsers(req, res, next) { //ok
        const id = req.params.id
        try {
            const assignment = await AssignmentRepository.getAssignmentUsers(id)
            // if(assignments == null) return res.status(errApplication.status).json({errors: [errApplication]})
            return res.status(200).json({data: AssignmentReturn(assignment)})
        } catch (error) {
            if(error.message == "ERR_USER_NOT_FOUND") {
                return res.status(errUserNotFound.status).json({errors: [errUserNotFound]})
            } else if(error.message == "ERR_ASSIGNMENT_NOT_FOUND") {
                return res.status(errAssignmentNotFound.status).json({errors: [errAssignmentNotFound]})
            }
            return res.status(errGetAssignment.status).json({errors: [errGetAssignment]})
        }
    }

    async getTeamUserAssignments(req, res, next) {
        const {id_team} = req.params
        const id = res.locals.id || req.params.id

        if(!id_team || !id) return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        try {
            const assignments = await UserAssignmentRepository.getTeamUserAssignments(id_team, id)
            return res.status(200).json({data: assignments.map(UserAssignmentReturn)})
        } catch (error) {
            console.log(error)
            return res.status(errGetAssignment.status).json({errors: [errGetAssignment]})
        }
    }

    async getTeamAssignments(req, res, next) {
        const {id_team} = req.params

        if(!id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        try {
            const assignments = await UserAssignmentRepository.getTeamAssignments(id_team)
            return res.status(200).json({data: assignments.map(TeamAssignmentReturn)})
            // return res.status(200).json({data: assignments.map(AssignmentReturn)})
        } catch (error) {
            console.log(error)
            return res.status(errGetAssignment.status).json({errors: [errGetAssignment]})
        }
    }
}

export default new AssignmentController();
