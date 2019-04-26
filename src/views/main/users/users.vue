<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="agentName" label="项目名称" width="150">
            </el-table-column>
            <el-table-column prop="email" label="email">
            </el-table-column>
            <el-table-column prop="mobile" label="手机">
            </el-table-column>
            <el-table-column prop="username" label="用户角色">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.row)"
                        type="text"
                        size="small"
                        >查看</el-button
                    >
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData:[],
        }
    },
    created() {
        this.$http.get('/users').then( res => {
            console.log(res);
            this.tableData = res.data.page.list;
            console.log( this.tableData);
        }).catch( err => {
            console.log(err);
        })
    },
}
</script>

<style lang="scss">
    
</style>