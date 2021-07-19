import * as tf from '@tensorflow/tfjs'

export default {
    methods: {
        formatX (stock) {
            const fluctuate = stock.dailyList.map(item => {
                return [item.dailyChange, item.pctChg]
            })
            const daily = stock.dailyList.map(item => {
                return [item.amount, item.vol]
            })
            const hkHolds = stock.hkHolds.map(item => {
                return [item.vol, item.ratio]
            })
            const marginDetails = stock.marginDetails.length > 0 ? stock.marginDetails.map(item => {
                return [item.rqchl, item.rqmcl]
            }) : [[0,0], [0,0], [0,0], [0,0], [0,0]]
            console.info([daily, hkHolds, marginDetails])
            const a = tf.tensor(fluctuate)
            const b = tf.tensor(daily)
            const c = tf.tensor(hkHolds)
            const d = tf.tensor(marginDetails)
            return tf.stack([a, b, c])
        },
        formatY (stock) {
            return tf.tensor([stock.daily.dailyChange])
        }
    }
}