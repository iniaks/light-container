<template>
    <div></div>
</template>

<script>
    import * as tf from '@tensorflow/tfjs'
    import * as tfvis from '@tensorflow/tfjs-vis'
    import { MnistData } from './_data'
    import train from './_train'
    import model from './_model'
    import evaluate from './_evaluate'

    export default {
        mixins: [train, model, evaluate],
        methods: {
            async showExamples(data) {
                // Create a container in the visor
                const surface =
                    tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data'})

                // Get the examples
                const examples = data.nextTestBatch(20)
                const numExamples = examples.xs.shape[0]

                // Create a canvas element to render each example
                for (let i = 0; i < numExamples; i++) {
                    const imageTensor = tf.tidy(() => {
                    // Reshape the image to 28x28 px
                    return examples.xs
                        .slice([i, 0], [1, examples.xs.shape[1]])
                        .reshape([28, 28, 1])
                    })

                    const canvas = document.createElement('canvas')
                    canvas.width = 28
                    canvas.height = 28
                    canvas.style = 'margin: 4px;'
                    await tf.browser.toPixels(imageTensor, canvas)
                    surface.drawArea.appendChild(canvas)

                    imageTensor.dispose()
                }
            },

            async run() {
                const data = new MnistData()
                await data.load()
                await this.showExamples(data)
                const model = await tf.loadLayersModel('localstorage://mnist-model')
                // const model = this.getModel()
                tfvis.show.modelSummary({name: 'Model Architecture', tab: 'Model'}, model)
                // await this.train(model, data)
                // await model.save('localstorage://mnist-model')
                await this.showAccuracy(model, data)
                await this.showConfusion(model, data)
            }
        },
        mounted () {
            this.run()
        }
    }
</script>

