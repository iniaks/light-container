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
            const result = [0, 0, 0, 0, 0, 0, 0]
            const dailyChange = stock.daily.dailyChange
            if (dailyChange >= 6) {
                result[6] = 1
            } else if (dailyChange <= -6) {
                result[0] = 1
            } else if (dailyChange < 6 && dailyChange >= 4) {
                result[5] = 1
            } else if (dailyChange <= -4 && dailyChange > -6) {
                result[1] = 1
            } else if (dailyChange < 4 && dailyChange >= 2) {
                result[4] = 1
            } else if (dailyChange <= -2 && dailyChange > -4) {
                result[2] = 1
            } else {
                result[3] = 1
            }
            return tf.tensor(result)
        }
    }
}