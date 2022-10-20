//plan

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
            self: "/api/plan/" + plan.id
        }
    }
    return data
}

//user

export const getMembersReturn = (member, id_team) => {
    const data = {
        type: "team members",
        id: member.id,
        attributes: {
            name: member.name,
            email: member.email,
            tag: member.tag,
            userPermissions: member.userPermissions,
            reputation: member.reputation,
            member_active: member.member_active,
            type_invite: member.type_invite
        },
        links: {
            self: "/api/team/"+id_team+"/members/" + member.id
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
            background: user.background,
            teams: `GET /api/user/get/${user.id}/teams`,
            applicationPermissions: user.applicationPermissions
        },
        links: {
            self: "/api/user/" + user.id
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
                purchaseDate: user.plan?.purchaseDate, //getdate dps!!
                active: user.plan?.active ? user.plan?.active : true
            },
            photo: user.photo,
            background: user.background,
            teams: `GET /api/user/get/${user.id}/teams`,
            applicationPermissions: user.applicationPermissions
        },
        links: {
            self: "/api/user/" + user.id
        },
        tokens: {
            token: tokens.token,
            refresh_token: tokens.refresh_token
        }
    }
    return data
}

//team

export const teamSuccessReturn = (team)=> {
    const data = {
        type: "team",
        id: team.id,
        attributes: {
            name: team.name,
            owner: team.owner,
            plan: team.plan,
            photo: team.photo,
            background: team.background,
            members: `GET /api/team/${team.id}/members`,
            active: team.active,
            stats: `${team.stats}%`,
            fixed: `GET /api/team/${team.id}/fixed`,
            slug: team.slug
        },
        links: {
            self: "/api/team/" + team.id
        }
    }
    return data
}

export const getTeamFixed = (fixed) => {
    const data = {
        type: "team-fixed",
        id: fixed.id,
        attributes: {
            author: fixed.author,
            title: fixed.title,
            content: fixed.content,
            createdAt: fixed.createdAt,
            updatedAt: fixed.updatedAt,
        },
        links: {
            self: "/api/team/" + fixed.id_team + "/fixed/"+fixed.id
        }
    }
    return data
}

export const getTeamMembers = () => {}

//Assignments
export const AssignmentReturn = (assignment) => {
    console.log(assignment)
    const data = {
        type: "assignment",
        id: assignment.id,
        attributes: {
            title: assignment.title,
            author: assignment.author,
            description: assignment.description,
            team: assignment.team,
            dateLimit: assignment.dateLimit,
            userAttachments: assignment.userAttachments,
            assignmentAttachments: assignment.assignmentAttachments,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            users: assignment.users
        },
        links: {
            self: "/api/assignment/" + assignment.id_team
        }
    }
    return data
}