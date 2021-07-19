<template>
    <div>
        <button @click='train'>查看批量</button>
        <table>
            <thead>
                <tr>
                    <td>股票码</td>
                    <td>上一周</td>
                    <td>港股通</td>
                    <td>融资融券</td>
                    <td>当日</td>
                    <td>操作</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(stock, index) in list' :key='index'>
                   <td>{{stock.daily.code}}</td>
                   <td>{{stock.dailyList.map(item => {
                       return `[${item.dailyChange}, ${item.amount}, ${item.vol}]`}).join(',')}}</td>
                   <td>{{stock.hkHolds.map(item => {
                       return `[${item.vol}, ${item.ratio}]`}).join(',')}}</td>
                   <td>{{stock.marginDetails.map(item => {
                       return `[${item.rqchl}, ${item.rqmcl}]`}).join(',')}}</td>
                    <td>
                        {{stock.daily.dailyChange}}
                    </td>
                    <td><button @click='view(stock)'>tensor</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from 'axios'
    import * as tf from '@tensorflow/tfjs'
    import data from './_data'
    import tensor from './_tensor'

    export default {
        mixins: [data, tensor],
        data () {
            return {
                list: []
            }
        },
        methods: {
            view (stock) {
                const t = this.formatX(stock)
                console.log(t)
                t.print()
            },
            train () {
                this.nextTrainBatch(this.list, 0)
            }
        },
        mounted () {
            const that = this
            that.list = []
            axios.get('https://hanguangshuju.com:9927/api/v1/test').then((res => {
                for (let prop in res.data.result) {
                    that.list.push(res.data.result[prop])
                }
            })).catch(err => {
                return err
            })
        }

    }
</script>

