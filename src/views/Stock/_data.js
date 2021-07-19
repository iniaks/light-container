import tensor from './_tensor'

export default {
    mixins: [tensor],
    methods: {
        nextTrainBatch (list, start) {
            const that = this
            const batchs = list.slice(start, start + 20)
            const trainXs = batchs.map(item => {
                return that.formatX(item)
            })
            const trainYs = batchs.map(item => {
                return that.formatY(item)
            })
            return [
                trainXs,
                trainYs
            ]
        }
    }
}