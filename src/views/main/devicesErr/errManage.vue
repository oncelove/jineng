<template>
    <div>
        告警管理
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="meterId" label="报警id"></el-table-column>
            <el-table-column prop="deviceId" label="客户编号"></el-table-column>
            <el-table-column prop="content" label="报警内容"></el-table-column>
            <el-table-column prop="level" label="报警等级"></el-table-column>
            <el-table-column prop="current" label="当前报警值"></el-table-column>
            <el-table-column prop="threshold" label="报警阀值"></el-table-column>
            <el-table-column prop="isUpper" label="是否上限"></el-table-column>
            <el-table-column prop="type" label="报警类型"></el-table-column>
            <el-table-column prop="status" label="报警状态"></el-table-column>
            <el-table-column prop="createTime" label="创建日期"></el-table-column>
            <el-table-column fixed="right" label="RPC操作" width="210" align="center">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="() => addDialogShow(scope.$index,scope.row,0)">
                        查看
                    </el-button>
                    <el-button
                        type="primary"
                        plain 
                        size="mini"
                        v-if="permissionsBox.updateBtn"
                        @click="() => addDialogShow(scope.$index,scope.row,2)">
                        更新
                    </el-button>
                    <el-button
                        type="danger"
                        size="mini"
                        v-if="permissionsBox.deleteBtn"
                        @click="() => remove(scope.$index,scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { power } from '@/tool/power.js'
export default {
    data(){
        return{
            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:errManage:info','sys:errManage:add','sys:errManage:delete','sys:errManage:update');
    },
    methods:{
        getErrMessgae(){
            
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
