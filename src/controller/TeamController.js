import TeamRepository from "../repositories/TeamRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import { errAddMemberTeam, errApplication, errCreateTeam, errDeleteTeam, errGetTeam, errIncorrectData, errInvalidData, errLeaveTeam, errRemoveMemberTeam, errRemoveOwner, errSlugAlreadyExists, errTeamNotFound, errTeamRequestFailed, errUnauthorized, errUpdateTeam, errUpdateUser, errUserAlreadyInvited, errUserDoesntHavePermission, errUserIsAlreadyInTheTeam, errUserIsntPartOfTeam, errUserNotFound } from "../utils/errors.js";
import { getMembersReturn, getTeamFixed, getTeamInfo, getTeamMemberData, teamSuccessReturn } from "../utils/returns.js";
import fs from 'fs'
import multerConfig from '../config/multer.js'
import RequestRepository from "../repositories/RequestRepository.js";

class TeamController {
    async me(req, res, next){
        res.locals.id = res.locals.user.id;
        next();
    }
    async create(req, res, next) { //ok
        let { name, area, description, privacy, slug } = req.body

        //put YUP later

        const user = res.locals.user

        //fazer a validacao dos dados dos membros

        if (!name) name = `${user.name}'s Team`
        const owner = user.id
        const plan = user.plan.id
        let active = false
        if (user.plan.active) active = true

        const random = Math.floor(Math.random() * (15 - 1) + 1);
        const random2 = Math.floor(Math.random() * (15 - 1) + 1);
        if (!slug) slug = `${user.id}-${random2}-${random}`

        const member = {
            id: user.id,
            tag: "Owner",
            userPermissions: 5,
            member_active: true,
            type_invite: "owner",
            reputation: 100
        }

        const members = Array(member)

        try {
            const team = await TeamRepository.create(name, owner, area, description, privacy, plan, active, members, slug)

            const addMemberUser = await UserRepository.addMember(team.id, user.id)

            return res.status(201).json({ data: teamSuccessReturn(team) })
        } catch (error) {
            console.error(error)
            return res.status(errCreateTeam.status).json({ errors: [errCreateTeam] })
        }
    };
    async get(req, res, next) { //ok
        try {
            const teams = await TeamRepository.get()
            if (teams.length == 0) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            return res.status(200).json({ data: teams.map(teamSuccessReturn) })

        } catch (error) {
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    };
    async find(req, res, next) { //ok
        const { id_team } = req.params
        try {
            const team = await TeamRepository.find({ _id: id_team });
            if (team == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })

            return res.status(200).json({ data: teamSuccessReturn(team) })
        } catch (error) {
            console.log(error)
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    };
    async update(req, res, next) {  //ok - eu acho
        const { id } = req.params

        let { name, area, slug, owner, plan, privacy, photo, background, active, stats } = req.body

        try {
            const { files } = req;
            const fileNames = Object.keys(files);
            if (fileNames.length !== 0) {
                if (!photo && files["photo"]) {
                    // files.photo[0].filename = files.photo[0].filename.split(" ").join("%20");
                    photo = `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/uploads/${files.photo[0].filename}`;
                    // await uploadFilesController.UploadImageService(file) //algo pro futuro com cloud
                }
                if (!background && files["background"]) {
                    // files.background[0].filename = files.background[0].filename.split(" ").join("%20");
                    background = `${process.env.SECURITY}${process.env.URL}:${process.env.PORT}/api/uploads/${files.background[0].filename}`;
                }
            }
            const team = res.locals.team;

            if (photo && team.photo) {
                const filename = team.photo.split("http://localhost:4000/api/uploads/")[1]
                fs.unlinkSync(`${multerConfig.directory}/${filename}`);
            }
            if (background && team.background) {
                const filename = team.background.split("http://localhost:4000/api/uploads/")[1]
                fs.unlinkSync(`${multerConfig.directory}/${filename}`);
            }

            const verifySlug = await TeamRepository.find({ slug })
            if (slug && verifySlug.slug == slug && team.id != verifySlug.id) {
                throw new Error("ERR_SLUG_EXISTS");
            }

            const data = { name, area, slug, owner, plan, privacy, photo, background, active, stats }
            const update = await TeamRepository.update(id, data);
            if (update == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })

            return res.status(200).json({ data: teamSuccessReturn(update) })
        } catch (error) {
            console.log(error)
            if (error.message == "ERR_SLUG_EXISTS") {
                return res.status(errSlugAlreadyExists.status).json({ errors: [errSlugAlreadyExists] })
            } else {
                return res.status(errUpdateTeam.status).json({ errors: [errUpdateTeam] })
            }
        }
    };

