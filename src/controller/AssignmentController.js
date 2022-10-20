import AssignmentRepository from "../repositories/AssignmentRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import UserAssignmentRepository from "../repositories/UserAssignmentRepository.js";
import { errApplication, errInvalidData } from "../utils/errors.js";
import { AssignmentReturn } from "../utils/returns.js";

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
        try {
            const a = await UserAssignmentRepository.getUserAssignments(res.locals.id)
            res.send(a)
        } catch (error) {
            console.log(error)
        }
    }
    async completeAssignment(req, res, next) {

    }
}

export default new AssignmentController();
