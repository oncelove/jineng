<template>
    <div class="position">
        <el-input v-model="customerInput" :disabled="noclick"></el-input>
        <el-button @click="seeCustomer" class="seeCustomer" :disabled="dialogDisabled">查看客户</el-button>
        <el-dialog :visible.sync="dialogTableVisible" title="客户信息" :modal-append-to-body='false'>
            <el-table :data="tableData" style="width: 100%"  class="table-box" ref="singleTable">
                <el-table-column prop="agentName" label="运营商名称"></el-table-column>
                <el-table-column prop="customerName" label="客户名"></el-table-column>
                <el-table-column prop="contacts" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="手机"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
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
    watch:{
        disabled(val){
            this.dialogDisabled =  val;
        },
        customerId(val){
            console.log(val);
        }
    },
    props:['agentId', 'dialogVisible','disabled','customerId'],
    data(){
        return{
            dialogTableVisible: false,
            tableData:[],
            customerInput:'',
            dialogDisabled:true,
            totalCount: 0,
            noclick: true,
        }
    },
    created(){
        this.dialogDisabled = this.disabled;
        console.log(this.customerId);
    },
    methods:{
        getCustomersList(current, size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
                customerId: this.customerId
            }
            console.log(this.agentId + 43);
            getRequest('/api/customers?agentId='+this.agentId,getData).then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.page.list;
                    this.totalCount = res.data.page.totalCount;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        seeCustomer(){
            console.log(this.agentId);
            if (this.agentId) {
                this.dialogTableVisible = true;
                this.getCustomersList();
            } else {
                this.$message.error('请选择运营商');
            }
            
        },

        Choice(index, row){
            console.log(row);
            this.dialogTableVisible = false;
            this.customerInput = row.customerName;
            this.$emit('lisenTochildCustomer',row)
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
.table{
    z-index: 999999;
}
</style>
