import * as tf from '@tensorflow/tfjs'

export default {
    methods: {
        async getModel() {
            const model = tf.sequential()

            model.add(tf.layers.dense({
                inputShape: [3, 5, 2],
                units: 30,
                activation: 'relu'
            }))

            model.add(tf.layers.dense({
                units: 7,
                activation: 'softmax'
            }))
          
            const optimizer = tf.train.adam()
            model.compile({
              optimizer: optimizer,
              loss: 'categoricalCrossentropy',
              metrics: ['accuracy'],
            })
          
            return model
        }
    }
}