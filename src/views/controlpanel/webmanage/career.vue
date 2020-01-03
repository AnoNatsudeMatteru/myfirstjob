<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('career:add')">添加
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
      <el-table-column align="center" prop="careerTitle" label="招聘岗位" style="width: 60px;"/>
      <el-table-column align="center" label="招聘类型" style="width: 60px;">
        <template slot-scope="scope">
          <el-tag type="warning" v-text="'社会招聘'" v-if="scope.row.careerType===1"/>
          <el-tag type="primary" v-text="'校园招聘'" v-else/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="careerJd" label="岗位描述" style="width: 60px;"/>
      <el-table-column align="center" prop="careerJr" label="岗位要求" style="width: 60px;"/>
      <el-table-column align="center" prop="careerPhone" label="联系方式" style="width: 60px;"/>
      <el-table-column align="center" prop="careerSalary" label="福利待遇" style="width: 60px;"/>
      <el-table-column align="center" label="职能" style="width: 60px;">
        <template slot-scope="scope">
          <el-tag type="warning" v-text="'技术类'" v-if="scope.row.careerFunction===1"/>
          <el-tag type="primary" v-text="'市场类'" v-else-if="scope.row.careerFunction===2"/>
          <el-tag type="danger" v-text="'财务类'" v-else/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" style="width: 60px;">
        <template slot-scope="scope">
          <el-tag type="warning" v-text="'研发部'" v-if="scope.row.careerDep===1"/>
          <el-tag type="primary" v-text="'市场部'" v-else-if="scope.row.careerDep===2"/>
          <el-tag type="danger" v-text="'财务部'" v-else/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.careerTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('career:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeCareer(scope.$index)" v-if="hasPerm('career:delete')">
            删除
          </el-button>
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
      <el-form class="small-space" :model="tempCareer" label-position="left" label-width="80px"
               style='width: 600px; margin-left:50px;'>
        <el-form-item label="招聘岗位" required>
          <el-input type="text" v-model="tempCareer.careerTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="岗位描述" required>
          <el-input type="textarea" v-model="tempCareer.careerJd">
          </el-input>
        </el-form-item>
        <el-form-item label="岗位要求" required>
          <el-input type="textarea" v-model="tempCareer.careerJr">
          </el-input>
        </el-form-item>
        <el-form-item label="联系方式" required>
          <el-input type="text" v-model="tempCareer.careerPhone">
          </el-input>
        </el-form-item>
        <el-form-item label="福利待遇" required>
          <el-input type="textarea" v-model="tempCareer.careerSalary">
          </el-input>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-radio-group v-model="tempCareer.careerType">
            <el-radio label="1" border>社会招聘</el-radio>
            <el-radio label="2" border>校园招聘</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" required>
          <el-radio-group v-model="tempCareer.careerDep">
            <el-radio label="1" border>研发部</el-radio>
            <el-radio label="2" border>市场部</el-radio>
            <el-radio label="3" border>财务部</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createCareer">创 建</el-button>
        <el-button type="primary" v-else @click="updateCareer">修 改</el-button>
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
                    // careerTitle: ''
                },
                dialogStatus: 'create',
                dialogFormVisible: false,
                textMap: {
                    update: '编辑',
                    create: '创建新的岗位'
                },
                tempCareer: {
                    id: "",
                    careerTitle: "",
                    careerJd: "",
                    careerJr: "",
                    careerPhone: "",
                    careerSalary: "",
                    careerType: "",
                    careerFunction: "",
                    careerDep: ""
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                //查询列表
                // if (!this.hasPerm('career:select')) {
                //   return
                // }
                this.listLoading = true;
                this.api({
                    url: "/careers/resource/" + this.listQuery.pageNum + "/" + this.listQuery.pageSize,
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
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleFilter() {
                //查询事件
                this.listQuery.pageNum = 1;
                this.getList()
            },
            getIndex($index) {
                //表格序号
                return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + $index + 1
            },
            showCreate() {
                //显示新增对话框
                this.tempCareer.careerTitle = "";
                this.tempCareer.careerJd = "";
                this.tempCareer.careerJr = "";
                this.tempCareer.careerPhone = "";
                this.tempCareer.careerSalary = "";
                this.tempCareer.careerFunction = "";
                this.tempCareer.careerDep = "";
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            showUpdate($index) {
                //显示修改对话框
                this.tempCareer.careerId = this.list[$index].careerId;
                this.tempCareer.careerTitle = this.list[$index].careerTitle;
                this.tempCareer.careerJd = this.list[$index].careerJd;
                this.tempCareer.careerJr = this.list[$index].careerJr;
                this.tempCareer.careerPhone = this.list[$index].careerPhone;
                this.tempCareer.careerSalary = this.list[$index].careerSalary;
                this.tempCareer.careerType = this.list[$index].careerType;
                this.tempCareer.careerFunction = this.list[$index].careerFunction;
                this.tempCareer.careerDep = this.list[$index].careerDep;
                this.dialogStatus = "update";
                this.dialogFormVisible = true;
                console.log(this.tempCareer.careerType)
            },
            createCareer() {
                this.tempCareer.careerFunction = this.tempCareer.careerDep;
                //保存新文章
                this.api({
                    url: "/career",
                    method: "post",
                    data: this.tempCareer
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            updateCareer() {
                //修改文章
                this.api({
                    url: "/career",
                    method: "put",
                    data: this.tempCareer
                }).then(() => {
                    this.getList();
                    this.dialogFormVisible = false
                })
            },
            removeCareer($index) {
                let _vue = this;
                this.$confirm('确定删除此岗位?', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                }).then(() => {
                    let careerId = _vue.list[$index];
                    _vue.api({
                        url: "/career/" + careerId.careerId,
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