    async destroy(req, res, next) { //preguiça de testar
        const id = res.locals.id || req.params.id_team
        if (id == null) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {
            const team = await TeamRepository.destroy(id);

            if (team == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            return res.status(200).json({ data: "Equipe deletado com sucesso!" })

        } catch (error) {
            return res.status(errDeleteTeam.status).json({ errors: [errDeleteTeam] })
        }
    };

    async addFixed(req, res, next) { //ok
        const { id_team } = req.params

        const { title, content } = req.body
        if (!title || !content || id_team == null) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {

            const user = res.locals.user

            const team = await TeamRepository.addFixed(id_team, user.id, title, content)
            return res.status(200).json({ data: team })
        } catch (error) {
            if (error.message == "ERR_USER_IS_NOT_PART_OF_TEAM") {
                return res.status(errUnauthorized.status).json({ errors: [errUnauthorized] })
            } else if (error.message == "ERR_MEMBER_DOESNT_HAVE_PERMISSION") {
                return res.status(errUnauthorized.status).json({ errors: [errUnauthorized] })
            } else {
                return res.status(errTeamRequestFailed.status).json({ errors: [errTeamRequestFailed] })
            }
        }
    }

    async getFixed(req, res, next) { //ok
        const { id_team } = req.params
        if (id_team == null) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })

