<template>
  <el-main>
    <el-tabs v-model="activeName" @click="handleClick">
      <el-tab-pane label="公司简介" name="first" lazy="true">
        <editoritem v-model="brief.briefContent"></editoritem>
        <p>&nbsp;</p>
        <el-button type="primary" style="float: right" @click="postBrief" v-if="hasPerm('basicinfo:update')">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="公司优势" name="second">
        <editoritem v-model="advantage.advantageContent"></editoritem>
        <p>&nbsp;</p>
        <el-button type="primary" style="float: right" @click="postAdvantage" v-if="hasPerm('basicinfo:update')">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="公司文化" name="third">
        <editoritem v-model="culture.cultureContent"></editoritem>
        <p>&nbsp;</p>
        <el-button type="primary" style="float: right" @click="postCulture" v-if="hasPerm('basicinfo:update')">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="发展历史" name="fourth">
        <div class="filter-container">
          <el-form>
            <el-form-item>
              <el-button type="primary" icon="plus" @click="showCreateHistory" v-if="hasPerm('basicinfo:add')">添加
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="listHistory" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
                  highlight-current-row>
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index)"> </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="historyTitle" label="事件名称" style="width: 60px;"/>
          <el-table-column align="center" prop="historyContent" label="事件内容" style="width: 60px;"/>
          <el-table-column align="center" label="发生时间" width="270">
            <template slot-scope="scope">
              <span>{{scope.row.historyDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="管理" width="400">
            <template slot-scope="scope">
              <el-button type="primary" icon="edit" @click="showUpdateHistory(scope.$index)" v-if="hasPerm('basicinfo:update')">修改</el-button>
              <el-button type="danger" icon="delete" @click="deleteHistory(scope.$index)" v-if="hasPerm('basicinfo:delete')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="textMapHistory[dialogStatusHistory]" :visible.sync="dialogFormVisibleHistory">
          <el-form class="small-space" :model="history" label-position="left" label-width="80px"
                   style='width: 600px; margin-left:50px;'>
            <el-form-item label="事件名称" required>
              <el-input type="text" v-model="history.historyTitle">
              </el-input>
            </el-form-item>
            <el-form-item label="事件内容" required>
              <el-input type="textarea" v-model="history.historyContent">
              </el-input>
            </el-form-item>
            <el-form-item label="发生时间">
              <el-date-picker
                v-model="history.historyDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleHistory = false">取 消</el-button>
            <el-button v-if="dialogStatusHistory=='create'" type="success" @click="postHistory">创 建</el-button>
            <el-button type="primary" v-else @click="updateHistory">修 改</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="公司荣誉" name="fifth">
        <div class="filter-container">
          <el-form>
            <el-form-item>
              <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('basicinfo:add')">添加
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="listHonor" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
                  highlight-current-row>
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index)"> </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="honorName" label="荣誉名称" style="width: 60px;"/>
          <el-table-column align="center" label="荣誉照片" style="width: 60px;">
            <template slot-scope="scope">
              <img :src="'/api'+scope.row.honorPicture" style="width: 170px">
            </template>
          </el-table-column>
          <el-table-column align="center" label="获奖时间" width="270">
            <template slot-scope="scope">
              <span>{{scope.row.honorTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="管理" width="400">
            <template slot-scope="scope">
              <el-button type="primary" icon="edit" @click="showUpdateHonor(scope.$index)" v-if="hasPerm('basicinfo:update')">修改</el-button>
              <el-button type="danger" icon="delete" @click="deleteHonor(scope.$index)" v-if="hasPerm('basicinfo:delete')">删除</el-button>
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
        <el-dialog :title="textMapHonor[dialogStatusHonor]" :visible.sync="dialogFormVisibleHonor">
          <el-form class="small-space" :model="tempHonor" label-position="left" label-width="150px"
                   style='width: 500px; margin-left:50px;' enctype="multipart/form-data">
            <el-form-item label="荣誉名称">
              <el-input type="text" v-model="tempHonor.honorName">
              </el-input>
            </el-form-item>
            <el-form-item label="荣誉照片">
              <el-upload
                :multiple="false"
                :show-file-list="true"
                :on-success="handleImageSuccess"
                class="image-uploader"
                drag
                action="/api/picture/honor/"
                :auto-upload="true"
                :with-credentials="true"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
              <el-input type="text" v-model="tempHonor.honorPicture" v-if="false"/>
            </el-form-item>
            <el-form-item label="获得时间">
              <el-date-picker
                v-model="tempHonor.honorTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form >
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleHonor = false">取 消</el-button>
            <el-button v-if="dialogStatusHonor=='create'" type="success" @click="creatHonor">创 建</el-button>
            <el-button type="primary" v-else @click="updateHonor">修 改</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="基础信息" name="sixth">
        <el-form class="small-space" :model="basicinfo" label-position="left" label-width="150px"
                 style='width: 500px; margin-left:50px;' enctype="multipart/form-data">
          <el-form-item label="公司地址">
            <el-input type="text" v-model="basicinfo.basicinfoAddress"/>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input type="text" v-model="basicinfo.basicinfoPhone"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input type="text" v-model="basicinfo.basicinfoEmail"/>
          </el-form-item>
        </el-form>
<!--        <p>&nbsp;</p>-->
        <el-button type="primary" style="margin-left:50px " @click="postBasicInfo" v-if="hasPerm('basicinfo:update')">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
  import editoritem from '../../../components/wangeditor/Editor'
    export default {
        name: "basicinfo",
        comments: {editoritem},
        data(){
            return{
                activeName: 'first',
                listLoading: false,//数据加载等待动画
                advantage:{
                  advantageId:"",
                  advantageContent:"",
                },
                basicinfo:{
                   basicinfoId:"",
                   basicinfoAddress:"",
                   basicinfoPhone:"",
                   basicinfoEmail:"",
                },
                brief:{
                    briefId:"",
                    briefContent:"",
                },
                culture:{
                    cultureId: "",
                    cultureContent: "",
                    culturePicture: "",
                },
                history:{
                    historyId:"",
                    historyContent:"",
                    historyTitle:"",
                    historyDate:"",
                },
                listHistory:[],
                listHonor:[],
                tempHonor:{
                    honorId:"",
                    honorName:"",
                    honorPicture:"",
                    honorTime:"",
                },
                dialogStatusHistory: 'create',
                dialogFormVisibleHistory: false,
                dialogStatusHonor: 'create',
                dialogFormVisibleHonor: false,
                listQuery: {
                    pageNum: 1,//页码
                    pageSize: 50,//每页条数
                },
                totalCount: 0, //分页组件--数据总条数
                textMapHonor: {
                    update: '编辑',
                    create: '添加荣誉'
                },
                textMapHistory: {
                    update: '编辑',
                    create: '添加事件'
                },
            }
        },
        created() {
            this.getAdvantage();
            this.getHistory();
            this.getBrief();
            this.getCulture();
            this.getBasicInfo();
            this.getHonor();
        }, computed: {
            imageUrl() {
                return this.value
            }
        },
        methods:{
            rmImage() {
                this.emitInput('')
            },
            emitInput(val) {
                this.$emit('input', val)
            },
            handleImageSuccess(res,filelist) {
                // this.emitInput(this.tempUrl)
                this.tempHonor.honorPicture=res.url
            },
            handleClick(tab, event) {
                console.log(tab, event);
                console.log(this.activeName)
            },
            getAdvantage(){
                this.listLoading=true;
                this.api({
                    url:"/advantage/resource",
                    method:"get",
                }).then(data =>{
                    this.listLoading=false;
                    this.advantage.advantageContent=data.list.advantageContent;
                    this.advantage.advantageId=data.list.advantageId;
                })
            },
            getBasicInfo(){
                this.listLoading=true;
                this.api({
                    url:"/basicInfo/resource",
                    method:"get",
                }).then(data =>{
                    this.listLoading=false;
                    this.basicinfo.basicinfoPhone=data.list.basicinfoPhone;
                    this.basicinfo.basicinfoAddress=data.list.basicinfoAddress;
                    this.basicinfo.basicinfoEmail=data.list.basicinfoEmail;
                    this.basicinfo.basicinfoId=data.list.basicinfoId;
                })
            },
            getBrief(){
                this.listLoading=true;
                this.api({
                    url:"/brief/resource",
                    method:"get",
                }).then(data =>{
                    this.listLoading=false;
                    this.brief.briefContent=data.list.briefContent;
                    this.brief.briefId=data.list.briefId;
                })
            },
            getCulture(){
                this.listLoading=true;
                this.api({
                    url:"/culture/resource",
                    method:"get",
                }).then(data =>{
                    this.listLoading=false;
                    this.culture.cultureContent=data.list.cultureContent;
                    this.culture.cultureId=data.list.cultureId;
                })
            },
            getHistory(){
                this.listLoading=true;
                this.api({
                    url:"/history/resource",
                    method:"get",
                }).then(data =>{
                    this.listLoading=false;
                    this.listHistory=data.list;
                })
            },
            getHonor(){
                this.listLoading=true;
                this.api({
                    url:"/honor/resource/"+this.listQuery.pageNum+"/"+this.listQuery.pageSize,
                    method:"get",
                }).then(data =>{
                    this.listLoading=false;
                    this.listHonor=data.list;
                    this.totalCount=data.totalCount;
                })
            },
            postAdvantage(){
                this.listLoading=true;
                this.api({
                    url:"/advantage",
                    method:"post",
                    data: this.advantage,
                }).then(data =>{
                    this.getAdvantage()
                })
            },
            postBasicInfo(){
                this.listLoading=true;
                this.api({
                    url:"/basicInfo",
                    method:"post",
                    data: this.basicinfo
                }).then(data =>{
                    this.getBasicInfo()
                })
            },
            postBrief(){
                this.listLoading=true;
                this.api({
                    url:"/brief",
                    method:"post",
                    data: this.brief
                }).then(data =>{
                    this.listLoading=false;
                    this.brief.briefContent=data.list.briefContent;
                    this.brief.briefId=data.list.briefId;
                    this.getBasicInfo()
                })
            },
            postCulture(){
                this.listLoading=true;
                this.api({
                    url:"/culture",
                    method:"post",
                    data: this.culture
                }).then(data =>{
                    this.listLoading=false;
                    this.culture.cultureContent=data.list.cultureContent;
                    this.culture.cultureId=data.list.cultureId;
                    this.getCulture()
                })
            },
            postHistory(){
                this.listLoading=true;
                this.api({
                    url:"/history",
                    method:"post",
                    data: this.history
                }).then(data =>{
                    this.listLoading=false;
                    this.dialogFormVisibleHistory = false;
                    this.getHistory()
                })
            },
            updateHistory(){
                this.listLoading=true;
                this.api({
                    url:"/history",
                    method:"put",
                    data: this.history
                }).then(data =>{
                    this.listLoading=false;
                    this.dialogFormVisibleHistory = false;
                    this.getHistory()
                })
            },
            deleteHistory($index){
                let _vue = this;
                this.$confirm('确定删除此事件?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    let historyId = _vue.listHistory[$index].historyId;
                    _vue.api({
                        url:"/history/"+historyId,
                        method:"delete",
                    }).then(() => {
                        _vue.getHistory()
                    }).catch(() => {
                        _vue.$message.error("删除失败")
                    })
                })
            },
            creatHonor(){
                this.listLoading=true;
                this.api({
                    url:"/honor",
                    method:"post",
                    data: this.tempHonor
                }).then(data =>{
                    this.listHonor=data.list;
                    this.dialogFormVisibleHonor = false;
                    this.getHonor();
                })
            },
            updateHonor(){
                this.listLoading=true;
                this.api({
                    url:"/honor",
                    method:"put",
                    data: this.tempHonor
                }).then(data =>{
                    this.listHonor=data.list;
                    this.dialogFormVisibleHonor = false;
                    this.getHonor();
                })
            },
            deleteHonor($index){
                let _vue = this;
                this.$confirm('确定删除此荣誉?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    let honorId = _vue.listHonor[$index].honorId;
                    _vue.api({
                        url:"/honor/"+honorId,
                        method:"delete",
                    }).then(() => {
                        _vue.getHonor()
                    }).catch(() => {
                        _vue.$message.error("删除失败")
                    })
                })
            },
            handleSizeChange(val) {
                //改变每页数量
                this.listQuery.pageSize = val;
                this.handleFilter();
            },
            handleCurrentChange(val) {
                //改变页码
                this.listQuery.pageNum = val;
                this.getHonor();
            },
            handleFilter() {
                //查询事件
                this.listQuery.pageNum = 1;
                this.getHonor()
            },
            getIndex($index) {
                //表格序号
                return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + $index + 1
            },
            showCreate() {
                //显示新增对话框
                this.tempHonor.honorName = "";
                this.tempHonor.honorPicture = "";
                this.tempHonor.honorTime = "";
                this.dialogStatusHonor = "create";
                this.dialogFormVisibleHonor = true;
            },
            showCreateHistory() {
                //显示新增对话框
                this.history.historyId = "";
                this.history.historyTitle = "";
                this.history.historyContent = "";
                this.history.historyContent = "";
                this.dialogStatusHistory = "create";
                this.dialogFormVisibleHistory = true;
            },
            showUpdateHonor($index) {
                //显示修改对话框
                this.tempHonor.honorId = this.listHonor[$index].honorId;
                this.tempHonor.honorName = this.listHonor[$index].honorName;
                this.tempHonor.honorPicture = this.listHonor[$index].honorPicture;
                this.tempHonor.honorTime = this.listHonor[$index].honorTime;
                this.dialogStatusHonor = "update";
                this.dialogFormVisibleHonor = true
            },
            showUpdateHistory($index) {
                //显示修改对话框
                this.history.historyId = this.listHistory[$index].historyId;
                this.history.historyTitle = this.listHistory[$index].historyTitle;
                this.history.historyContent = this.listHistory[$index].historyContent;
                this.history.historyDate = this.listHistory[$index].historyDate;
                this.dialogStatusHistory = "update";
                this.dialogFormVisibleHistory = true
            },
        }
    }
</script>

<style scoped>

</style>
