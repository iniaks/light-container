<template>
    <div>
        <p>动爻：{{result.change_index}}</p>
        <div class='diagram-container' v-if='result.current'>
            <div class='diagram-container__item'>
                {{result.current.secondary.shape}}{{result.current.primary.shape}}
                {{result.current.name}}

                <p>{{result.current.description}}</p>

                <div>
                    <p v-for='(item, index) in result.current.lines.stable_version' :key='`current-${index}`'>
                        {{item}}
                    </p>
                </div>
            </div>
            <div class='diagram-container__item'>
                {{result.next.secondary.shape}}{{result.next.primary.shape}}
                {{result.next.name}}

                <p>{{result.next.description}}</p>

                <div>
                    <p v-for='(item, index) in result.next.lines.stable_version' :key='`next-${index}`'>
                        {{item}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'

    export default {
        data () {
            return {
                result: {}
            }
        },
        methods: {
            init () {
                const that = this
                axios.get(`${API_HOST}/diagram/enlighten?number=${this.$route.params.number}`).then((res => {
                    that.result = res.data.result
                })).catch(err => {
                    return err
                })
            }
        },
        mounted () {
            this.init()
        }
    }
</script>

<style lang="less" scoped>
    .diagram-container {
        display: flex;
        width: 720px;
        .diagram-container__item {
            flex: 1;
        }
    }
</style>


