<template>
    <div class='reading-container'>
        <div class="reading-chapters" v-if="chapter_list.length > 0">
            <div v-for="(chapter, index) in chapter_list" :key="`chapter-${index}`"
            @click="chap(index)"
            :class="['reading-chapters__item', index == chapter_index ? 'active' : '']"
            >
                {{chapter.title}}
            </div>
        </div>
        <div style="flex: 1" class="reading-main">
            <div class='reading-context' v-if='book_map.length > 0'>
                <h2>{{book_title}}</h2>
                <h3 v-if="chapter_list.length > 0">{{chapter_list[chapter_index].title}}</h3>
                <div class="reading-opts">
                    <div @click="learn(0.1)">青铜</div>
                    <div @click="learn(0.2)">白银</div>
                    <div @click="learn(0.4)">黄金</div>
                    <div @click="learn(0.6)">白金</div>
                    <div @click="learn(0.8)">钻石</div>
                    <div @click="learn(1)">大师</div>
                    <div @click="complete">全显</div>
                </div>
                <br/>
                <div class="reading-paragraph">
                    <context-char v-for="(item, index) in book_map"
                    :lindex="index"
                    :key="`word-${index}`"
                    :letter="item"
                    :book="book_map"
                    :current="hides[answer.current]"/>
                </div>
            </div>
            <div class="reading-bar">
                <reading-bar :answer='answer' :book='book_map' :hides='hides' v-on:complete='check'/>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'
    // import { TEST_CONTEXT } from './test'
    import ContextChar from './_disk'
    import ReadingBar from './_bar'
    

    export default {
        components: {
            ContextChar,
            ReadingBar
        },
        data () {
            return {
                book_title: '',
                book_map: [],
                startTime: null,
                chapter_index: 0,
                chapter_list: [],
                hides: [],
                answer: { current: 0 }
                // test: TEST_CONTEXT
            }
        },
        methods: {
            generate (content) {
                const that = this
                this.book_map = []
                content.forEach((para, pindex) => {
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
                axios.get(`${API_HOST}/reading/article?urn=${this.$route.query.urn}`).then((res => {
                    that.book_title = `${res.data.toptitle}·${res.data.title}`
                    if (res.data.subcontents.length > 0) {
                        that.chapter_list = res.data.subcontents
                        that.chap(0)
                    } else {
                        that.generate(res.data.fulltext)
                    }
                })).catch(err => {
                    return err
                })
            },
            chap (index) {
                this.chapter_index = index
                this.generate(this.chapter_list[this.chapter_index].fulltext)
                this.complete()
                this.reset()
            },
            random (min, max) {
                return Math.floor(Math.random() * (max - min)) + min
            },
            learn (percent) {
                this.complete()
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
                    this.startTime = new Date()
                } else {
                    this.hides = []
                    while (this.hides.length < capacity) {
                        const index = this.random(0, max)
                        if (this.book_map[index].isChar && !this.book_map[index].isHide && this.hides.indexOf(index) < 0) {
                            this.hides.push(index)
                        }
                    }
                    this.hides.sort((a, b) => {
                        return a-b
                    })
                    this.hides.forEach(i => {
                        that.book_map[i].isHide = true
                    })
                    this.startTime = new Date()
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
                this.reset()
            },
            reset () {
                this.startTime = null
                this.answer.current = 0
                this.book_map.forEach(item => {
                    item.context = ''
                })
            },
            check () {
                const allowance = this.book_map.filter(item => item.isHide && (item.context == '' || item.context != item.char)).length
                // console.log(allowance)
                if (allowance <= 0) {
                    const endTime = new Date()
                    window.alert(`完成！耗时${(endTime.getTime() - this.startTime.getTime()) / 1000}秒！`)
                    this.complete()
                    this.reset()
                }
            }
        },
        mounted () {
            this.init()
            // this.generate(this.test)
        }
    }
</script>

<style lang="less" scoped>
    .reading-container {
        display: flex;
        box-sizing: border-box;
        .reading-main {
            display: flex;
            flex-direction: column;
            height: 100vh;
            box-sizing: border-box;
        }
        .reading-context {
            flex: 3;
            background: #f3f4f5;
            padding: 30px 50px;
            box-sizing: border-box;
            overflow-y: auto;
            min-height: 0;
        }
        .reading-bar {
            flex: 1;
        }
        .reading-chapters {
            height: 100vh;
            box-sizing: border-box;
            overflow-y: auto;
            padding: 15px;
            .reading-chapters__item {
                margin-bottom: 15px;
                cursor: pointer;
                &.active {
                    color: red;
                }
            }
        }
        .reading-opts {
            div {
                display: inline-block;
                margin-right: 10px;
            }
        }
        .reading-paragraph {
            color: #333;
            line-height: 1.5em;
            transition: all .3s ease;
            word-break: break-all;
            font-size: 13pt;
            margin: 15px 0;
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


