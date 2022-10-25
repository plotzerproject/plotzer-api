import Request from "../model/Request.js";

class RequestRepository {
    async create(user, receiver, status, team, accepted) {
        const request = await Request.create({ user, receiver, status, team, accepted });
        await request.save();
        return request;
    }
    async get() {
        const requests = await Request.find({});
        return requests;
    }
    async find(req) {
        const request = await Request.findOne(req);
        return request;
    }
    async update(id, data) {
        const request = await Request.findByIdAndUpdate(id, data);
        return request;
    }
    async destroy(id) {
    }

    async findUserRequests(id) {}

    async findUserTeam(id_team, id_user) {
        try {
            const request = await Request.findOne({receiver: id_user, team: id_team})
            return request
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new RequestRepository()