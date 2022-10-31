import Team from "../model/Team.js";
import UserRepository from "./UserRepository.js";

class TeamRepository {
    async create(
        name,
        owner,
        area,
        description,
        privacy,
        plan,
        active,
        members,
        slug,
        photo,
        stats,
        fixed
    ) {
        const team = await Team.create({
            name,
            area,
            description,
            privacy,
            owner,
            plan,
            slug,
            photo,
            active,
            members,
            stats,
            fixed,
        });
        await team.save();
        return team;
    }
    async get() {
        const team = await Team.find({});
        return team;
    }
    async find(req) {
        const team = await Team.findOne(req);
        return team;
    }

    async findPopulate(req, populate) {
        const team = await Team.findOne(req).populate(populate);
        return team;
    }

    async update(id, data) {
        const team = await Team.findByIdAndUpdate(id, data);
        return team;
    }
    async destroy(id) {
        const team = await Team.findByIdAndDelete(id);
        return team;
    }

    async verifyUserTeam(id_team, id_user) {
        try {
            const team = await Team.findById(id_team);
            if(team == null) {throw new Error("ERR_TEAM_NOT_FOUND")}
            let member = team?.members.find((member) => {
                return member.id.toString() === id_user;
            });
            if (member && member.member_active == true) {
                return { team, member };
            } else {
                throw new Error("ERR_USER_IS_NOT_PART_OF_TEAM");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addFixed(id_team, id_user, title, content) {
        try {
            const { team, member } = await this.verifyUserTeam(id_team, id_user);
            if (member.userPermissions > 4) {
                const fixed = { author: id_user, title, content };
                team.fixed.push(fixed);
                await team.save();
                console.log(team);
                return team;
            } else {
                throw new Error("ERR_MEMBER_DOESNT_HAVE_PERMISSION");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getFixed(id_team, id_user) {
        try {
            const { team, member } = await this.verifyUserTeam(id_team, id_user);
            const fixed = team.fixed.map((item) => {
                item.id_team = id_team
                return {
                    author: item.author,
                    title: item.title,
                    content: item.content,
                    id: item.id,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    id_team
                }
            })
            return fixed
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getMembers(id_team) {
        const team = await Team.findById(id_team).populate("members.id")
        console.log(team.members[0].id)
        if (!team) return null;
        return {team, members: team.members};
    }

    async getMember(id_team, id_member) {
        try {
            const team = await Team.findById(id_team);
            if (!team) throw new Error("ERR_TEAM_NOT_FOUND");
            let member = team?.members.find((member) => {
                return member.id.toString() === id_member;
            });
            if (!member) return undefined
            return member;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getMemberIndex(id_team, id_member) {
        try {
            const team = await Team.findById(id_team);
            if (!team) throw new Error("ERR_TEAM_NOT_FOUND");
            let member = team?.members.findIndex((member) => {
                return member.id.toString() === id_member;
            });
            if (member < 0) throw new Error("ERR_USER_IS_NOT_TEAM")
            return member;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async addMember(id_team, memberData) {
        const team = await Team.findById(id_team);
        // if(!team) return null
        team.members.push(memberData);
        await team.save();
        return team;
    }

    async updateMember(id_team, id_member) {
        const team = await Team.findById(id_team);
        if (!team) return null
        let member = team?.members.findIndex((member) => {
            return member.id.toString() === id_member;
        });
        if (member < 0) return undefined
        team.members[member].member_active = true
        await team.save();
        return team;
    }
    async removeMember(id_team, id_member) {
        try {
            const team = await Team.findById(id_team);
            if (!team) throw new Error("ERR_TEAM_NOT_FOUND");
            let member = team?.members.findIndex((member) => {
                return member.id.toString() === id_member;
            });
            if (member < 0) throw new Error("ERR_USER_IS_NOT_TEAM")
            if(team.members[member].type_invite == "owner") throw new Error("ERR_REMOVE_OWNER")
            team.members.splice(member, 1)
            await team.save()
            return team;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getUserStats(id_team, id_user) {
        try {
            const {team, member} = await this.verifyUserTeam(id_team, id_user)
            return member
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getTeamStats(id_team, id_user) {
        try {
            const {team, member} = await this.verifyUserTeam(id_team, id_user)
            return {team, member}
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new TeamRepository();
