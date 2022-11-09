<template>
    <div class="clock-container">
        <div class="clock-box">        
            <div class="pointers">
                <div
                class="dynasty-pointer"
                :style="{transform: `rotate(${year_degree}deg)`,width: '240px', background: 'red'}"
                v-if="info"/>
                <div
                class="dynasty-pointer"
                :style="{transform: `rotate(${epoch_degree}deg)`, width: '120px', background: 'grey', opacity: '0.5'}"
                v-if="info"/>
                <div
                class="dynasty-pointer"
                :style="{transform: `rotate(${fate_degree}deg)`, width: '160px', background: 'blue', opacity: '0.5'}"
                v-if="info"/>
            </div>
            <div class="clock-wrapper" style="transform:rotate(-75deg);z-index: 9">
                <div
                class="clock-degree"
                v-for="(item, index) in cycles"
                :key="`circle-${index}`"
                :style="{transform: `rotate(${index*6}deg)`, width: '320px'}">
                    {{item}}
                    {{hexes[item]}}
                </div>
                <div class="pointers">
                    <div
                    class="clock-pointer"
                    v-for="index in 60"
                    :key="`year-pointer-${index}`"
                    :style="{transform: `rotate(${(index-1)*6+3}deg) translateX(250px)`}"/>
                </div>
            </div>

            <div class="clock-wrapper" style="transform:rotate(105deg);z-index: 10">
                <div
                class="clock-degree"
                v-for="(item, index) in zodiacs"
                :key="`zodiac-${index}`"
                :style="{transform: `rotate(${index*30}deg)`, width: '160px'}">
                    {{item}}
                </div>
                <div class="pointers">
                    <div
                    class="clock-pointer"
                    v-for="index in 12"
                    :key="`zodiac-pointer-${index}`"
                    :style="{transform: `rotate(${(index-1)*30+15}deg) translateX(90px)`}"/>
                </div>
            </div>

            <div class="clock-wrapper" style="transform:rotate(-225deg);z-index: 11;">
                <div
                class="clock-degree"
                v-for="(item, index) in pillars"
                :key="`pillar-${index}`"
                :style="{transform: `rotate(${index*90}deg)`, width: '90px'}">
                    {{hexes[item]}}
                </div>
                <div class="pointers">
                    <div
                    class="clock-pointer"
                    v-for="index in 4"
                    :key="`pillar-pointer-${index}`"
                    :style="{transform: `rotate(${(index-1)*90+45}deg) translateX(30px)`}"/>
                </div>
            </div>

            <div class="clock-wrapper" style="transform:rotate(-270deg);z-index: 11;">
                <div
                class="clock-degree"
                v-for="(item, index) in terms"
                :key="`pillar-${index}`"
                :style="{transform: `rotate(${index*15+7.5}deg)`, width: '220px'}">
                    {{item}}
                </div>
                <div class="pointers">
                    <div
                    class="clock-pointer"
                    v-for="index in 24"
                    :key="`pillar-pointer-${index}`"
                    :style="{transform: `rotate(${(index-1)*15}deg) translateX(160px)`}"/>
                </div>
            </div>
        </div>

        <div class="sqaure-box" v-if="info">
            <div
            v-for="(hex, index) in geo_hexes" :key="`square-${index}`"
            :class="['square-box__item', 63-index == info.year.hex ? 'year' : '']">
                {{hex}}
            </div>
        </div>
    </div>
</template>

<script>
    import { HEXAGRAM_SEQUENCE, CIRCLE_SEQUENCE, ZODIACS, PILLARS, TERMS } from '@/store/model'

    export default {
        props: ['info'],
        data () {
            return {
                hexes: HEXAGRAM_SEQUENCE,
                cycles: CIRCLE_SEQUENCE,
                zodiacs: ZODIACS,
                pillars: PILLARS,
                terms: TERMS
            }
        },
        computed: {
            geo_hexes: function () {
                const hexes = []
                const length = this.hexes.length
                for (let i = length-1;i>=0;i--) {
                    hexes.push(this.hexes[i])
                }
                return hexes
            },
            year_degree () {
                if (this.info) {
                    const hex = parseInt(this.info.year.hex)
                    return (this.cycles.indexOf(hex)-13)*6+3
                } else {
                   return 0
                }
            },
            epoch_degree () {
                if (this.info) {
                    const hex = parseInt(this.info.epoch.hex)
                    return (this.cycles.indexOf(hex)-13)*6+3
                } else {
                   return 0
                }
            },
            fate_degree () {
                if (this.info) {
                    const hex = parseInt(this.info.fate.hex)
                    return (this.cycles.indexOf(hex)-13)*6+3
                } else {
                    return 0
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .clock-container {
        padding: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between
    }
    .sqaure-box {
        padding: 30px;
        .square-box__item {
            width: 64px;
            height: 64px;
            border: 1px solid #eee;
            margin-right: -1px;
            margin-bottom: -1px;
            line-height: 64px;
            float: left;
            text-align: center;
            &:nth-child(8n+1) {
                clear: both;
            }
            &.year {
                background: red;
                color: #fff;
            }
            &.fate {
                background: blue;
                color: #fff;
            }
            &.epoch {
                background: #eee;
            }
        }
    }
    .clock-box {
        border-radius: 100%;
        position: relative;
        width: 640px;
        height: 640px;
        .clock-pointer {
            position: absolute;
            height: 1px;
            background: #333;
            width: 60px;
            left: 320px;
            box-sizing: border-box;
            top: calc((640px - 1px)/2);
            transform-origin: left center;
            z-index: 1;
        }
        .dynasty-pointer {
            position: absolute;
            height: 1px;
            left: 320px;
            box-sizing: border-box;
            top: calc((640px - 1px)/2);
            transform-origin: left center;
            z-index: 20;
        }
    }
    .clock-wrapper {
        border-radius: 100%;
        width: 640px;
        height: 640px;
        position: absolute;
        left: 0;
        top: 0;
        box-sizing: border-box;
        transform-origin: center center;
        .clock-degree {
            position: absolute;
            left: 320px;
            box-sizing: border-box;
            top: calc((640px - 24px)/2);
            padding: 0 10px;
            text-align: right;
            transform-origin: left center;
            height: 24px;
            line-height: 24px;
            z-index: 10;
        }
    }
</style>
