<template>
  <el-container>
    <h2 v-text="tempNews.newsTitle"></h2>

    <div v-html="tempNews.newsContent">
    </div>
    <div v-html="text"></div>
  </el-container>
</template>

<script>
    export default {
        name: "newsdeatil",
        data(){
            return{
                tempNews: {
                    newsId: "",
                    newsTitle: "",
                    newsContent: "",
                    newsType: "",
                    newsPicture:"",
                },
                newsId: '',
                text: '<a onclick=\'alert("xss攻击")\'>链接</a>'

            }
        },
        created() {
            this.getDeatil();
        },
        methods: {
            getDeatil(){
                this.newsId=this.$route.query.newsId;
                this.api({
                    url: '/news/resource/'+this.newsId,
                    method: 'get'
                }).then(data =>{
                    this.tempNews.newsTitle=data.list.newsTitle;
                    this.tempNews.newsContent=data.list.newsContent;
                })
            }
        }
    }
</script>

<style scoped>

</style>
