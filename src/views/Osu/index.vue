<template>
    <div class='reading-container'>
        <div class='reading-context'>
            <h2>{{book_title}}</h2>
            <span v-for='(item, index) in rounds' :key='`context-${index}`' :class='["reading-char",
            index - cursor == 1 ? "near" : "",
            index == cursor && item.value != "\n" ? "current" : "",
            item.pressed ? "pressed" : "",
            item.missed ? "missing" : "",
            item.correct ? "correct" : "",
            item.wrong ? "wrong" : "",
            item.value == "\n" ? "enter" : ""]'>
                {{item.value}}
            </span>
        </div>

        <div class='reading-opts'>
            <div class='reading-opts__btn' @click='start'>开始</div>
            <div class='reading-opts__btn' @click='pause'>暂停</div>
            <div class='reading-opts__btn' @click='next'>继续</div>
            <div class='reading-opts__btn' @click='turn(-1)' v-if='page > 0'>上一页</div>
            <div class='reading-opts__btn' @click='turn(1)' v-if='page < book.length - 1'>下一页</div>
            <div class='reading-opts__btn'>命中：{{board.hits}}</div>
            <div class='reading-opts__btn'>失误：{{board.errors}}</div>
            <div class='reading-opts__btn'>遗漏：{{board.misses}}</div>
            <div class='reading-opts__btn'>连击：{{combo}}</div>
            <div class='reading-opts__btn'>最长连击：{{max_combo}}</div>
            <div class='reading-opts__btn'>连击次数：{{board.combos}}</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'
    import { TEST_CONTEXT } from '../Reading/test'

    export default {
        data () {
            return {
                clock: null,
                // context: TEST_CONTEXT.join('\n'),
                book_title: '',
                book: [],
                context: '',
                rounds: [],
                cursor: -1,
                page: 0,
                commas: ['，', '。', '：', '”', '“', '；', '《', '》', '？', '、', '！'],
                playing: false,
                combo: 0,
                max_combo: 0,
                combos: []
            }
        },
        computed: {
            board () {
                return {
                    hits: this.rounds.filter(item => item.value != '\n' && item.correct).length,
                    errors: this.rounds.filter(item => item.value != '\n' && item.wrong).length,
                    misses: this.rounds.filter(item => item.value != '\n' && item.missed).length,
                    combos: this.combos.length
                }
            }
        },
        methods: {
            separate (paras) {
                const capacity = 5
                for (let i = 0; i < paras.length; i+=capacity) {
                    this.book.push(paras.slice(i, i+capacity))
                }
            },
            view () {
                const that = this
                axios.get(`${API_HOST}/reading/book?addr=${this.$route.query.addr}`).then((res => {
                    that.book_title = res.data.title
                    that.separate(res.data.content)
                    that.context = that.book[that.page].join('\n')
                    that.init()
                    // console.log(that.context)
                })).catch(err => {
                    return err
                })
            },
            pause () {
                this.playing = false
                clearInterval(this.clock)
            },
            check (char) {
                if (this.commas.indexOf(char) >= 0) return 'comma'
                else return 'word'
            },
            init () {
                for (let i = 0; i < this.context.length; i++) {
                    this.rounds.push({
                        value: this.context.charAt(i),
                        pressed: false,
                        missed: false,
                        correct: false,
                        wrong: false
                    })
                }
            },
            clear () {
                if (this.combo > 0) {
                    this.combos.push(this.combo)
                    if (this.combo > this.max_combo) this.max_combo = this.combo
                    this.combo = 0
                }
            },
            next () {
                const that = this
                this.playing = true
                this.clock = setInterval(() => {
                    if (that.cursor < that.rounds.length && !that.rounds[that.cursor].pressed) {
                        that.rounds[that.cursor].missed = true
                        that.clear()
                    }
                    if (that.cursor < that.rounds.length) {
                        that.cursor++
                    } else {
                        that.clear()
                        clearInterval(that.clock)
                    }
                }, 350)
            },
            press (type) {
                // console.log(this.cursor)
                if (this.cursor >= 0) {
                    const char = this.rounds[this.cursor].value
                    if (!this.rounds[this.cursor].pressed) {
                        if (this.check(char) == type) {
                            this.rounds[this.cursor].correct = true
                            this.combo++
                        } else {
                            this.rounds[this.cursor].wrong = true
                            this.clear()
                        }
                        this.rounds[this.cursor].pressed = true
                    }
                }
                // this.next()
            },
            start () {
                this.cursor = 0
                this.playing = true
                this.next()
            },
            turn (direction) {
                this.page = this.page + direction
                this.context = this.book[this.page].join('\n')
                this.rounds = []
                this.init()
                this.cursor = -1
                
                clearInterval(this.clock)
            }
        },
        mounted () {
            this.view()
            const that = this
            window.addEventListener('keydown', (e) => {
                console.log(e.code)
                if (e.code == 'KeyZ') {
                    that.press('word')
                } else if (e.code == 'KeyX') {
                    that.press('comma')
                } else if (e.code == 'Space') {
                    if (that.playing) {
                        that.pause()
                    } else if (this.cursor == -1) {
                        that.start()
                    } else {
                        that.next()
                    }
                }
            })
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
            transition: all .5s ease;
            opacity: 0.1;
            border: 1px solid transparent;
            position: relative;
            &.current {
                opacity: 1;
                &:before {
                    content: '';
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgb(34, 148, 255);
                    border-radius: 100%;
                    position: absolute;
                    left: -2px;
                    top: -1px;
                    z-index: 1;
                    animation: blink .8s ease infinite alternate;
                }
            }
            &.near {
                opacity: 0.5;
            }
            &.missing {
                opacity: .5;
            }
            &.correct {
                opacity: 1;
                color: rgb(41, 141, 255);
            }
            &.wrong {
                opacity: 1;
                color: #ff6039;
            }
            &.enter {
                display: block;
                margin-bottom: 12px;
            }
            &.pressed {
                &:after {
                    content: '';
                    width: 20px;
                    height: 20px;
                    border: 2px solid transparent;
                    border-radius: 100%;
                    position: absolute;
                    left: -2px;
                    top: -1px;
                    z-index: 1;
                    animation: foam .2s ease alternate;
                }
                
            }
        }
        .reading-opts {
            position: absolute;
            right: -100px;
            top: 150px;
            margin-top: 20px;
            .reading-opts__btn {
                cursor: pointer;
                span {
                    opacity: 0;
                    transition: all .1s ease;
                }
                .show {
                  opacity: 1;  
                }
            }
        }
        @keyframes blink {
            0% { transform: scale(.7); transform-origin: center; opacity: .5; }
            50% { transform: scale(1.8); transform-origin: center; opacity: 1; }
            100% { transform: scale(1); transform-origin: center; opacity: .8; }
        }
        @keyframes foam {
            0% { background: transparent; }
            50% { background: #a1d0ff; }
            100% { background: transparent }
        }
    }
</style>
