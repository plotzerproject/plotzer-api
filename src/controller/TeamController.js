import TeamRepository from "../repositories/TeamRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import { errAddMemberTeam, errCreateTeam, errDeleteTeam, errGetTeam, errIncorrectData, errLeaveTeam, errRemoveMemberTeam, errTeamNotFound, errUpdatePlan, errUpdateTeam, errUserIsAlreadyInTheTeam, errUserIsntOnTheTeam, errUserNotFound } from "../utils/errors.js";
import { getMembersReturn, teamSuccessReturn, userSuccessReturn } from "../utils/returns.js";

class TeamController {
    async create(req, res, next) {
        let { name, area, description, privacy, photo, slug } = req.body

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
        if(!slug) slug=`${user.id}-${random2}-${random}`

        const member = {
            id: user.id,
            tag: "Owner",
            userPermissions: 6,
            member_active: true,
            type_invite: "owner",
            reputation: 100
        }

        const members = Array(member)

        try {
            const team = await TeamRepository.create(name, owner, area, description, privacy, plan, active, members, slug, photo)

    
            const addMemberUser = await UserRepository.addMember(user.id, team.id)

            return res.status(201).json({ data: teamSuccessReturn(team) })
        } catch (error) {
            console.error(error)
            return res.status(errCreateTeam.status).json({ errors: [errCreateTeam] })
        }
    };
    async get(req, res, next) {
        try {
            const teams = await TeamRepository.get()
            if (teams.length == 0) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            return res.status(200).json({ data: teams.map(teamSuccessReturn) })

        } catch (error) {
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    };
    async find(req, res, next) {
        const { id } = req.params
        try {
            const team = await TeamRepository.find(id);
            if (team == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })

            return res.status(200).json({ data: teamSuccessReturn(team) })
        } catch (error) {
            console.log(error)
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    };
    async update(req, res, next) {
        const { id } = req.params
        const { name, owner, plan, photo, active, members, cnpj, description, privacy } = req.body
        const data = { name, owner, plan, photo, active, members, cnpj, description, privacy }

        if(cnpj) {
            const cnpjValid = cnpjValidator.isValid(cnpj)
            if(!cnpjValid) return res.status(errIncorrectData.status).json({ errors: [errIncorrectData] })
        }

        try {
            const team = await TeamRepository.update(id, data);
            if (team == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })

            return res.status(200).json({ data: teamSuccessReturn(team) })
        } catch (error) {
            return res.status(errUpdateTeam.status).json({ errors: [errUpdateTeam] })
        }
    };
    async destroy(req, res, next) {
        const { id } = req.params

        try {
            const team = await TeamRepository.destroy(id);

            if (team == null) return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            return res.status(200).json({ data: "Usuário deletado com sucesso!" })

        } catch (error) {
            return res.status(errDeleteTeam.status).json({ errors: [errDeleteTeam] })
        }
    };

    async getMembers(req, res, next) {
        const { id_team } = req.params
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

    async getMember(req, res, next) {
        const { id_team, id_member } = req.params

        try {
            const member = await TeamRepository.getMember(id_team, id_member)
            if (member === null) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (!member) {
                return res.status(errUserIsntOnTheTeam.status).json({ errors: [errUserIsntOnTheTeam] })
            }

            return res.status(200).json({ data: getMembersReturn(member, id_team) })
        } catch (error) {
            console.log(error)
            return res.status(errGetTeam.status).json({ errors: [errGetTeam] })
        }
    }

    async addMember(req, res, next) {
        const { id_team } = req.params
        let { id, tag, userPermissions } = req.body;

        try {
            const user = await UserRepository.find(id)
            if (!user) return res.status(errUserNotFound.status).json({ errors: [errUserNotFound] })

            const verifyUserAlreadyInTeam = await TeamRepository.getMember(id_team, id)
            if (verifyUserAlreadyInTeam === null) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (verifyUserAlreadyInTeam) {
                return res.status(errUserIsAlreadyInTheTeam.status).json({ errors: [errUserIsAlreadyInTheTeam] })
            }

            if (!tag) tag = "Funcionário"
            if (!userPermissions) userPermissions = 1

            const member_data = { //add into teams.members
                id,
                tag,
                userPermissions,
                member_active: false,
                type_invite: "invited",
                reputation: 100
            }

            const team_data = { // add into user.teams
                id: id_team,

            }

            const team = await TeamRepository.addMember(id_team, member_data)
            const addMemberUser = await UserRepository.addMember(id, team_data)

            console.log(addMemberUser)

            return res.status(201).json({ data: teamSuccessReturn(team) })

        } catch (error) {
            return res.status(errAddMemberTeam.status).json({ errors: [errAddMemberTeam] })
        }
    };

    async removeMember(req, res, next) {
        const { id_team } = req.params
        const {id} = req.body

        try {
            const user = await UserRepository.removeMember(id, id_team)
            
            return res.status(200).json({data: userSuccessReturn(user)})
        } catch (error) {
            console.error(error)
            return res.status(errRemoveMemberTeam.status).json({ errors: [errRemoveMemberTeam] })
        }
    };
    async joinTeam(req, res, next) {
        const { id_team } = req.params
        const user = res.locals.user 

        try {
            const user = await UserRepository.find(id)
            if (!user) return res.status(errUserNotFound.status).json({ errors: [errUserNotFound] })

            const verifyUserAlreadyInTeam = await TeamRepository.getMember(id_team, id)
            if (verifyUserAlreadyInTeam === null) {
                return res.status(errTeamNotFound.status).json({ errors: [errTeamNotFound] })
            } else if (verifyUserAlreadyInTeam) {
                return res.status(errUserIsAlreadyInTheTeam.status).json({ errors: [errUserIsAlreadyInTheTeam] })
            }

            const member_data = { //add into teams.members
                id: user.id,
                tag: "Funcionário",
                userPermissions: 1,
                member_active: false,
                type_invite: "requested",
                reputation: 100
            }

            const team_data = { // add into user.teams
                id: id_team,

            }

            const team = await TeamRepository.addMember(id_team, member_data)
            const addMemberUser = await UserRepository.addMember(id, team_data)

            return res.status(201).json({ data: teamSuccessReturn(team) })

        } catch (error) {
            return res.status(errAddMemberTeam.status).json({ errors: [errAddMemberTeam] })
        }
    };
    async leaveTeam(req, res, next) {
        const { id_team } = req.params
        const {id} = req.body

        try {
            const user = await UserRepository.removeMember(id, id_team)

            return res.status(200).json({data: userSuccessReturn(user)})
        } catch (error) {
            console.error(error)
            return res.status(errLeaveTeam.status).json({ errors: [errLeaveTeam] })
        }
    };
}

export default new TeamController()