<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('partner:add')">添加
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
      <el-table-column align="center" prop="exampleName" label="案例名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="exampleBrief" label="案例简介" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="案例logo" width="270px">
        <template slot-scope="scope">
          <img :src="'/api'+scope.row.examplePicture" style="width: 170px">
          <!--          <span>{{scope.row.createTime}}</span>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('partner:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removePartner(scope.$index)" v-if="hasPerm('partner:delete')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempExample" label-position="left" label-width="150px"
               style='width: 500px; margin-left:50px;' enctype="multipart/form-data">
        <el-form-item label="案例名称">
          <el-input type="text" v-model="tempExample.exampleName">
          </el-input>
        </el-form-item>
        <el-form-item label="案例图片">
          <el-upload
            :multiple="false"
            :show-file-list="true"
            :on-success="handleImageSuccess"
            class="image-uploader"
            drag
            action="/api/admin/picture/example/"

            :auto-upload="true"
            :with-credentials="true"
          >
<!--            action="/api/picture/example/"-->
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <el-input type="text" v-model="tempExample.examplePicture" v-if="false"/>
        </el-form-item>
        <el-form-item label="案例简介">
          <el-input type="textarea" v-model="tempExample.exampleBrief">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createPartner">创 建</el-button>
        <el-button type="primary" v-else @click="updatePartner">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "example",
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
                    create: '添加案例'
                },
                tempExample: {
                    exampleId: "",
                    exampleName: "",
                    examplePicture:"",
                    exampleBrief:""
                },
            }
        },
        created() {
            this.getList();
        },
        computed: {
            imageUrl() {
                return this.value
            }
        },
        methods: {
            rmImage() {
                this.emitInput('')
            },
            emitInput(val) {
                this.$emit('input', val)
            },
            handleImageSuccess(res,filelist) {
                // this.emitInput(this.tempUrl)
                this.tempExample.examplePicture=res.url
            },
            beforeUpload(file) {
                let fd=new FormData();
                fd.append('file',file);
                this.api({
                    url: "/picture/",
                    method: "post",
                    data: fd,
                }).then(res =>{
                    this.tempExample.examplePicture=res.url;
                }).catch(e =>{

                }).finally(res =>{
                    this.tempExample.examplePicture=res;
                })

            },

            getList() {
                //查询列表
                this.listLoading = true;
                this.api({
                    url: "/examples"+"/resource/"+this.listQuery.pageNum+"/"+this.listQuery.pageSize,
                    method: "get",
                    // params: this.listQuery
                }).then(data => {
                    this.listLoading = false;
                    this.list = data.list;
                    this.totalCount = data.totalCount;
                })
            },
            handleSizeChange(val) {
                //改变每页数量
                this.listQuery.pageRow = val;
                this.handleFilter();
            },
            handleCurrentChange(val) {
                //改变页码
                this.listQuery.pageNum = val;
                this.getList();
            },
            getIndex($index) {
                //表格序号
                return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
            },
            showCreate() {
                //显示新增对话框
                this.tempExample.exampleName = "";
                this.tempExample.partnerLink = "";
                this.tempExample.examplePicture = "";
                this.dialogStatus = "create";
                this.dialogFormVisible = true
            },
            showUpdate($index) {
                //显示修改对话框
                this.tempExample.exampleId = this.list[$index].exampleId;
                this.tempExample.exampleName = this.list[$index].exampleName;
                this.tempExample.exampleBrief = this.list[$index].exampleBrief;
                this.tempExample.examplePicture = this.list[$index].examplePicture;
                this.dialogStatus = "update";
                this.dialogFormVisible = true
            },
            createPartner() {
                this.api({
                    url: "/example",
                    method: "post",
                    data: this.tempExample
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            updatePartner() {
                //修改文章
                this.api({
                    url: "/example",
                    method: "put",
                    data: this.tempExample
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            removePartner($index){
                let _vue = this;
                this.$confirm('确定删除此案例?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    let example = _vue.list[$index];
                    _vue.api({
                        url: "/example/"+example.exampleId,
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

<style scoped>

</style>
