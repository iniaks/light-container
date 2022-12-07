<template>
    <div class="book-container">
        <div class="lib-list" style="flex: 1">
            <div class="book-list">
                <div v-for="(book, index) in list"
                :key="`book-${index}`"
                :class="['book-list__item', book.urn == current_book ? 'active' : '']"
                @click="browse(book.urn)">
                    {{book.title}}
                </div>
            </div>
            <div class="book-pagination">
                <span
                v-for="page in total_page"
                :key="`page-${page}`" v-show="page - current < 10 && page - current > -10"
                @click="view(page)"
                :class="['book-page', page == current ? 'active' : '']">
                    {{page}}
                </span>
            </div>
        </div>
        <div class="content-list" style="flex: 2">
            <div class="content-item"
            v-for="(chapter, index) in contents"
            :key="`chapter-${index}`">
                <div class="main-contents" @click="read(chapter.urn)"
                v-if="chapter.type == 'article'">
                    {{chapter.name}}
                </div>
                <div v-else>{{chapter.name}}</div>

                <div v-if="chapter.type == 'chapter'" class="sub-contents">
                    <div v-for="(article, index) in chapter.contents"
                    :key="`article-${index}`"
                    @click="read(article.urn)">
                        {{article.name}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { API_HOST } from '@/store/config'

    export default {
        data () {
            return {
                current: 0,
                total_page: 0,
                list: [],
                current_book: '',
                contents: []
            }
        },
        methods: {
            init (page) {
                const that = this
                axios.get(`${API_HOST}/reading/books?page=${page}`).then((res => {
                    that.total_page = res.data.total_page
                    that.list = res.data.list
                })).catch(err => {
                    return err
                })
            },
            view (page) {
                this.current = page
                this.init(this.current)
                this.sync()
            },
            browse (book) {
                const that = this
                this.current_book = book
                this.contents = []
                axios.get(`${API_HOST}/reading/contents?urn=${book}`).then((res => {
                    that.contents = res.data.contents
                    that.sync()
                })).catch(err => {
                    return err
                })
            },
            sync () {
                if (this.current != this.$route.query.page || this.current_book != this.$route.query.book) {
                    this.$router.push({name: 'books', query: {
                        page: this.current,
                        book: this.current_book
                    }})
                }
            },
            read (urn) {
                window.open(`/reading?urn=${urn}`)
            }
        },
        mounted () {
            this.current = this.$route.query.page ? this.$route.query.page : 1
            this.init(this.current)
            if (this.$route.query.book) {
                this.current_book = this.$route.query.book
                this.browse(this.current_book)
            }
        }
    }
</script>

<style lang="less" scoped>
    .book-container {
        padding: 15px;
        display: flex;
        height: 100vh;
        overflow: hidden;
        box-sizing: border-box;
        .book-list {
            margin-bottom: 15px;
            .book-list__item {
                cursor: pointer;
                &.active {
                    color: blue;
                }
            }
        }
        .book-pagination {
            .book-page {
                cursor: pointer;
                &.active {
                    color: red;
                }
            }
        }
        .content-list {
            height: 100%;
            box-sizing: border-box;
            overflow: auto;
            .main-contents {
                cursor: pointer;
            }
            .sub-contents {
                cursor: pointer;
                margin-left: 15px;
                margin-bottom: 15px;
            }
        }
    }
</style>
