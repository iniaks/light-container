<template>
    <div>
        <button @click='train'>开始</button>
        <br>
        <img id='current' :src='require(`./examples/${stockList[currentIndex]}.gif`)'/>
    </div>
</template>

<script>
    import axios from 'axios'
    import * as tf from '@tensorflow/tfjs'
    import * as knnClassifier from '@tensorflow-models/knn-classifier'
    import * as mobilenetModule from '@tensorflow-models/mobilenet'

    export default {
        data () {
            return {
                mobilenet: null,
                classifier: null,
                currentIndex: 0,
                stockList: ['sz000100', 'sz002422', 'sz002583', 'sz002643', 'sz300661', 'sz300759']
            }
        },
        methods: {
            async init () {
                this.mobilenet = await mobilenetModule.load()
                this.classifier = await knnClassifier.create()

                console.log(this.mobilenet)
            },
            train () {
                const image = tf.browser.fromPixels(document.getElementById('current'))
                const infer = () => this.mobilenet.infer(image, 'conv_preds')
                console.log(infer())
            }
        },
        mounted () {
            this.init()
        }
    }
</script>

