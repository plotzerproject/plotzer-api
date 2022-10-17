import RequestRepository from "../repositories/RequestRepository";

class RequestController {
    async create(req, res, next) {}
    async get(req, res, next) {
        const a = await RequestRepository.get()
        res.send(a)
    }
    async find(req, res, next) {}
    async put(req, res, next) {}
    async destroy(req, res, next) {}
}

export default new RequestController();
