<template>
    <div class="position">
        <el-input v-model="operatorInput" :disabled="noclick"></el-input>
        <el-button @click="seeCustomer" class="seeCustomer" :disabled="dialogDisabled">查看运维人员</el-button>
        <el-dialog :visible.sync="dialogTableVisible" title="运维人员信息" :modal-append-to-body='false'>
            <el-table :data="tableData" class="table-box">
                <el-table-column prop="name" label="运维人员名称"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button
                            @click="Choice(scope.$index,scope.row)"
                            type="text"
                            size="small"
                            >选择</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <page
                :totalCount="totalCount"
                v-on:listenToSizeChange="showSizeChange"
                v-on:listenToCurrentChange="showCurrentChange"
            ></page>
        </el-dialog>
    </div>
</template>
<script>
import page from '@/components/page'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
export default {
    components:{page},
    props:['disabled','operatorId'],
    watch:{
        disabled(val){
            this.dialogDisabled =  val;
        },
        // operatorId(val){
        //     this.operatorInput = val;
        // }
    },
    data(){
        return {
            dialogTableVisible: false,
            tableData:[],
            operatorInput: null,
            dialogDisabled:true,
            totalCount: 0,
            noclick: true,
        }
    },
    methods:{
        Choice(val, row){
            console.log(row);
            this.dialogTableVisible = false;
            this.operatorInput = row.name;
            this.$emit('lintenToChildSelected',row.id);
        },
        getCustomersList(current, size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
                customerId: this.customerId
            }
            getRequest('/mode/maintenance/operators',getData).then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        seeCustomer(){
            this.dialogTableVisible = true;
            this.getCustomersList();
        },
        // 每页数据条数
        showSizeChange(val){
            console.log(val);
            this.getCustomersList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            console.log(val);
            this.getCustomersList(val);
        },
    },
    mounted(){
        this.dialogDisabled = this.disabled;
        
        
    }
}
</script>

<style lang="scss" scoped>
.position{
    position: relative;
}
.seeCustomer{
    position: absolute;
    right: 0;
}
</style>
