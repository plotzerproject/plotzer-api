import Team from "../model/Team.js";
import UserRepository from "./UserRepository.js";

class TeamRepository {
    async create(name, owner, area, description, privacy, plan, active, members, slug, photo) {
        const team = await Team.create({ name, area, description, privacy, owner, plan, slug, photo, active, members })
        await team.save()
        return team;
    };
    async get() {
        const team = await Team.find({})
        return team
    }
    async find(id) {
        const team = await Team.findById(id)
        return team
    }

    async update(id, data) {
        const team = await Team.findByIdAndUpdate(id, data)
        return team
    }
    async destroy(id) {
        const team = await Team.findByIdAndDelete(id)
        return team
    }

    async getMembers(id_team) {
        const team = await Team.findById(id_team)
        if(!team) return null
        return team.members
    }

    async getMember(id_team, id_member) {
        const team = await Team.findById(id_team)
        if(!team) return null
        let member = team?.members.find((member)=>{
            return member.id.toString() === id_member
        }) 
        return member
    }

    async addMember(id_team, memberData) {
        const team = await Team.findById(id_team)
        // if(!team) return null
        team.members.push(memberData)
        await team.save()
        return team
    };
    async removeMember(id_team, member_id) {

    };
    async joinTeam(id_team, memberData) {

    };
    async leaveTeam(id_team, member_id) {

    };
}

export default new TeamRepository()