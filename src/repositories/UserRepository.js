import User from "../model/User.js";

class UserRepository {
    async create(name, email, password, plan, photo, teams, applicationPermissions) {
        const user = await User.create({ name, email, password, plan, photo, teams, applicationPermissions })
        await user.save()
        return user;
    }
    async login(email) {
        const user = await User.findOne({ email })
        return user
    }
    async verifyEmail(email) {
        const user = await User.findOne({ email })
        if (user) {
            return true
        } else {
            return false
        }
    }
    async get() {
        const users = await User.find({})
        return users
    }
    async find(id) {
        const user = await User.findById(id)
        return user
    }
    // async update(id, data) {
    //     const user = await User.findByIdAndUpdate(id, data)
    //     return user
    // }
    // async destroy(id) {
    //     const user = await User.findByIdAndDelete(id)
    //     return user
    // }

    // async getMyTeams(id_user) {
    //     const user = await this.find(id_user)
    //     if(!user) return null
    //     if(!user.teams) return false
    //     return user.teams
    // }

    // async addMember(id_member, team_data) {
    //     const user = await User.findById(id_member)
    //     user.teams.push(team_data)
    //     await user.save()
    //     return user
    // }

    // async removeMember(id_member, id_team) {
    //     const user = await User.findById(id_member)
    //     if (!user) return null
    //     let teams = user.teams.findIndex((team) => {
    //         return team.id.toString() === id_team
    //     })
    //     if(!teams) return undefined
    //     user.teams.splice(teams,1)
    //     await user.save()
    //     return user
    // }
}

export default new UserRepository()