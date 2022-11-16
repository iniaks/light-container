<template>
    <div v-if="letter.isWrap"></div>
    <!-- <div style="padding: 100px"> -->
    <div class="letter-container" v-else>
        <span v-if="!letter.isHide" class="letter-context">{{letter.char}}</span>
        <span v-else @mousedown="active" class="letter-context" :style="{borderColor: '#333', color: letter.context == letter.char || letter.context == '' ? '#333' : 'red'}">
            {{letter.context ? letter.context : '?' }}
        </span>

        <div class="disk-wrapper" v-if="toggle && letter.isHide" @mouseup="complete">
            <div class="disk-container">
                <div class="disk-center"></div>
                
                <div class="disk-item" v-for="(char, index) in list" :key="`char-${index}`"
                :style="{transform: `rotate(${45 * index}deg) skewX(45deg)`}">
                </div>
                
                <div class="disk-item__option" v-for="(char, index) in list" :key="`option-${index}`"
                :style="{transform: `rotate(${45 * index + 45/2}deg)`}">
                    <div class="disk-item__option_text" :style="{transform: `rotate(${-45 * index - 45/2}deg)`}">{{char}}</div>
                </div>
                
                <div class="disk-item mask" v-for="(char, index) in list" :key="`mask-${index}`"
                :style="{transform: `rotate(${45 * index}deg) skewX(45deg)`}"
                @mouseup="choose(index)">
                </div>
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>

<script>
    export default {
        props: ['book', 'letter'],
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
                while (this.list.length < 8) {
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
        user-select: none;
        display: inline-block;
        .letter-context {
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            border-bottom: 1px solid transparent;
            display: inline-block;
        }
    }
    .disk-wrapper {
        position: absolute;
        left: -40px;
        top: -40px;
        opacity: 1;
        z-index: 10;
    }
    .disk-container {
        background: #fff;
        width: 100px;
        height: 100px;
        box-sizing: border-box;
        border-radius: 100%;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        .disk-center {
            position: absolute;
            left: 30px;
            top: 30px;
            width: 40px;
            height: 40px;
            background: #fff;
            z-index: 100;
            border-radius: 100%;
        }
        .disk-item {
            position: absolute;
            left: 50px;
            top: 50px;
            width: 50px;
            height: 50px;
            box-sizing: border-box;
            transform-origin: left top;
            background: #eee;
            transition: all .3s ease;
            border: 1px solid #fff;
            &.mask {
                z-index: 99;
                opacity: 0.3;
                &:hover {
                    opacity: 0;
                }
            }
        }
        .disk-item__option {
            position: absolute;
            left: 50px;
            top: calc(50px - 10px);
            width: 50px;
            height: 20px;
            padding-right: 6px;
            box-sizing: border-box;
            transform-origin: left center;
            transition: all .3s ease;
            font-size: 11pt;
            z-index: 98;
            overflow: hidden;
            line-height: 20px;
            .disk-item__option_text {
                float: right;
            }
        }
    }
</style>
