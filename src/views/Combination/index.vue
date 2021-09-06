<template>
    <div class='container' style='padding-bottom: 100px;'>
        <div>
            卦名： <input v-model="info.name"/>
            <br>
            帛本卦名： <input v-model="info.silk_name"/>
            <br>
            楚简卦名： <input v-model="info.slip_name"/>
            <br>
            卦序：<input v-model="info.order" type='number'/>
        </div>
        <hr>
        <div>
            宫卦：
            <select v-model='info.group'>
                <option v-for='item in trigrams' :key='`group-${item._id}`' :value='item._id'>
                    {{item.name}}宫
                    {{graphs[item.name]}}
                </option>
            </select>
            <br>
            宫位：
            <select v-model='info.group_index'>
                <option v-for='(item, index) in group_names' :key='`group-index-${index}`' :value='index'>
                    {{item}}
                </option>
            </select>
        </div>
        <hr>
        <div>
            上（从）卦：
            <select v-model='info.secondary'>
                <option v-for='item in trigrams' :key='`secondary-${item._id}`' :value='item._id'>
                    {{item.name}}
                    {{graphs[item.name]}}
                </option>
            </select>
        </div>
        <div>
            下（主）卦：
            <select v-model='info.primary'>
                <option v-for='item in trigrams' :key='`primary-${item._id}`' :value='item._id'>
                    {{item.name}}
                    {{graphs[item.name]}}
                </option>
            </select>
        </div>
        <hr>
        <div>
            卦辞：<br>
            <div class='line-item'>
                <div class='line-item__version'>
                    今本：<br>
                    <textarea v-model='info.description' rows="4"/>
                </div>
                <div class='line-item__version'>
                    帛本：<br>
                    <textarea v-model='info.silk_description' rows="4"/>
                </div>
                <div class='line-item__version'>
                    楚简：<br>
                    <textarea v-model='info.slip_description' rows="4"/>
                </div>
                <div class='line-item__version'>
                    卦辞释义：<br>
                    <textarea v-model='info.description_translation' rows="4"/>
                </div>
            </div>
        </div>
        <hr>
        <div>
            爻辞：<br>
            <div v-for='(line, index) in line_texts' :key='`text-${index}`' class='line-item'>
                <div class='line-item__version'>
                    今本：<br>
                    <textarea v-model='line.stable' cols='30' rows="4"/>
                </div>
                <div class='line-item__version'>
                    帛本：<br>
                    <textarea v-model='line.silk' cols='30' rows="4"/>
                </div>
                <div class='line-item__version'>
                    楚简：<br>
                    <textarea v-model='line.slip' cols='30' rows="4"/>
                </div>
                <div class='line-item__version'>
                    释义：<br>
                    <textarea v-model='line.translation' cols='30' rows="4"/>
                </div>
            </div>
        </div>
        <div>
            注释：<br>
            <textarea v-model='info.notes' cols="30" rows='6'/>
        </div>

        <div>
            <button @click.prevent='save'>保存</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'

    export default {
        data () {
            return {
                trigrams: [],
                info: {
                    order: '',
                    group: '',
                    group_index: '',
                    name: '',
                    silk_name: '',
                    slip_name: '',
                    secondary: '',
                    primary: '',
                    description: '',
                    notes: '',
                    silk_description: '',
                    slip_description: '',
                    description_translation: ''
                },
                line_texts: [
                    { silk: '', slip: '', stable: '', translation: '' },
                    { silk: '', slip: '', stable: '', translation: '' },
                    { silk: '', slip: '', stable: '', translation: '' },
                    { silk: '', slip: '', stable: '', translation: '' },
                    { silk: '', slip: '', stable: '', translation: '' },
                    { silk: '', slip: '', stable: '', translation: '' },
                    { silk: '', slip: '', stable: '', translation: '' }
                ],
                graphs: {
                    '乾': '☰',
                    '坎': '☵',
                    '艮': '☶',
                    '震': '☳',
                    '巽': '☴',
                    '离': '☲',
                    '坤': '☷',
                    '兑': '☱'
                },
                group_names: [
                    '不变',
                    '一变',
                    '二变',
                    '三变',
                    '四变',
                    '五变',
                    '游魂',
                    '归魂'
                ]
            }
        },
        methods: {
            init () {
                const that = this
                axios.get(`${API_HOST}/diagram/trigrams`).then((res => {
                    that.trigrams = res.data.result
                })).catch(err => {
                    return err
                })
            },
            update () {
                const that = this
                axios.get(`${API_HOST}/diagram/combination?name=${this.$route.params.name}`).then((res => {
                    const detail = res.data.result
                    for (let prop in that.info) {
                        that.info[prop] = detail[prop] !== undefined ? detail[prop] : ''
                    }
                    
                    that.line_texts.forEach((line, index) => {
                        for (let prop in line) {
                            if (prop != 'translation') {
                                if (detail.lines[prop + '_version'][index]) line[prop] = detail.lines[prop + '_version'][index]
                            } else {
                                line[prop] = detail.translations[index] ? detail.translations[index] : ''
                            }
                        }
                    })
                })).catch(err => {
                    return err
                })
            },
            save () {
                const that = this
                const lines = {
                    silk_version: [],
                    slip_version: [],
                    stable_version: []
                }
                const translations = []
                this.line_texts.forEach((line, index) => {
                    for (let prop in line) {
                        if (prop == 'translation') translations[index] = line[prop]
                        else lines[prop + '_version'][index] = line[prop]
                    }
                })
                const data = {
                    ...this.info,
                    lines,
                    translations: translations
                }
                axios.post('http://local.api.spider.com/diagram/combination', data).then(() => {
                    // that.update()
                    that.$router.push({name: 'home'})
                }).catch(err => {
                    return err
                })
            }
        },
        mounted () {
            this.init()
            if (this.$route.name == 'create') {
                this.info.group = this.$route.params.group
            } else {
                this.update()
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        font-family: 'STKaiti', 'BiauKai', 'NSimSun' !important;
    }
    .line-item {
        display: flex;
        align-items: flex-start;
        .line-item__version {
            margin-right: 10px;
        }
    }
</style>

