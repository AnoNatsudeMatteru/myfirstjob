<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('news:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="newsTitle" label="题目" style="width: 60px;"/>
      <el-table-column align="center" label="类型" style="width: 60px;">
        <template slot-scope="scope">
          <el-tag type="warning" v-text="'公司新闻'" v-if="scope.row.newsType===1" />
          <el-tag type="primary" v-text="'行业新闻'" v-else-if="scope.row.newsType===2" />
          <el-tag type="success" v-text="'通知公告'" v-else />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="270">
        <template slot-scope="scope">
          <span>{{scope.row.newsTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="400" v-if="hasPerm('news:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="success" icon="edit" @click="showDetail(scope.$index)">详情</el-button>
          <el-button type="danger" icon="delete" @click="removeNews(scope.$index)" v-if="hasPerm('news:delete')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempNews" label-position="left" label-width="80px"
               style='width: 600px; margin-left:50px;'>
        <el-form-item label="新闻标题" required>
          <el-input type="text" v-model="tempNews.newsTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="新闻内容" required>
          <el-input type="textarea" v-model="tempNews.newsContent">
          </el-input>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-radio-group v-model="tempNews.newsType">
            <el-radio label="1" border>公司新闻</el-radio>
            <el-radio label="2" border>行业新闻</el-radio>
            <el-radio label="3" border>通知公告</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createNews">创 建</el-button>
        <el-button type="primary" v-else @click="updateNews">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                totalCount: 0, //分页组件--数据总条数
                list: [],//表格的数据
                listLoading: false,//数据加载等待动画
                listQuery: {
                    pageNum: 1,//页码
                    pageSize: 50,//每页条数
                },
                dialogStatus: 'create',
                dialogFormVisible: false,
                textMap: {
                    update: '编辑',
                    create: '创建新闻'
                },
                tempNews: {
                    newsId: "",
                    newsTitle: "",
                    newsContent: "",
                    newsType: "",
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                this.api({
                    url: "/news/"+this.listQuery.pageNum+"/"+this.listQuery.pageSize ,
                    method: "get",
                    //params: this.listQuery
                }).then(data => {
                    this.listLoading = false;
                    this.list = data.list;
                    this.totalCount = data.totalCount;
                })
            },
            handleSizeChange(val) {
                //改变每页数量
                this.listQuery.pageSize = val;
                this.handleFilter();
            },
            handleCurrentChange(val) {
                //改变页码
                this.listQuery.pageNum = val
                this.getList();
            },
            handleFilter() {
                //查询事件
                this.listQuery.pageNum = 1
                this.getList()
            },
            getIndex($index) {
                //表格序号
                return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + $index + 1
            },
            showCreate() {
                //显示新增对话框
                this.tempNews.newsTitle = "";
                this.tempNews.newsId = "";
                this.tempNews.newsContent = "";
                this.tempNews.newsType = "";
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            showUpdate($index) {
                //显示修改对话框
                this.tempNews.newsId = this.list[$index].newsId;
                this.tempNews.newsTitle = this.list[$index].newsTitle;
                this.tempNews.newsContent = this.list[$index].newsContent;
                this.tempNews.newsType = this.list[$index].newsType;
                this.dialogStatus = "update";
                this.dialogFormVisible = true
            },
            createNews() {
                //保存新文章
                this.api({
                    url: "/news",
                    method: "post",
                    data: this.tempNews
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            updateNews() {
                //修改文章
                this.api({
                    url: "/news",
                    method: "put",
                    data: this.tempNews
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            removeNews($index){
                let _vue = this;
                this.$confirm('确定删除此新闻?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    let news = _vue.list[$index];
                    _vue.api({
                        url: "/news/"+news.newsId,
                        method: "delete",
                    }).then(() => {
                        _vue.getList()
                    }).catch(() => {
                        _vue.$message.error("删除失败")
                    })
                })
            },
        }
    }
</script>
