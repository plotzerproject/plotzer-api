import PlanRepository from "../repositories/PlanRepository.js"
import { errCreatePlan, errDeletePlan, errGetPlan, errPlanNotFound, errUpdatePlan } from "../utils/errors.js"
import { planSuccessReturn } from "../utils/returns.js"

class UserController {
    async create(req, res, next) {
        const {name, description, price, permissions} = req.body

        try {
            const plan = await PlanRepository.create(name, description, price, permissions)

            return res.status(201).json({data: planSuccessReturn(plan)})
        } catch (error) {
            return res.status(errCreatePlan.status).json({ errors: [errCreatePlan] })
        }
    };
    async get (req, res, next) {
        try {
            const plans = await PlanRepository.get()
            if (plans.length == 0) return res.status(errPlanNotFound.status).json({ errors: [errPlanNotFound] })
            return res.status(200).json({ data: plans.map(planSuccessReturn) })

        } catch (error) {
            return res.status(errGetPlan.status).json({ errors: [errGetPlan] })
        }
    };
    async find (req, res, next) {
        const { id } = req.params
        try {
            const plan = await PlanRepository.find(id);
            if (plan == null) return res.status(errPlanNotFound.status).json({ errors: [errPlanNotFound] })

            return res.status(200).json({ data: planSuccessReturn(plan) })
        } catch (error) {
            console.log(error)
            return res.status(errGetPlan.status).json({ errors: [errGetPlan] })
        }
    };
    async update (req, res, next) {
        const { id } = req.params
        const {name, description, price, permissions} = req.body
        const data = {name, description, price, permissions}

        try {
            const plan = await PlanRepository.update(id, data);
            if (plan == null) return res.status(errPlanNotFound.status).json({ errors: [errPlanNotFound] })

            return res.status(200).json({ data: planSuccessReturn(plan) })
        } catch (error) {
            return res.status(errUpdatePlan.status).json({ errors: [errUpdatePlan] })
        }
    };
    async destroy (req, res, next) {
        const { id } = req.params

        try {
            const plan = await PlanRepository.destroy(id);

            if (plan == null) return res.status(errPlanNotFound.status).json({ errors: [errPlanNotFound] })
            return res.status(200).json({ data: "Usuário deletado com sucesso!" })

        } catch (error) {
            return res.status(errDeletePlan.status).json({ errors: [errDeletePlan] })
        }
    };
}

export default new UserController()