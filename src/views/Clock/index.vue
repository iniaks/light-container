<template>
    <div>
        <!-- <div class="clock-container">
            <div style="text-align: center">{{year}}</div>
            <div class="clock-box">
                <div class="pointers">
                    <div class="year-pointer" :style="{transform: `rotate(${(current_year-15)*6}deg)`}"></div>
                    <div class="dynasty-pointer" :style="{transform: `rotate(${(current_dynasty-15)*6}deg)`}"></div>
                </div>
                
                <div class="clock-wrapper">
                    <div class="clock-degree" v-for="item in 60" :key="item" :style="{transform: `rotate(${item*6}deg)`}">
                        {{diagrams[item - 1]}}
                    </div>
                </div>
            </div>
        </div> -->
        <div style="cursor: pointer;text-align: center">
            <div class="btn" @click="next">next</div>
            <div @click="load">加载pdf</div>
            <div @click="save">保存年历</div>
        </div>

        <table style="width: 100%">
            <tr v-for="(line, index) in contents" :key="`line-${index}`">
                <td v-for="(char, cindex) in line" :key="`char-${cindex}`">
                    {{char}}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'
    // import calendar from './calendar.pdf'
    const pdfjsLib = window.pdfjsLib
    const pdfjsWorker = window.pdfjsLib
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
    
    const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    export default {
        data () {
            return {
                year: 1984,
                diagrams: [
                    '鼎 29','恆 28', '巽 27', '井 26', '蛊 25', '升 24', '讼 23', '困 22', '未济 21', '解 20', '涣 19', '蒙 17', '师 16', '遁 15', '咸 14', '旅 13', '小过 12', '渐 11', '蹇 10', '艮 9', '谦 8', '否 7', '萃 6', '晋 5', '豫 4', '观 3', '比 2', '剥 1', '复 32', '颐 33', '屯 34', '益 35', '震 36', '噬嗑 37', '随 38', '无妄 39', '明夷40', '贲 41', '既济 42', '家人 43', '丰 44', '革 46', '同人 47', '临 48', '损 49', '节 50', '中孚 51', '归妹 52', '睽 53', '兑 54', '履 55', '泰 56', '大畜 57', '需 58', '小畜 59', '大壮 60', '大有 61', '夬 62','姤 31', '大过 30'
                ],
                contents: [],
                line: [],
                current: 1,
                total: 1
            }
        },
        methods: {
            next () {
                this.current++
                this.load()
            },
            load () {
                const that = this
                const task = pdfjsLib.getDocument({
                    url: '/calendar.pdf'
                })
                task.promise.then(pdf => {
                    this.total = parseInt(pdf._pdfInfo.numPages)
                    // const total = 2
                    // let current = 1
                    
                    const excute = async () => {
                        // initial page
                        const current_page = []
                        const line = []
                        // get content
                        const page = await pdf.getPage(that.current)
                        const content = await page.getTextContent()
                        // format content
                        content.items.forEach(char => {
                            if (line.length == 16) {
                                const new_line = line.splice(0, 16)
                                current_page.push(new_line)
                            }
                            if (char.str.replace(/\s*/g,"") != '') {
                                line.push(char.str)
                            }
                        })
                        that.contents = current_page
                        // save
                        that.save(current_page, that.total)
                        // recycle
                        if (that.current < that.total) {
                            // pause
                            await sleep(5000)
                            that.current++
                            excute()
                        } else {
                            console.log('finished')
                        }
                    }
                    // load
                    excute()
                })
            },
            format (line) {
                return {
                    sequence: parseInt(line[0]),
                    samsara: {hex: parseInt(line[2]), cycle: line[1]},
                    emblem: parseInt(line[3]),
                    session: {hex: parseInt(line[5]), cycle: line[4]},
                    term: parseInt(line[6]),
                    duty: parseInt(line[7]),
                    fate:  {hex: parseInt(line[9]), cycle: line[8]},
                    epoch: {hex: parseInt(line[11]), cycle: line[10]},
                    year: {hex: parseInt(line[13]), cycle: line[12]},
                    gregorian: parseInt(line[14])
                }
            },
            update (line) {
                axios.post(`${API_HOST}/timeline`, line)
            },
            save (book) {
                const that = this
                console.info(this.current, this.total, book.length)
                book.forEach((line, index) => {
                    if (index > 0) {
                        const _line = that.format(line)
                        that.update(_line)
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .clock-container {
        padding: 30px;
    }
    .clock-box {
        border-radius: 100%;
        position: relative;
        width: 640px;
        height: 640px;
        margin: 0 auto;
        .year-pointer {
            position: absolute;
            width: 320px;
            height: 2px;
            background: red;
            left: 320px;
            box-sizing: border-box;
            top: calc((640px - 2px)/2);
            transform-origin: left center;
            z-index: 10;
        }
        .dynasty-pointer {
            position: absolute;
            width: 160px;
            height: 4px;
            background: blue;
            left: 320px;
            box-sizing: border-box;
            top: calc((640px - 4px)/2);
            transform-origin: left center;
            z-index: 9;
        }
    }
    .clock-wrapper {
        border-radius: 100%;
        width: 640px;
        height: 640px;
        position: relative;
        box-sizing: border-box;
        transform: rotate(-96deg);
        transform-origin: center center;
        .clock-degree {
            position: absolute;
            left: 320px;
            width: 320px;
            box-sizing: border-box;
            top: calc((640px - 24px)/2);
            padding: 0 10px;
            text-align: right;
            transform-origin: left center;
            height: 24px;
            line-height: 24px;
        }
    }
</style>
