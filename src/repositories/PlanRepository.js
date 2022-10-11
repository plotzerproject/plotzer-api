import Plan from "../model/Plan.js";

class PlanRepository{
    async create(name, description, price, permissions) {
        const plan = await Plan.create({name, description, price, permissions})
        await plan.save()
        return plan
    }
    async get() {
        const plans = await Plan.find({})
        return plans
    }
    async find(id) {
        const plan = await Plan.findById(id)
        return plan
    }
    async update(id, data) {
        const plan = await Plan.findByIdAndUpdate(id, data)
        return plan
    }
    async destroy(id) {
        const plan = await Plan.findByIdAndDelete(id)
        return plan
    }
}

export default new PlanRepository()