import UserAssignmentRepository from "../repositories/UserAssignmentRepository.js";
import KanbanRepository from "../repositories/KanbanRepository.js"
import TeamRepository from "../repositories/TeamRepository.js"
import { errApplication, errDeleteKanban, errFunctionNotDone, errGetKanban, errInvalidData, errKanbanNotFound, errTeamNotFound, errUnauthorized, errUpdateKanban } from "../utils/errors.js"
import { KanbanReturn } from "../utils/returns.js"

class KanbanController {
    async me(req, res, next) { //ok
        res.locals.id = res.locals.user.id;
        next();
    }
    async create(req, res, next) {
        let { title, subtitle, topics, tag, color, team } = req.body
        if (!title) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {
            let owner = res.locals.user.id
            if (team) {
                const verifyTeam = await TeamRepository.verifyUserTeam(team, owner)
                if (!verifyTeam) team = undefined
            }
            if (!topics) {
                const verifyKanban = KanbanRepository.verifyUserHasKanban(owner)
                if (verifyKanban) {
                    topics = {
                        author: owner,
                        content: "Click here to edit your kanban board",
                        title: "Welcome to Plotzer",
                        color: "#CBD5E0"
                    }
                } else {
                    topics = [
                        {
                            author: owner,
                            content: "Here is your kanban board",
                            title: "Welcome to Plotzer",
                            color: "#CBD5E0"
                        },
                        {
                            author: owner,
                            content: "Here you can take notes and organize your to-do items.",
                            color: "#FED7D7"
                        },
                    ]
                }
            }
            const kanban = await KanbanRepository.create(owner, title, subtitle, topics, tag, color)
            return res.status(201).json({ data: KanbanReturn(kanban) })
        } catch (error) {
            if (error.message == 'ERR_USER_IS_NOT_PART_OF_TEAM') {
                return res.status(errUnauthorized.status).json({ errors: [errUnauthorized] })
            } else if (error.message == "ERR_TEAM_DOES_NOT_EXIST") {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            }
            return res.status(errApplication.status).json({ errors: [errApplication] })
        }
    };
    async get(req, res, next) {
        try {
            const kanban = await KanbanRepository.get()
            if (kanban.length == 0) return res.status(errKanbanNotFound.status).json({ errors: [errKanbanNotFound] })
            return res.status(200).json({ data: kanban.map(KanbanReturn) })
        } catch (error) {
            return res.status(errGetKanban.status).json({ errors: [errGetKanban] })
        }
    };
    async find(req, res, next) {
        const { id } = req.params
        if (!id) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })
        try {
            const kanban = await KanbanRepository.find(id);
            if (kanban == null) return res.status(errKanbanNotFound.status).json({ errors: [errKanbanNotFound] })

            const user = res.locals.user
            if (kanban.owner == user.id) {
                return res.status(200).json({ data: KanbanReturn(kanban) })
            } else {
                return res.status(errUnauthorized.status).json({ errors: [errUnauthorized] })
            }
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({ errors: [errApplication] })
        }
    };
    async update(req, res, next) {
        const { id } = req.params
        if (!id) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })
        let {title, subtitle, tag, color} = req.body
        const data = {title, subtitle, tag, color}
        
        try {
            const kanban = await KanbanRepository.update(id, data);
            if (kanban == null) return res.status(errKanbanNotFound.status).json({ errors: [errKanbanNotFound] })

            return res.status(200).json({ data: KanbanReturn(kanban) })
        } catch (error) {
            console.log(error)
            return res.status(errUpdateKanban.status).json({ errors: [errUpdateKanban] })
        }
    };
    async destroy(req, res, next) {
        const { id } = req.params
        if (!id) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {
            const kanban = await KanbanRepository.destroy(id);

            if (kanban == null) return res.status(errKanbanNotFound.status).json({ errors: [errKanbanNotFound] })
            return res.status(200).json({ data: "Painel deletado com sucesso!" })

        } catch (error) {
            return res.status(errDeleteKanban.status).json({ errors: [errDeleteKanban] })
        }
    };

    async updateTopic(req, res, next) {
        const {id, idTopic} = req.params
        if (!id || !idTopic) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        const {title, content, color} = req.body
        const data = {title, content, color}
        try {
            const kanban = await KanbanRepository.updateTopic(id, idTopic, data)
            if (kanban == null) return res.status(errKanbanNotFound.status).json({ errors: [errKanbanNotFound] })

            return res.status(200).json({data: KanbanReturn(kanban)})
        } catch (error) {
            return res.status(errApplication.status).json({errors: [errApplication]})
        }
    }

    async deleteTopic(req, res, next) {
        const {id, idTopic} = req.params
        if (!id || !idTopic) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {
            const kanban = await KanbanRepository.deleteTopic(id, idTopic)
            if (kanban == null) return res.status(errKanbanNotFound.status).json({ errors: [errKanbanNotFound] })

            return res.status(200).json({data: "Deletado com sucesso"})
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({errors: [errApplication]})
        }
    }


    async getUserBoards(req, res, next) {
        const id = res.locals.id || req.params.id || req.query.id

        if (!id) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {
            const kanban = await KanbanRepository.getUserBoards(id)
            let assignments = await UserAssignmentRepository.getUserAssignments(id)
            // assignments = assignments.filter((assignment) => assignment.users.find((user) => {
            //     return user.status == "received";
            // }))
            assignments = assignments.map((assignment) => {
                return (
                {
                    id: assignment.assignment.id,
                    author: assignment.assignment.author,
                    title: assignment.assignment.title,
                    content: assignment.assignment.description,
                    createdAt: assignment.assignment.createdAt,
                    updatedAt: assignment.assignment.updatedAt,
                    dateLimit: assignment.assignment.dateLimit,
                    isAssignment: true
                })})
            const date = new Date()
            kanban.push({
                owner: id,
                title: "User to-do",
                createdAt: date,
                updatedAt: date,
                isAssignment: true,
                topics: assignments
            })
            return res.status(200).json({data: kanban.map(KanbanReturn)})
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({ errors: [errApplication] })
        }
    }
}

export default new KanbanController()