        try {
            const user = res.locals.user

            const fixed = await TeamRepository.getFixed(id_team, user.id)
            return res.status(200).json({ data: fixed.map(getTeamFixed) })
        } catch (error) {
            if (error.message == "ERR_USER_IS_NOT_PART_OF_TEAM") {
                return res.status(errUnauthorized.status).json({ errors: [errUnauthorized] })
            } else {
                return res.status(errTeamRequestFailed.status).json({ errors: [errTeamRequestFailed] })
            }
        }
    }

    async updateFixed(req, res, next) { }

    async destroyFixed(req, res, next) { }

    async getUserStats(req, res, next) { 
        const id = res.locals.id || req.params.id
        const id_team = req.params.id_team

        if(!id || !id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        try {
            const stats = await TeamRepository.getUserStats(id_team, id)
            stats.team = id_team

            return res.status(200).json({data: getTeamMemberData(stats)})
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({errors: [ errApplication]})
        }
    }

    async getTeamStats(req, res, next) {
        const id_team = req.params.id_team

        if(!id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        
        const {user} = res.locals
        try {
            const stats = await TeamRepository.getTeamStats(id_team, user.id)

            return res.status(200).json({data: getTeamInfo(stats)})
        } catch (error) {
            console.log(error)
            return res.status(errApplication.status).json({errors: [ errApplication]})
        }
     }

    async getMembers(req, res, next) { //ok - falta filtros
        const { id_team } = req.params
        // const {limit, filter} = req.query
        if (id_team == null) return res.status(errInvalidData.status).json({ errors: [errInvalidData] })
        try {
            const members = await TeamRepository.getMembers(id_team);
            if (members == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })

            const returnMembers = members.map((member) => {
                return getMembersReturn(member, id_team)
            })

            return res.status(200).json({ data: returnMembers })
        } catch (error) {
            console.log(error)
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    }

    async getMember(req, res, next) { //ok - acho
        const { id_team, id_member } = req.params

        try {
            const member = await TeamRepository.getMember(id_team, id_member)
            if (member === null) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (!member) {
                return res.status(errUserIsntPartOfTeam.status).json({ errors: [errUserIsntPartOfTeam] })
            }
            return res.status(200).json({ data: getMembersReturn(member, id_team) })
        } catch (error) {
            console.log(error)
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    }

    async addMember(req, res, next) { //ok
        const { id: id_team } = res.locals.team
        let { id, tag, userPermissions } = req.body;

        try {
            if(!id) {
                return res.status(errInvalidData.status).json({errors: [errInvalidData]})
            }
            const user = await UserRepository.find({ _id: id })
            if (!user) return res.status(errUserNotFound.status).json({ errors: [errUserNotFound] })

            const verifyUserAlreadyInTeam = await TeamRepository.getMember(id_team, id)
            if (verifyUserAlreadyInTeam === null) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (verifyUserAlreadyInTeam && verifyUserAlreadyInTeam.member_active == true) {
                return res.status(errUserIsAlreadyInTheTeam.status).json({ errors: [errUserIsAlreadyInTheTeam] })
            } else if(verifyUserAlreadyInTeam && verifyUserAlreadyInTeam.member_active == false) {
                return res.status(errUserAlreadyInvited.status).json({ errors: [errUserAlreadyInvited] })
            }

            if (!tag) tag = "Member"
            if (!userPermissions) userPermissions = 0

            const member_data = { //add into teams.members
                id,
                tag,
                userPermissions,
                member_active: false,
                type_invite: "invited",
                reputation: 100
            }

            const team = await TeamRepository.addMember(id_team, member_data)

            const request1 = await RequestRepository.findUserTeam(id_team, id)
            if(request1 != null) {
                request1.user = res.locals.user.id,
                request1.status = "invited",
                request1.active = false
                await request1.save()
            } else {
                const request = await RequestRepository.create(res.locals.user.id, id, "invited", team.id, false)
            }

            console.log("requisitado entrar na equipe")
            return res.status(201).json({ data: teamSuccessReturn(team) })

        } catch (error) {
            console.log(error)
            return res.status(errAddMemberTeam.status).json({ errors: [errAddMemberTeam] })
        }
    };

    async acceptJoinTeam(req, res, next) { //ok
        const {id_team} = req.params
        if(!id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

        const {id} = res.locals.user

        try {
            const verifyUserAlreadyInTeam = await TeamRepository.getMember(id_team, id)
            if (verifyUserAlreadyInTeam === undefined) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (verifyUserAlreadyInTeam.member_active == true) {
                return res.status(errUserIsAlreadyInTheTeam.status).json({ errors: [errUserIsAlreadyInTheTeam] })
            }     
            const addMemberUser = await TeamRepository.updateMember(id_team, id)
            const requestData = {
                active: true
            }

            const request = await RequestRepository.find({receiver: id})

            const updateRequest = await RequestRepository.update(request.id,requestData)

            await UserRepository.addMember(id_team, id)

            return res.status(201).json({data: addMemberUser})

        } catch (error) {
            console.log(error)
            return res.status(errUpdateUser.status).json({errors: [errUpdateUser]})
        }
    }

    async acceptRequestTeam(req, res, next) {
        
        try {
            
        } catch (error) {
            
        }
    }

    async getRequests(req, res, next) {
        // const {team, member, id} = res.local
        const id = res.locals.id || res.params.id_team

        try {
            res.send("teste")
            const request = await RequestRepository.findTeamRequests(id)
            console.log(request)
        } catch (error) {
            return res.status(errApplication.status).json({errors: [ errApplication]})
        }
    }

    async removeMember(req, res, next) {
        const { id_team } = req.params
        const { id } = req.body

        if(!id) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

        const {member} = res.locals

        try {
            const request = await RequestRepository.findUserTeam(id, id_team)
            
            console.log(request)
            
            const verifyUserAlreadyInTeam = await TeamRepository.getMember(id_team, id)

            console.log(verifyUserAlreadyInTeam)

            if (verifyUserAlreadyInTeam === undefined) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (verifyUserAlreadyInTeam.type_invite == "owner") {
                return res.status(errRemoveOwner.status).json({errors: [errRemoveOwner]})
            } else if (verifyUserAlreadyInTeam.userPermissions < member.userPermissions) {
                if(verifyUserAlreadyInTeam.member_active == true) {
                    console.log(verifyUserAlreadyInTeam.userPermissions)
                    const removeUser = await UserRepository.removeMember(id_team, id)
                }
                const removeTeam = await TeamRepository.removeMember(id_team, id)

                const requestData = {
                    user: res.locals.user.id,
                    receiver: id,
                    team: id_team,
                    status: 'removed'
                }

                const requestUpdate = RequestRepository.update(request.id, requestData)

                return res.status(200).json({data: "Removido com sucesso!"})
            }

        } catch (error) {
            console.error(error)
            return res.status(errRemoveMemberTeam.status).json({ errors: [errRemoveMemberTeam] })
        }
    };
    async joinTeam(req, res, next) {
        const { id_team } = req.params
        if(!id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})
        
        try {
            const {id} = res.locals.user
            const user = await UserRepository.find({ _id: id })
            if (!user) return res.status(errUserNotFound.status).json({ errors: [errUserNotFound] })

            const verifyUserAlreadyInTeam = await TeamRepository.getMember(id_team, user.id)
            if (verifyUserAlreadyInTeam === null) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (verifyUserAlreadyInTeam) {
                return res.status(errUserIsAlreadyInTheTeam.status).json({ errors: [errUserIsAlreadyInTheTeam] })
            }

            const member_data = { //add into teams.members
                id: user.id,
                tag: "Member",
                userPermissions: 0,
                member_active: false,
                type_invite: "requested",
                reputation: 100
            }

            // const team_data = { // add into user.teams
            //     id: id_team,
            // }

            const team = await TeamRepository.addMember(id_team, member_data)
            // const addMemberUser = await UserRepository.addMember(id, team_data)
            const request = await RequestRepository.create(id, user.id, "requested", id_team, false)

            return res.status(201).json({ data: "Requisitado" })

        } catch (error) {
            console.log(error)
            return res.status(errAddMemberTeam.status).json({ errors: [errAddMemberTeam] })
        }
    };
    async leaveTeam(req, res, next) { //nao ta feito
        const { id_team } = req.params

        const {user} = res.locals

        try {
            //validar se a pessoa for o owner, dar erro pra apagar pra facilitar, ai como proximas atualizacoes resolver isso
            console.log(user)
            const team = await TeamRepository.removeMember(id_team, user.id)
            const userRemove = await UserRepository.removeMember(id_team, user.id)

            const requestData = {
                user: user.id,
                receiver: user.id,
                team: id_team,
                status: 'leave'
            }

            const request = RequestRepository.findUserTeam(id_team, user.id)

            const requestUpdate = RequestRepository.update(request.id, requestData)

            return res.status(200).json({data: "Removido com sucesso!"})

        } catch (error) {
            console.error(error)
            return res.status(errLeaveTeam.status).json({ errors: [errLeaveTeam] })
        }
    };
}

export default new TeamController()