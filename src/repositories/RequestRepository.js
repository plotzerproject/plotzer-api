import Request from "../model/Request.js";

class RequestRepository {
    async create(user, receiver, status, team, active) {
        const request = await Request.create({ user, receiver, status, team, active });
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

    async findUserRequests(req, populate, populate1) {
        try {
            const requests = await Request.find(req).populate(populate).populate(populate1)
            // const requests = await Request.find({})
            return requests
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async findUserTeam(id_team, id_user) {
        try {
            const request = await Request.findOne({receiver: id_user, team: id_team})
            return request
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async findTeamRequests(req, populate1, populate2, populate3) {
        try {
            const request = await Request.find(req).populate(populate1).populate(populate2).populate(populate3)
            return request
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new RequestRepository()