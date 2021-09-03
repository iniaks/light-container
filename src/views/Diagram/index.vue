<template>
    <div class='container'>
        <div class='group-title'>
            <div class='group-name'>宫</div>
            <div class='group-name'>不变</div>
            <div class='group-name'>一变</div>
            <div class='group-name'>二变</div>
            <div class='group-name'>三变</div>
            <div class='group-name'>四变</div>
            <div class='group-name'>五变</div>
            <div class='group-name'>游魂</div>
            <div class='group-name'>归魂</div>
        </div>
        <div>
            <div v-for='group in trigrams' :key='group.congenital_order' class='group'>
                <div class='group-item'>
                    <span style='font-size: 16pt'>{{group.name}}</span>
                    <span style='font-size: 10pt; color: #999'> 为{{group.shape}}</span>
                </div>
                <div
                class='group-graph'
                v-for='item in combinations[group._id]'
                :key='`combination-${item.order}`'>
                    <div class='combination-info'>
                        <div class='combination-graph'>
                            <div v-for='(line, index) in item.secondary.lines' :key='`up-${index}`' class='combination-graph__line'/>
                            <div v-for='(line, index) in item.primary.lines' :key='`down-${index}`' class='combination-graph__line'/>
                        </div>
                        <div class='combination-subject'>
                            <div style='margin-bottom: 12px'>上{{item.secondary.name}}</div>
                            <div>下{{item.primary.name}}</div>
                        </div>
                    </div>
                    <div>{{item.secondary.shape}}{{item.primary.shape}} {{item.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data () {
            return {
                trigrams: [],
                combinations: {}
            }
        },
        methods: {
            init () {
                const that = this
                axios.get('http://local.api.spider.com/diagram/trigrams').then((res => {
                    that.trigrams = res.data.result
                })).catch(err => {
                    return err
                })
            },
            update () {
                const that = this
                axios.get('http://local.api.spider.com/diagram/combinations').then((res => {
                    res.data.result.forEach(combination => {
                        if (that.combinations[combination.group]) that.combinations[combination.group].push(combination)
                        else that.combinations[combination.group] = [combination]
                    })
                    that.combinations = Object.assign({}, that.combinations)
                })).catch(err => {
                    return err
                })
            }
        },
        mounted () {
            this.init()
            this.update()
        }    
    }
</script>

<style lang="less" scoped>
    .container {
        font-family: 'STKaiti', 'BiauKai', 'NSimSun' !important;
    }
    .group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .group-title {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        font-size: 10pt;
        .group-name {
            width: 90px;
            text-align: center;
        }
    }
    .group-item {
        padding: 30px;
        width: 90px;
        height: 120px;
        box-sizing: border-box;
        text-align: center;
        margin-right: 10px;
        border-right: 1px solid #eee;
    }
    .group-graph {
        padding: 10px;
        box-sizing: border-box;
        width: 90px;
        height: 120px;
        text-align: center;
        border-right: 1px solid #eee;
    }
    .combination-info {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    .combination-graph {
        margin-bottom: -5px;
        margin-right: 10px;
        flex: 1;
        .combination-graph__line {
            margin: 0 auto;
            width: 25px;
            height: 5px;
            background: #333;
            margin-bottom: 5px;
        }
    }
</style>


