<template>
    <div v-if="letter.isWrap"></div>
    <!-- <div style="padding: 100px"> -->
    <div class="letter-container" v-else :style="{borderBottomColor: letter.isHide ? ( lindex == current ? 'blue' : '#333') : ''}">
        <span v-if="!letter.isHide" class="letter-context">{{letter.char}}</span>
        <span v-else class="letter-context" :style="{color: letter.context == letter.char || letter.context == '' ? '#333' : 'red'}" @click="active">
            {{letter.context ? letter.context : '' }}
        </span>
    </div>
</template>

<script>
    export default {
        props: ['lindex', 'current', 'book', 'letter'],
        data () {
            return {
                toggle: false,
                list: []
            }
        },
        methods: {
            random (min, max) {
                return Math.floor(Math.random() * (max - min)) + min
            },
            generate () {
                this.list = [this.letter.char]
                const blanks = this.book.filter(item => item.isHide).map(item => {
                    return item.char
                })
                while (this.list.length < 4) {
                    const index = this.random(0, blanks.length)
                    const char = blanks[index]
                    if (this.list.indexOf(char) < 0) this.list.push(char)
                }
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
            active () {
                if (this.list.length <= 0) this.generate()
                this.toggle = true
            },
            complete () {
                this.toggle = false
            },
            choose (index) {
                // console.log(index)
                this.letter.context = this.list[index]
                this.$emit('choose')
            }
        }
    }
</script>

<style lang="less" scoped>
    .letter-container{
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        border-bottom: 1px solid transparent;
        .letter-context {
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
</style>
