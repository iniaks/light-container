<template>
    <div>
        <div class="content-item"
        v-for="(chapter, index) in branch"
        :key="`chapter-${index}`">
            <div @click="read(chapter)">{{chapter.name}}</div>

            <div v-if="chapter.type == 'chapter'" class="sub-contents">
                <book-chapters :branch='chapter.contents'/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'book-chapters',
        props: ['branch'],
        methods: {
            read (chapter) {
                if (chapter.type == 'article') {
                    window.open(`/reading?urn=${chapter.urn}`)
                }
            }
        }
    }
</script>