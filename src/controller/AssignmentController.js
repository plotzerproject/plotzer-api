import AssignmentRepository from "../repositories/AssignmentRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import UserAssignmentRepository from "../repositories/UserAssignmentRepository.js";
import { errApplication, errAssignmentNotFound, errGetAssignment, errInvalidData, errUserNotFound } from "../utils/errors.js";
import { AssignmentReturn, UserAssignmentReturn } from "../utils/returns.js";

class AssignmentController {
    async me(req, res, next) { //ok
        res.locals.id = res.locals.user.id;
        next();
      }
    async create(req, res, next) {
        let {title, description, category, id_team, dateLimit, assignmentAttachments, users} = req.body
        const {user} = res.locals

        if(!title || !id_team || !dateLimit || !users) {
            return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        }

        users = users.map((u, i)=>{
            const data = {
                user: u,
            }
            return data
        })

        try {
            const assignment = await AssignmentRepository.create(title, description, category, id_team, user.id, dateLimit, assignmentAttachments)
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
    async get(req, res, next) {
        try {
            const assignments = await AssignmentRepository.get()
            return res.status(200).json({data: assignments.map(AssignmentReturn)})
        } catch (error) {
            return res.json(error)
        }
    }
    async find(req, res, next) {
        res.send("teste")
    }
    async update(req, res, next) {}
    async destroy(req, res, next) {}

    async getUserAssignments(req, res, next) {
        const id = req.params.id || res.locals.id || req.body.id
        
        if(!id) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

        try {
            const assignments = await UserAssignmentRepository.getUserAssignments(id)
            if(!assignments) return res.status(errApplication.status).json({errors: [errApplication]})
            else if(assignments.length <= 0) return res.status(errAssignmentNotFound.status).json({errors: [errAssignmentNotFound]})

            return res.status(200).json({data: assignments.map(UserAssignmentReturn)})
        } catch (error) {
            return res.status(errApplication.status).json({errors: [errApplication]})
        }
    }
    async completeAssignment(req, res, next) {

    }

    async getAssignmentUsers(req, res, next) {
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
}

export default new AssignmentController();
