<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" >添加
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
      <el-table-column align="center" prop="pictureName" label="题目" style="width: 60px;"/>
      <el-table-column align="center" label="图片" style="width: 60px;">
        <template slot-scope="scope">
          <img :src="'/api'+scope.row.pictureLink" style="width: 170px;height: 80px">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="pictureTitle" label="文章标题" style="width: 60px;"/>
      <el-table-column align="center" prop="pictureRedirect" label="文章链接" style="width: 60px;"/>
      <el-table-column align="center" label="创建时间" prop="pictureCreattime" width="270"/>
      <el-table-column align="center" label="管理" width="400" >
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeSlideShowPicture(scope.$index)" >删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible":fullscreen="true">
      <el-form class="small-space" :model="tempPicture" label-position="left" label-width="80px"
               style='width: 1800px; margin-left:50px;'>
        <el-form-item label="轮播图名" required>
          <el-input type="text" v-model="tempPicture.pictureName">
          </el-input>
        </el-form-item>
        <el-form-item label="上传图片" required>
          <el-upload
            :multiple="false"
            :show-file-list="true"
            :on-success="handleImageSuccess"
            class="image-uploader"
            drag
            action="/api/admin/picture/slideShowPicture/"
            :auto-upload="true"
            :with-credentials="true"
          >
<!--            action="/api/picture/slideShowPicture/"-->
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <el-input type="text" v-model="tempPicture.pictureLink" v-if="false"/>
        </el-form-item>
        <el-form-item label="超链接" required>
          <el-input type="text" v-model="tempPicture.pictureRedirect">
          </el-input>
        </el-form-item>
        <el-form-item label="文章标题" required>
          <el-input type="text" v-model="tempPicture.pictureTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="文章内容" required>
          <editoritem v-model="tempPicture.pictureContent"></editoritem>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createSlideShowPicture">创 建</el-button>
        <el-button type="primary" v-else @click="updateSlideShowPicture">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import editoritem from '../../../components/wangeditor/Editor'
    export default {
        name: 'slideShowPicture',
        components: {editoritem},
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
                    create: '创建轮播图'
                },
                tempPicture: {
                    pictureId: "",
                    pictureName: "",
                    pictureLink: "",
                    pictureTitle: "",
                    pictureRedirect:"",
                    pictureContent:"",
                    pictureCreattime:"",
                },
                editorContent: ''
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                this.api({
                    url: "/slideShowPicture/resource/"+this.listQuery.pageNum+"/"+this.listQuery.pageSize ,
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
                this.tempPicture.pictureName = "";
                this.tempPicture.pictureContent = "";
                this.tempPicture.pictureLink = "";
                this.tempPicture.pictureContent = "";
                this.tempPicture.pictureCreattime = "";
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            showUpdate($index) {
                //显示修改对话框
                    this.tempPicture.pictureId = this.list[$index].pictureId;
                    this.tempPicture.pictureName = this.list[$index].pictureName;
                    this.tempPicture.pictureContent = this.list[$index].pictureContent;
                    this.tempPicture.pictureLink = this.list[$index].pictureLink;
                    this.tempPicture.pictureTitle = this.list[$index].pictureTitle;
                    this.tempPicture.pictureRedirect = this.list[$index].pictureRedirect;
                    this.tempPicture.pictureCreattime = this.list[$index].pictureCreattime;
                    this.dialogStatus = "update";
                    this.dialogFormVisible = true

            },
            createSlideShowPicture() {
                //保存新文章
                this.api({
                    url: "/slideShowPicture",
                    method: "post",
                    data: this.tempPicture
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            updateSlideShowPicture() {
                //修改文章
                this.api({
                    url: "/slideShowPicture",
                    method: "put",
                    data: this.tempPicture
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            removeSlideShowPicture($index){
                let _vue = this;
                this.$confirm('确定删除此轮播图?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    let picture = _vue.list[$index];
                    _vue.api({
                        url: "/slideShowPicture/"+picture.pictureId,
                        method: "delete",
                    }).then(() => {
                        _vue.getList()
                    }).catch(() => {
                        _vue.$message.error("删除失败")
                    })
                })
            },
            rmImage() {
                this.emitInput('')
            },
            emitInput(val) {
                this.$emit('input', val)
            },
            handleImageSuccess(res,filelist) {
                // this.emitInput(this.tempUrl)
                this.tempPicture.pictureLink=res.url
            },
        }
    }
</script>
