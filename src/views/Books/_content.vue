<template>
    <div>
        <div class="content-item"
        v-for="(chapter, index) in branch"
        :key="`chapter-${index}`">
            <div>
                <a :href="`/reading?urn=${chapter.urn}`" target="_blank" v-if="chapter.type == 'article'">{{chapter.name}}</a>
                <span v-else>{{chapter.name}}</span>
            </div>

            <div v-if="chapter.type == 'chapter'" class="sub-contents">
                <book-chapters :branch='chapter.contents'/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'book-chapters',
        props: ['branch']
    }
</script>