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
      <el-table-column align="center" label="分类" prop="icon" width="150"></el-table-column>
      <el-table-column align="center" label="名称" prop="permissionName"></el-table-column>
      <el-table-column align="center" label="说明" prop="description" width="420"></el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <div v-for="role in scope.row.roles">
            <div v-text="role.roleName" style="display: inline-block;vertical-align: middle;"></div>
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
          url: "/user/selectAllPermission",
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
