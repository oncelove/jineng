<template>
    <div>
        运维维修记录
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="operatorId" label="运维人员编号"></el-table-column>
            <el-table-column prop="customerId" label="客户编号"></el-table-column>
            <el-table-column prop="title" label="记录标题"></el-table-column>
            <el-table-column prop="content" label="记录内容"></el-table-column>
            <el-table-column prop="accessory" label="图片地址"></el-table-column>
            <el-table-column prop="devices" label="硬件编号"></el-table-column>
            <el-table-column prop="stations" label="站点编号"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="type" label="记录类型"></el-table-column>
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

            getRequest('/mode/maintenance/record',getData).then((res) => {
                console.log(res);
                if ( res.data.status === 200) {
                    this.tableData = res.data.result.records;
                    this.totalCount = res.data.result.total;
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

