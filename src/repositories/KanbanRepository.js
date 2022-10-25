import Kanban from "../model/Kanban.js";

class KanbanRepository{
    async create(owner, title, subtitle, topics, tag, color, team ) {
        const kanban = await Kanban.create({owner, title, subtitle, topics, tag, color, team})
        await kanban.save()
        return kanban
    }
    async get() {
        const kanbans = await Kanban.find({})
        return kanbans
    }
    async find(id) {
        const kanban = await Kanban.findById(id)
        return kanban
    }
    async update(id, data) {
        const kanban = await Kanban.findByIdAndUpdate(id, data)
        return kanban
    }
    async destroy(id) {
        const kanban = await Kanban.findByIdAndDelete(id)
        return kanban
    }
    async getUserBoards(id_user){
        try {
            const kanbans = await Kanban.find({owner: id_user})
            //validar se der null
            return kanbans
        } catch (error) {
            throw new Error(error.message) 
        }
    }
    async verifyUserHasKanban(id_user){
        try {
            const kanban = await Kanban.findOne({owner: id_user})
            return kanban
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getTopicIndex(id_card, id_topic) {
        try {
            const kanban = await Kanban.findById(id_card)

            if (!kanban) throw new Error("ERR_TEAM_NOT_FOUND");
            let topic = kanban?.topics.findIndex((topic) => {
                return topic.id.toString() === id_topic;
            });
            if (topic < 0) throw new Error("ERR_CARD_NOT_FOUND")
            return {topic, kanban};
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async updateTopic(id_card, id_topic, data) {
        const {content, title, color} = data
        try {
            const {kanban, topic} = await this.getTopicIndex(id_card, id_topic)
            kanban.topics[topic].content = content ? content : kanban.topics[topic].content
            kanban.topics[topic].title = title ? title : kanban.topics[topic].title
            kanban.topics[topic].color = color ? color : kanban.topics[topic].color
            
            await kanban.save()
            return kanban
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteTopic(id_card, id_topic) {
        try {
            const {kanban, topic} = await this.getTopicIndex(id_card, id_topic)
            kanban.topics.splice(topic, 1)
            await kanban.save()
            return kanban;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new KanbanRepository()