<template>
    <div>
        <select v-model="current_year">
            <option v-for="index in 5000" :key="`year-${index}`" :value="index - 2500">
                {{index - 2500}}
            </option>
        </select>
        <input v-model="custom_year" placeholder="自定义" @keydown.enter="custom" @keydown.up="browse(-1)" @keydown.down="browse(1)"/>
        <div @click="custom">确定</div>
        <div>
            <div @click="browse(-1)">上一年</div>
            <div @click="browse(1)">下一年</div>
        </div>
        <hr/>
        <div v-if="year_info">
            <span style="margin-right: 30px">元：{{hexes[year_info.samsara.hex]}}</span>
            <span style="margin-right: 30px">会：{{hexes[year_info.session.hex]}}</span>
            <span style="margin-right: 30px">运：{{hexes[year_info.fate.hex]}}</span>
            <span style="margin-right: 30px">世：{{hexes[year_info.epoch.hex]}}</span>
            <span style="margin-right: 30px">年：{{hexes[year_info.year.hex]}}</span>
            <span >{{format(year_info.year.cycle)}}</span>
        </div>
        <time-circle :info="year_info"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'
    import { HEXAGRAM_SEQUENCE, STEMS, ZODIACS } from '@/store/model'
    import TimeCircle from './_circle'

    export default {
        components: {
            TimeCircle
        },
        data () {
            return {
                hexes: HEXAGRAM_SEQUENCE,
                stems: STEMS,
                zodiacs: ZODIACS,
                current_year: 2022,
                custom_year: '',
                year_info: null
            }
        },
        methods: {
            browse (direction) {
                this.current_year += direction
                this.custom_year = this.current_year
                // this.view()
            },
            custom () {
                this.current_year = parseInt(this.custom_year)
            },
            view () {
                const that = this
                axios.get(`${API_HOST}/timeline/year/?year=${this.current_year}`).then(res => {
                    that.year_info = Object.assign({}, res.data.result)
                })
            },
            format (cycle) {
                const nums = cycle.match(/\d+/g)
                // console.log(nums)
                const stem = nums[0]
                const zodiac = nums[1]
                return this.stems[stem-1]+this.zodiacs[zodiac-1]
            }
        },
        mounted () {
            this.view()
            this.custom_year = this.current_year
        },
        watch: {
            'current_year': function() {
                this.view()
            }
        }
    }
</script>