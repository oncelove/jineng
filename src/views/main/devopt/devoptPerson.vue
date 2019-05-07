<template>
    <div>
        运维人员
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="运维人员"></el-table-column>
            <el-table-column prop="agentId" label="运营商编号"></el-table-column>
            <el-table-column prop="position" label="职位"></el-table-column>
            <el-table-column prop="department" label="部门"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="status" label="是否空闲"></el-table-column>
            <el-table-column prop="maintenanceNum" label="运维累计次数"></el-table-column>
            <el-table-column prop="maintenanceTime" label="运维累计时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.$index,scope.row)"
                        type="text"
                        size="small"
                        >查看</el-button
                    >
                    <el-button type="text" size="small" @click="editClick(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteClick(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>

    </div>
</template>

<script>
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'

import page from '@/components/page'

export default {
    components:{page},
    data () {
        return {
            totalCount:null,

            tableData:[],
        }
    },
    methods:{
        getRecordList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };

            getRequest('/mode/maintenance/operator',getData).then((res) => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                }
            }).catch((err) => {
                console.log(err);
            });

            // 
        },

        handleClick(index, row){

        },
        editClick(index, row){

        },
        deleteClick(index, row){

        },



        // 每页数据条数
        showSizeChange(val){
            this.getRecordList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getRecordList(val);
        },
    },
    mounted(){
        this.getRecordList();
    }
}
</script>

<style lang="scss" scoped>

</style>

