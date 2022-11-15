<template>
    <div>
        <span style="opacity: 0" @mousedown="active" @mouseup="complete">卦</span>

        <div class="disk-container" v-if="toggle" @mouseup="complete">
            <div class="disk-item" v-for="(char, index) in list" :key="`char-${index}`">
                {{char}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['letter'],
        data () {
            return {
                toggle: true,
                list: ['乾', '坎', '艮', '震', '巽', '离', '坤', '兑']
            }
        },
        methods: {
            active () {
                this.toggle = true
            },
            complete () {
                this.toggle = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .disk-container {
        background: #fff;
        position: absolute;
        top: 100%;
        left: -81px;
        z-index: 99;
        width: 102px;
        padding: 4px;
        .disk-item {
            float: left;
            padding: 4px;
        }
    }
</style>
