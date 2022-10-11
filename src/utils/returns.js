export const planSuccessReturn = (plan) => {
    const data = {
        type: "plan",
        id: plan.id,
        attributes: {
            name: plan.name,
            description: plan.description,
            price: plan.price,
            permissions: plan.permissions,
        },
        links: {
            self: "/api/v1/plan/" + plan.id
        }
    }
    return data
}

export const getMembersReturn = (member, id_team) => {
    const data = {
        type: "team members",
        id: member.id,
        attributes: {
            id: member.id,
            name: member.name,
            email: member.email,
            tag: member.tag,
            userPermissions: member.userPermissions,
            reputation: member.reputation,
            member_active: member.member_active,
            type_invite: member.type_invite
        },
        links: {
            self: "/api/v1/team/"+id_team+"/members/" + member.id
        }
    }
    return data
}

export const teamSuccessReturn = (team)=> {
    const data = {
        type: "team",
        id: team.id,
        attributes: {
            name: team.name,
            owner: team.owner,
            cnpj: team.cnpj,
            plan: team.plan,
            photo: team.photo,
            members: team.members?.map((user)=>(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    tag: user.tag ? user.tag : "Membro",
                    userPermissions: user.userPermissions,
                    reputation: user.reputation ? user.reputation : 100,
                    member_active: user.member_active,
                    type_invite: user.type_invite
                }
            )),
            active: team.active,
        },
        links: {
            self: "/api/v1/team/" + team.id
        }
    }
    return data
}

export const userSuccessReturn = (user) => {
    const data = {
        type: "user",
        id: user.id,
        attributes: {
            name: user.name,
            email: user.email,
            plan: {
                id: user.plan?.id,
                purchaseDate: user.plan?.purchaseDate, //getdate dps!!
                active: user.plan?.active ? user.plan?.active : true
            },
            photo: user.photo,
            teams: user.teams?.map((team)=>(
                {
                    id: team.id,
                    name: team.name,
                    owner: team.owner,
                    userPermissions: team.userPermissions,
                    tag: team.tag ? team.tag : "Membro"
                }
            )),
            applicationPermissions: user.applicationPermissions
        },
        links: {
            self: "/api/v1/user/" + user.id
        }
    }
    return data
}

export const userSuccessReturnToken = (user, tokens) => {
    const data = {
        type: "user",
        id: user.id,
        attributes: {
            name: user.name,
            email: user.email,
            plan: {
                id: user.plan?.id,
                purchaseDate: user.plan?.purchaseDate,
                active: user.plan?.active
            },
            photo: user.photo,
            teams: user.teams?.map((team)=>(
                {
                    id: team.id,
                    name: team.name,
                    owner: team.owner,
                    userPermissions: team.userPermissions,
                    tag: team.tag
                }
            )),
            applicationPermissions: user.applicationPermissions
        },
        links: {
            self: "/api/v1/user/" + user.id
        },
        tokens: {
            token: tokens.token,
            refresh_token: tokens.refresh_token
        }
    }
    return data
}