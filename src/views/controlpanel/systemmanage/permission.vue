<template>
<!--  变量名待修改-->
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" width="150">
        <template slot-scope="scope">
          <el-tag v-text="'增加'" v-if="scope.row.icon==='1'" type="success"></el-tag>
          <el-tag v-text="'删除'" v-if="scope.row.icon==='2'" type="danger"></el-tag>
          <el-tag v-text="'修改'" v-if="scope.row.icon==='3'" type="warning"></el-tag>
          <el-tag v-text="'查询'" v-if="scope.row.icon==='4'" type="primary"></el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="permissionName"></el-table-column>
      <el-table-column align="center" label="说明" prop="description" width="420"></el-table-column>
      <el-table-column align="center" label="菜单" prop="menuList" ></el-table-column>
      <el-table-column align="center" label="角色" width="420">
        <template slot-scope="scope">
          <div v-for="role in scope.row.roleList">
            <div style="display: inline-block;vertical-align: middle">
              <el-tag v-text="role" v-if="role==='admin'" type="success"></el-tag>
              <el-tag v-text="role" v-else type="primary"></el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
      }
    },
    created() {
      this.getAllPermisson();
    },
    methods: {
      getAllPermisson() {
        //查询所有权限
        this.api({
          url: "/permissions",
          method: "get"
        }).then(data => {
          this.list = data.list;
        })
      },
      getIndex($index) {
        //表格序号
        return $index + 1
      },
    }
  }
</script>
<style scoped>
  .requiredPerm {
    color: #ff0e13;
  }
</style>
