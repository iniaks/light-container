<template>
    <div class='reading-container'>
        <div class='reading-context'>
            <h2>{{book_title}}</h2>
            <span v-for='(char, index) in context' :key='`context-${index}`' :class='["reading-char",
            hides.indexOf(index) >= 0 ? "reading" : "",
            index == cursor ? "sliding" : "",
            char == "\n" ? "enter" : ""]'>
                {{char}}
            </span>
        </div>
        <div class='reading-opts'>
            <div class='reading-opts__btn' @click='read'>{{hides.length > 0 || cursor >= 0 ? '继续' : '开始阅读'}}</div>
            <div class='reading-opts__btn' @click='pause'>暂停</div>
            <div class='reading-opts__btn' @click='turn(-1)' v-if='page > 0'>上一页</div>
            <div class='reading-opts__btn' @click='turn(1)' v-if='page < book.length - 1'>下一页</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'
    // import { TEST_CONTEXT } from './test'

    export default {
        data () {
            return {
                timer: null,
                book_title: '',
                book: [],
                context: '',
                count: -1,
                cursor: -1,
                hides: [],
                mode: '',
                page: 0,
            }
        },
        methods: {
            init (query) {
                const that = this
                axios.get(`${API_HOST}/reading/book?addr=${this.$route.query.addr}`).then((res => {
                    that.book_title = res.data.title
                    that.separate(res.data.content)
                    that.context = that.book[that.page].join('\n')
                    // console.log(that.context)
                })).catch(err => {
                    return err
                })
            },
            separate (paras) {
                const capacity = 5
                for (let i = 0; i < paras.length; i+=capacity) {
                    this.book.push(paras.slice(i, i+capacity))
                }
                // console.log(this.book)
            },
            read () {
                if (this.mode == 'disappear') {
                    this.disappear()
                } else if (this.mode == 'recovering') {
                    this.recover()
                } else {
                    this.appear()
                }
            },
            recover () {
                const that = this
                this.mode = 'recovering'
                that.timer = setInterval(() => {
                    if (that.count <= that.context.length) {
                        that.count++
                        that.hides.push(that.count)
                    } else {
                        clearInterval(that.timer)
                        that.disappear()
                    }
                }, 200)
            },
            appear () {
                const that = this
                this.mode = 'reading'
                this.timer = setInterval(() => {
                    if (that.cursor <= that.context.length) that.cursor++
                    else {
                        clearInterval(that.timer)
                        that.recover()
                    }
                }, 250)
            },
            disappear () {
                const that = this
                this.mode = 'disappear'
                this.timer = setInterval(() => {
                    if (that.hides.length > 0) that.hides.shift()
                    else {
                        clearInterval(that.timer)
                        that.count = -1
                        that.cursor = -1
                    }
                }, 200)
            },
            pause () {
                clearInterval(this.timer)
                // this.timer()
            },
            turn (direction) {
                this.page = this.page + direction
                this.context = this.book[this.page].join('\n')
                this.hides = []
                this.count = -1
                this.cursor = -1
                this.mode = ''
                clearInterval(this.timer)

            }
        },
        mounted () {
            this.init()
        }
    }
</script>

<style lang="less" scoped>
    .reading-container {
        width: 960px;
        margin: 0 auto;
        position: relative;
        background: #f3f4f5;
        .reading-context {
            height: 100vh;
            box-sizing: border-box;
            padding: 30px 15px;
            overflow-y: auto;
        }
        .reading-char {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 18px;
            margin-bottom: 8px;
            box-sizing: border-box;
            transition: all .8s ease;
            opacity: 0.02;
            &.reading {
                opacity: 1;
            }
            &.sliding {
                font-size: 20px;
                opacity: 1;
            }
            &.enter {
                display: block;
                margin-bottom: 12px;
            }
        }
        .reading-opts {
            position: absolute;
            right: -80px;
            bottom: 150px;
            margin-top: 20px;
            .reading-opts__btn {
                cursor: pointer;
            }
        }
    }
</style>


