<template>
    <div>
        <!-- <div v-for="(item, index) in datas" :key="`hex-${index}`">
            {{item.digits}}
            {{item.x}}
            {{item.y}}
        </div> -->
        <canvas id="myHex"></canvas>
    </div>
</template>

<script>
    const Chart = window.Chart
    import axios from 'axios'
    import { API_HOST } from '@/store/config'
    import { FULL_CIRCLE } from '@/store/model'

    export default {
        data () {
            return {
                combinations: {},
                hexes: FULL_CIRCLE,
                datas: [],
                chart: null
            }
        },
        methods: {
            update () {
                const that = this
                axios.get(`${API_HOST}/diagram/combinations`).then((res => {
                    res.data.result.forEach(item => {
                        that.combinations[item.name] = {
                            inner: item.primary.lines,
                            outer: item.secondary.lines
                        }
                    })
                    // console.log(that.combinations)
                    that.serialize()
                })).catch(err => {
                    return err
                })
            },
            serialize () {
                const that = this
                this.hexes.forEach(hex => {
                    const inner_digits = that.combinations[hex].inner.map(bit => bit ? 1 : 0).join('')
                    const outer_digits = that.combinations[hex].outer.map(bit => bit ? 1 : 0).reverse().join('')
                    const digits = inner_digits + outer_digits
                    const statistic = {
                        x: hex,
                        // digits: digits,
                        y: parseInt(digits, 2) - 32
                    }
                    // console.info(inner_digits, outer_digits, statistic)
                    that.datas.push(statistic)
                })
                this.draw()
            },
            draw () {
                if (!this.chart) {
                    const config = {
                        type: 'line',
                        data: {datasets: [{
                            label: '循环',
                            data: this.datas
                        }]}
                    }
                    // console.log(config)
                    const ctx = document.getElementById('myHex').getContext('2d')
                    this.chart = new Chart(ctx, config)
                }
            }
        },
        mounted () {
            // console.log(this.hexes)
            this.update()
        }
    }
</script>

<style lang="less" scoped>
    #myHex {
        width: 100%;
        height: 250px;
    }
</style>
