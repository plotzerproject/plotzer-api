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
        // links: {
        //     self: "/api/plan/" + plan.id
        // }
    }
    return data
}

//user

export const getMembersReturn = (members, team) => {
    const data = {
        type: "team members",
        id: team.id,
        attributes: {
            name: team.name,
            owner: team.owner,
            plan: team.plan,
            photo: team.photo,
            background: team.background,
            members: members.map((member) => {
                const data = {
                    id: member.id.id,
                    name: member.id.name,
                    email: member.id.email,
                    photo: member.id.photo,
                    tag: member.tag,
                    userPermissions: member.userPermissions,
                    reputation: member.reputation,
                    member_active: member.member_active,
                    type_invite: member.type_invite,
                }
                return data
            }),
            active: team.active,
            stats: `${team.stats}%`,
            fixed: team.fixed,
            slug: team.slug
        },
        // links: {
        //     self: "/api/team/" + team.id
        //     // self: "/api/team/" + team.id + "/members/" + member.id
        // }
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
            applicationPermissions: user.applicationPermissions,
            description: user.description,
            about: user.about
        },
        // links: {
        //     self: "/api/user/" + user.id
        // }
    }
    return data
}

export const userSuccessReturnTeams = (user) => {
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
            teams: user.teams,
            applicationPermissions: user.applicationPermissions,
            description: user.description,
            about: user.about
        },
        // links: {
        //     self: "/api/user/" + user.id
        // }
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
            applicationPermissions: user.applicationPermissions,
            description: user.description,
            about: user.about
        },
        // links: {
        //     self: "/api/user/" + user.id
        // },
        tokens: {
            token: tokens.token,
            refresh_token: tokens.refresh_token
        }
    }
    return data
}

//team

export const teamSuccessReturn = (team, fixed) => {
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
            fixed: team.fixed,
            slug: team.slug
        },
        // links: {
        //     self: "/api/team/" + team.id
        // }
    }
    return data
}

export const teamSuccessReturnFixed = (team, member) => {
    const data = {
        type: "team",
        id: team.id,
        attributes: {
            name: team.name,
            owner: team.owner,
            plan: team.plan,
            photo: team.photo,
            background: team.background,
            members: member ? team.members.map((member) => {
                const data = {
                    id: member.id,
                    name: member.id.name,
                    email: member.id.email,
                    photo: member.id.photo,
                    tag: member.tag,
                    userPermissions: member.userPermissions,
                    reputation: member.reputation,
                    member_active: member.member_active,
                    type_invite: member.type_invite,
                }
                return data
            }) : `GET /api/team/${team.id}/members`,
            active: team.active,
            stats: team.stats,
            fixed: team.fixed ? team.fixed.sort((a, b) => {
                const fA = new Date(a.updatedAt)
                const fB = new Date(b.updatedAt)
                return fB - fA
            }) : undefined,
            slug: team.slug
        },
        // links: {
        //     self: "/api/team/" + team.id
        // }
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
        // links: {
        //     self: "/api/team/" + fixed.id_team + "/fixed/" + fixed.id
        // }
    }
    return data
}

export const getTeamMemberData = (member) => {
    const returnMember = {
        type: "member-team",
        id: member.team,
        attributes: {
            tag: member.owner,
            userPermissions: member.userPermissions,
            reputation: member.reputation,
            member_active: member.member_active,
            type_invite: member.type_invite
        },
        // links: {
        //     self: "/api/assignment/" + member.team + "/"+member.id+"/stats"
        // }
    }
    return returnMember
}

export const getTeamInfo = (team, type) => {
    const data = {
        type: "team",
        id: team.team.id,
        attributes: type == "team" ? {
            name: team.team.name,
            owner: team.team.owner,
            plan: team.team.plan,
            active: team.team.active,
            stats: `${team.team.stats}%`,
            slug: team.team.slug
        } : {
            team: {
                name: team.team.name,
                owner: team.team.owner,
                plan: team.team.plan,
                active: team.team.active,
                stats: `${team.team.stats}%`,
                slug: team.team.slug
            },
            user: {
                tag: team.member.owner,
                userPermissions: team.member.userPermissions,
                reputation: team.member.reputation,
                member_active: team.member.member_active,
                type_invite: team.member.type_invite
            }
        },
        // links: {
        //     self: "/api/team/" + team.id + "/stats"
        // }
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
            category: assignment.category,
            team: typeof assignment.team == "object" ? {
                id: assignment.team.id,
                name: assignment.team.name,
                slug: assignment.team.slug,
                area: assignment.team.area,
                photo: assignment.team.photo,
                privacy: assignment.team.privacy,
            } : assignment.team,
            dateLimit: assignment.dateLimit,
            // userAttachments: assignment.userAttachments,
            assignmentAttachments: assignment.assignmentAttachments.map((attachment) => {
                const data = {
                    name: attachment.name,
                    url: attachment.url,
                    format: attachment.format,
                    size: attachment.size,
                    id: attachment.id
                }
                return data
            }),
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            users: assignment.users
        },
        // links: {
        //     self: "/api/assignment/" + assignment.id
        // }
    }
    return data
}

