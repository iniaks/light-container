<template>
    <div class='reading-container'>
        <div class='reading-context' v-if='book'>
            <h2>{{book.title}}</h2>
            <button @click="learn(0.1)" style="margin-right: 10px">学习</button>
            <button @click="complete">全显</button>
            <p class="reading-paragraph">
                <span v-for="(item, index) in book_map"
                :key="`word-${index}`"
                :style="{borderBottomColor: item.isHide ? '#333' : 'transparent',
                display: item.isWrap ? 'block' : 'inline-block'}"
                class="reading-word">
                    <span :class="[item.isHide ? 'hide' : '']" v-if="!item.isWrap">{{item.char}}</span>
                    <!-- <input v-model="item.context" v-if='item.isHide' class='reading-input'
                    :style='{color: item.char == item.context || item.context == "" ? "#333" : "red"}'/>
                    <span class="reading-toggle" v-if='item.isHide' @click='toggle(index)'/> -->
                </span>
            </p>
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
                book: null,
                book_map: []
            }
        },
        methods: {
            generate () {
                const that = this
                this.book.content.forEach((para, pindex) => {
                    for (let i = 0; i<para.length; i++) {
                        that.book_map.push({
                            char: para[i],
                            cindex: i,
                            para: pindex,
                            isChar: /[\u4E00-\u9FA5]/.test(para[i]),
                            isWrap: false,
                            isHide: false,
                            context: ''
                        })
                    }
                    that.book_map.push({
                        char: '',
                        cindex: para.length,
                        para: pindex,
                        isChar: false,
                        isWrap: true,
                        isHide: false,
                        context: ''
                    })
                })
            },
            init () {
                const that = this
                axios.get(`${API_HOST}/reading/book?addr=${this.$route.query.addr}`).then((res => {
                    that.book = res.data
                    that.generate()
                })).catch(err => {
                    return err
                })
            },
            random (min, max) {
                return Math.floor(Math.random() * (max - min)) + min
            },
            learn (percent) {
                const that = this
                const max = this.book_map.length
                const capacity = Math.floor(max * percent)
                const allowance = this.book_map.filter(item => !item.isHide && item.isChar).length
                this.reset()
                if (allowance == 0) {
                    return
                } else if (allowance <= capacity) {
                    this.book_map.forEach(item => {
                        if (item.isChar) item.isHide = true
                    })
                } else {
                    const hides = []
                    while (hides.length < capacity) {
                        const index = this.random(0, max)
                        if (this.book_map[index].isChar && !this.book_map[index].isHide && hides.indexOf(index) < 0) {
                            hides.push(index)
                        }
                    }
                    hides.forEach(index => {
                        that.book_map[index].isHide = true
                    })
                }
            },
            toggle (index) {
                // this.book_map[index].context = this.book_map[index].context == this.book_map[index].char
                // ? ''
                // : this.book_map[index].char
                this.book_map[index].isHide = !this.book_map[index].isHide
            },
            complete () {
                this.book_map.forEach(item => {
                    item.isHide = false
                })
                // this.reset()
            },
            reset () {
                this.book_map.forEach(item => {
                    item.context = ''
                })
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
        padding: 30px 15px;
        box-sizing: border-box;
        .reading-paragraph {
            color: #333;
            line-height: 1.5em;
            transition: all .3s ease;
            word-break: break-all;
            font-size: 13pt;
            span {
                transition: all ease .3s;
                border-bottom: 1px solid transparent;
            }
            .spot {
                background-color: yellowgreen;
            }
            .reading-word {
                position: relative;
                cursor: pointer;
                .reading-input {
                    outline: none;
                    position: absolute;
                    left: -2px;
                    top: -2px;
                    width: 100%;
                    height: 100%;
                    line-height: 1.5em;
                    background: transparent;
                    border: none;
                    font-size: 13pt;
                    font-family: 'Times';
                }
                .reading-toggle {
                    position: absolute;
                    top: -2px;
                    width: 4px;
                    height: 4px;
                    border-radius: 100%;
                    left: calc((100% - 4px) / 2);
                    background: #333;
                    cursor: pointer;
                }
            }
            .hide {
                opacity: 0;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
    @media screen and ( max-width: 1080px )  {
        .reading-container {
            width: 100%;
        }
    }
</style>


