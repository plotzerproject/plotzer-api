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
            self: "/api/team/" + id_team + "/members/" + member.id
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

export const teamSuccessReturn = (team) => {
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
            self: "/api/team/" + fixed.id_team + "/fixed/" + fixed.id
        }
    }
    return data
}

export const getTeamMembers = () => { }

//Assignments
export const AssignmentReturn = (assignment) => {
    const data = {
        type: "assignment",
        id: assignment._id,
        attributes: {
            title: assignment.title,
            author: assignment.author,
            description: assignment.description,
            team: assignment.team,
            dateLimit: assignment.dateLimit,
            // userAttachments: assignment.userAttachments,
            assignmentAttachments: assignment.assignmentAttachments,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            users: assignment.users
        },
        links: {
            self: "/api/assignment/" + assignment.id
        }
    }
    return data
}

export const UserAssignmentReturn = (userAssignment) => {
    console.log(userAssignment)
    const index = userAssignment.userIndex
    const data = {
        type: "user-assignment",
        id: userAssignment.id,
        attributes: {
            team: userAssignment.team,
            createdAt: userAssignment.createdAt,
            updatedAt: userAssignment.updatedAt,
            userAttachments: userAssignment.users[index].userAttachments,
            status: userAssignment.users[index].status,
            assignment: {
                id: userAssignment.assignment.id,
                title: userAssignment.assignment.title,
                author: userAssignment.assignment.author,
                description: userAssignment.assignment.description,
                team: userAssignment.assignment.team,
                dateLimit: userAssignment.assignment.dateLimit,
                assignmentAttachments: userAssignment.assignment.assignmentAttachments,
                createdAt: userAssignment.assignment.createdAt,
                updatedAt: userAssignment.assignment.updatedAt,
            }
        },
        links: {
            self: "/api/user/" + userAssignment.users[index].user
        }
    }
    return data
}


//Kanban
export const KanbanReturn = (kanban) => {
    const data = {
        type: "kanban",
        id: kanban._id,
        attributes: {
            title: kanban.title,
            subtitle: kanban.subtitle,
            owner: kanban.owner,
            tag: kanban.tag,
            color: kanban.color,
            isAssignment: kanban.isAssignment || false,
            createdAt: kanban.createdAt,
            updatedAt: kanban.updatedAt,
            topics: kanban.topics.map((topic) => {
                console.log(topic)
                const data = {
                    id: topic.id,
                    author: topic.author,
                    title: topic.title,
                    content: topic.content,
                    color: topic.color,
                    createdAt: topic.createdAt,
                    updatedAt: topic.updatedAt,
                    dateLimit: kanban.isAssignment ? topic.dateLimit : undefined
                }
                return data
            }            ),
        },
        links: {
            self: "/api/kanban/" + kanban.id
        }
    }
    return data
}