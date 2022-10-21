import TeamRepository from "../repositories/TeamRepository.js";
import { errActionsLikeSomeoneElse, errInvalidData, errTeamRequestFailed, errUnauthorized, errUserDoesntHavePermission, errUserIsntOnTheTeam, errUserIsntPartOfTeam } from "../utils/errors.js";

const permissions = 4
export const teamPermissions = {
    member: 0,
    extra: 1,
    moderator: 2,
    supervisor: 4,
    owner: 5
}

const verifyUser = async (req, res, next) => {
    //verificar se o user que esta sendo modificado é o mesmo da requisicao
    const user = res.locals.user;
    const {id} = req.params
    
    if(user.applicationPermissions >= permissions) {
        next()
    } else if(id !== authentication.id) {
        return res.status(errActionsLikeSomeoneElse.status).json({errors: [errActionsLikeSomeoneElse]})
    } else {
        next()
    }

}

const verifyPermissions = async (req, res, next) =>{ 
    const user = res.locals.user

    if(user.applicationPermissions >= permissions) {
        next()
    } else {
        return res.status(errUnauthorized.status).json({errors: [errUnauthorized]})
    }
}

const verifyUserOnTeam = async (req, res, next) => {
    const id_team = req.params.id_team || req.body.id_team;

    if(!id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

    const {user} = res.locals

    const team = user.teams.find((t)=>t == id_team)
    
    if(team) {
        next()
    } else if(user.applicationPermissions >= permissions) {
        next()
    } else {
        return res.status(errUnauthorized.status).json({errors: [errUnauthorized]})
    }
}

const verifyUserHasPermissions = async (req, res, next) => {
    const id_team = req.params.id_team || req.body.id_team;

    if(!id_team) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

    const {user, permission, permissionApp} = res.locals

    if(!permission) return res.status(errInvalidData.status).json({errors: [errInvalidData]})

    try {
        const {team, member} = await TeamRepository.verifyUserTeam(id_team, user.id)
        if(member.userPermissions <= permission) {
            if(permissionApp && user.applicationPermissions <= permissions) {
                return res.status(errUnauthorized.status).json({errors: [errUnauthorized]})
            }
        }
        res.locals.id = id_team
        res.locals.team = team
        res.locals.member = member
        next()
    } catch (error) {
        if(error.message == "ERR_USER_IS_NOT_PART_OF_TEAM") {
            return res.status(errUnauthorized.status).json({errors: [errUnauthorized]})
        } else {
            return res.status(errTeamRequestFailed.status).json({errors: [errTeamRequestFailed]})
        }
    }
}

export {verifyUser, verifyPermissions, verifyUserOnTeam, verifyUserHasPermissions}