import User from "../model/User.js";

class UserRepository {
    async create(name, email, password, plan, photo, background, applicationPermissions, teams) {
        const user = await User.create({ name, email, password, plan, photo, background, teams, applicationPermissions })
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
            return user
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
    async update(id, data) {
        const user = await User.findByIdAndUpdate(id, data)
        return user
    }
    async destroy(id) {
        const user = await User.findByIdAndDelete(id)
        return user
    }

    async getUserTeams(id_user) {
        // const user = await this.find(id_user)
        // User.findOne({_id: id_user})
        try {
            const user = await User.findOne({_id: id_user})
            if(!user) return null
            if(!user.teams) return false
            return user.teams
        } catch (error) {
            console.log(error)            
        }
    }

    async getUserTeamsPopulate(id_user) {
        // const user = await this.find(id_user)
        // User.findOne({_id: id_user})
        try {
            const user = await User.findOne({_id: id_user}).populate("teams")
            if(!user) return null
            if(!user.teams) return false
            return user.teams
        } catch (error) {
            console.log(error)            
        }
    }

    async addMember(id_team, id_member) {
        try {
            const user = await User.findById(id_member)
            user.teams.push(id_team)
            await user.save()
            return user
        } catch (error) {
            throw new Error(error.message)            
        }
    }

    async removeMember(id_team, id_member) {
        try {
            const user = await User.findById(id_member);
            if (!user) throw new Error("ERR_USER_NOT_FOUND");
            let teams = user.teams.findIndex((team) => {
                return team.toString() === id_team
            })
            if (teams < 0) throw new Error("ERR_USER_IS_NOT_TEAM")
            user.teams.splice(teams, 1)
            await user.save()
            return user;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new UserRepository()