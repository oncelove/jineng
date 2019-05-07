<template>
    <div class="position">
        <el-input v-model="customerInput" :disabled="noclick"></el-input>
        <el-button class="seeProduct" @click="seeProduct" :disabled="dialogDisabled">查看产品</el-button>
        <el-dialog 
            :visible.sync="dialogTableVisible" 
            title="产品信息" 
            :close-on-click-modal="false"
            :modal-append-to-body='false'>
            <el-table :data="tableData" style="width: 100%"  class="table-box" ref="singleTable">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="name" label="产品名称"></el-table-column>
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
        productId(val){
            this.customerInput = val;
        },
    },
    props:['disabled','productId'],
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
        console.log(this.productId);
        this.customerInput = this.productId;
    },
    methods:{
        getProductList(current, size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
            }
            getRequest('/test/products',getData).then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        Choice(index, row){
            this.dialogTableVisible = false;
            this.customerInput = row.name;
            this.$emit('lisenTochildProduct',row)
        },

        seeProduct(){
            this.getProductList();
            this.dialogTableVisible = true;
        },

        // 每页数据条数
        showSizeChange(val){
            console.log(val);
            this.getProductList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            console.log(val);
            this.getProductList(val);
        },
    }
}
</script>

<style lang="scss" scoped>
.position{
    position: relative;
}
.seeProduct{
    position: absolute;
    right: 0;
}
</style>