export const TeamAssignmentReturn = (assignment) => {
    // const index = assignment.userIndex
    const data = {
        type: "team-assignment",
        id: assignment.assignment.id,
        attributes: {
            team: assignment.team,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            users: assignment.users.map((user) => {
                const u = {
                    status: user.status,
                    userAttachments: user.userAttachments,
                    user: {
                        id: user.user.id,
                        name: user.user.name,
                        email: user.user.email,
                        photo: user.user.photo,
                    }
                }
                return u
            }),
            assignment: {
                id: assignment.assignment.id,
                title: assignment.assignment.title,
                author: assignment.assignment.author,
                description: assignment.assignment.description,
                team: assignment.assignment.team,
                dateLimit: assignment.assignment.dateLimit,
                category: assignment.assignment.category,
                assignmentAttachments: assignment.assignment.assignmentAttachments.map((attachment) => {
                    const data = {
                        name: attachment.name,
                        url: attachment.url,
                        format: attachment.format,
                        size: attachment.size,
                        id: attachment.id
                    }
                    return data
                }),
                createdAt: assignment.assignment.createdAt,
                updatedAt: assignment.assignment.updatedAt,
            }
        },
        // links: {
        //     self: "/api/user/" + assignment.users[index].user
        // }
    }
    return data
}

export const UserAssignmentReturn = (userAssignment) => {
    const index = userAssignment.userIndex
    const data = {
        type: "user-assignment",
        id: userAssignment.id,
        attributes: {
            team: typeof userAssignment.team == "object" ? {
                id: userAssignment.team.id,
                name: userAssignment.team.name,
                slug: userAssignment.team.slug,
                area: userAssignment.team.area,
                photo: userAssignment.team.photo,
                privacy: userAssignment.team.privacy,
            } : userAssignment.team,
            createdAt: userAssignment.createdAt,
            updatedAt: userAssignment.updatedAt,
            userAttachments: userAssignment.users[index].userAttachments,
            status: userAssignment.users[index].status,
            completedAt: userAssignment.users[index].completedAt,
            assignment: {
                id: userAssignment.assignment.id,
                title: userAssignment.assignment.title,
                author: userAssignment.assignment.author,
                description: userAssignment.assignment.description,
                team: userAssignment.assignment.team,
                category: userAssignment.assignment.category,
                dateLimit: userAssignment.assignment.dateLimit,
                assignmentAttachments: userAssignment.assignment.assignmentAttachments.map((attachment) => {
                    const data = {
                        name: attachment.name,
                        url: attachment.url,
                        format: attachment.format,
                        size: attachment.size,
                        id: attachment.id
                    }
                    return data
                }),
                createdAt: userAssignment.assignment.createdAt,
                updatedAt: userAssignment.assignment.updatedAt,
            }
        },
        // links: {
        //     self: "/api/user/" + userAssignment.users[index].user
        // }
    }
    return data
}


//Kanban
export const KanbanReturn = (kanban) => {
    const data = {
        type: "kanban",
        id: kanban.id,
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
                const data = {
                    id: topic.id,
                    author: topic.author,
                    title: topic.title,
                    content: topic.content,
                    color: topic.color,
                    createdAt: topic.createdAt,
                    updatedAt: topic.updatedAt,
                    dateLimit: kanban.isAssignment ? topic.dateLimit : undefined,
                    isAssignment: topic.isAssignment
                }
                return data
            }),
        },
        // links: {
        //     self: "/api/kanban/" + kanban.id
        // }
    }
    return data
}


//requests
export const UserInviteRequests = (request) => {
    const data = {
        type: "requests",
        id: request.id,
        attributes: {
            user: {
                id: request.user.id,
                name: request.user.name,
                email: request.user.email,
                photo: request.user.photo,
            },
            receiver: request.receiver,
            status: request.status,
            active: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            team: {
                id: request.team.id,
                name: request.team.name,
                area: request.team.area,
                slug: request.team.slug,
                privacy: request.team.privacy,
                stats: request.team.stats,
                active: request.team.active
            }
        },
        // links: {
        //     self: "/api/kanban/" + kanban.id
        // }
    }
    return data
}

export const TeamRequests = (request) => {
    const data = {
        type: "requests",
        id: request.id,
        attributes: {
            user: {
                id: request.user.id,
                name: request.user.name,
                email: request.user.email,
                photo: request.user.photo,
            },
            receiver: {
                id: request.receiver.id,
                name: request.receiver.name,
                email: request.receiver.email,
                photo: request.receiver.photo,
            },
            status: request.status,
            active: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            team: {
                id: request.team.id,
                name: request.team.name,
                area: request.team.area,
                slug: request.team.slug,
                privacy: request.team.privacy,
                stats: request.team.stats,
                active: request.team.active
            }
        },
        // links: {
        //     self: "/api/kanban/" + kanban.id
        // }
    }
    return data
}