<template>
    <div>
        报警列表
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="meterId" label="设备id"></el-table-column>
            <el-table-column prop="warningState" label="报警状态">
                <template slot-scope="scope">
                    <em v-if="scope.row.warningState === 0">警告消除</em>
                    <em v-else-if="scope.row.warningState === 1">越上限</em>
                    <em v-else >越下限</em>
                </template>
            </el-table-column>
            <el-table-column prop="warningType" label="报警属性"></el-table-column>
            <el-table-column prop="warningValue" label="报警值"></el-table-column>
            <el-table-column prop="warningTime" label="报警时间"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import {getRequest} from '@/axios.js'
import { power } from '@/tool/power.js'
export default {
    data(){
        return{
            tableData:[],
            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:errList:info','sys:errList:save','sys:errList:delete','sys:errList:update');
    },
    mounted(){
        this.getDevicesList();
    },
    methods:{
        getDevicesList(){
            getRequest('/hardware/deviceWarning').then( res => {
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
em{
    font-style: normal;
}
</style>
