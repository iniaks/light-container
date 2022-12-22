<template>
    <div>
        <div class="disk-container">
            <div class="disk-item" v-for="(char, index) in list" :key="`letter-${index}`">
                <span style="font-size: 10pt;color: #999">{{keyboards[index].replace("Key", '')}}</span>
                {{char}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['answer', 'book', 'hides'],
        data () {
            return {
                reading: false,
                list: [],
                keyboards: ['KeyQ', 'KeyW', 'KeyE', 'KeyR']
            }
        },
        methods: {
            random (min, max) {
                return Math.floor(Math.random() * (max - min)) + min
            },
            generate () {
                const map_index = this.hides[this.answer.current]
                this.list = [this.book[map_index].char]
                const blanks = this.book.filter(item => item.isHide).map(item => {
                    return item.char
                })
                while (this.list.length < 4) {
                    const index = this.random(0, blanks.length)
                    const char = blanks[index]
                    if (this.list.indexOf(char) < 0) this.list.push(char)
                }
                // console.info(map_index, this.list)
                this.shuffle()
            },
            shuffle () {
                const res = []
                while (this.list.length > 0) {
                    let index = Math.floor(Math.random() * this.list.length)
                    res.push(this.list[index])
                    this.list.splice(index, 1)
                }
                this.list = Object.assign([], res)
            },
            choose (index) {
                // console.log(index)
                const map_index = this.hides[this.answer.current]
                this.book[map_index].context = this.list[index]
                if (this.book[map_index].context == this.book[map_index].char) {
                    if (this.answer.current < this.hides.length - 1) {
                        this.answer.current++
                        this.generate()
                    } else {
                        this.reading = false
                        this.list = []
                        this.$emit('complete')
                    }
                }
            },
            start () {
                this.reading = true
                this.generate()
            }
        },
        mounted () {
            const that = this
            document.body.addEventListener('keydown', e => {
                if (e.code == 'Space' && !that.reading) {
                    that.start()
                }
                const index = that.keyboards.indexOf(e.code)
                // console.info(e.code, index)
                if (index >= 0 && that.reading) {
                    that.choose(index)
                }
            })
        }
    }
</script>

<style lang="less" scoped>
    .disk-container {
        overflow: hidden;
        .disk-item {
            font-size: 15pt;
            border-radius: 4px;
            border: 1px solid #eee;
            margin: 10px;
            padding: 5px 15px;
            float: left;
        }
    }
</style>
