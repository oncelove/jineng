<template>
    <div class="position">
        <el-input v-model="customerInput" :disabled="noclick"></el-input>
        <el-button @click="seeCustomer" class="seeCustomer" :disabled="dialogDisabled">查看运营商</el-button>
        <el-dialog :visible.sync="dialogTableVisible" title="运营商信息" :modal-append-to-body='false'>
            <el-table :data="tableData" class="table-box">
                <el-table-column prop="name" label="运营商名称"></el-table-column>
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
    props:['disabled','agentId','agentName'],
    watch:{
        disabled(val){
            this.dialogDisabled =  val;
        },
        agentId(val){
            // console.log('运营商id'+ val);
            this.customerInput = val;
        },
        agentName(val){
            // console.log('运营商name'+ val);
            this.customerInput = val;
        }
    },
    data(){
        return {
            dialogTableVisible: false,
            tableData:[],
            customerInput:'',
            dialogDisabled:true,
            totalCount: 0,
            noclick: true,
        }
    },
    methods:{
        Choice(val, row){
            this.dialogTableVisible = false;
            this.customerInput = row.name;
            this.$emit('lintenToChildSelected',row);
        },
        getCustomersList(current, size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
                customerId: this.customerId
            }
            getRequest('/api/agent/select',getData).then( res => {
                if ( res.data.code === 0) {
                    this.tableData = res.data.agentList;
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
            this.getCustomersList('',val);
        },
        // 当前页数
        showCurrentChange(val){
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
