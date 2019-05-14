<template>
    <div class="position">
        <el-input v-model="devicesInput" :disabled="noclick"></el-input>
        <el-button @click="seeCustomer" class="seeCustomer" :disabled="dialogDisabled">查看设备</el-button>
        <el-dialog 
            :visible.sync="dialogTableVisible" 
            title="设备信息" 
            :close-on-click-modal="false"
            @close="dialogClose"
            :modal-append-to-body='false'>
            <el-table :data="tableData">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="name" label="产品名称"></el-table-column>
                <el-table-column prop="typeCodeName" label="产品类型"></el-table-column>
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
    props:['isShowDevices','deviceId', 'disabled'],
    components:{ page},
    data(){
        return{
            dialogTableVisible:false,
            dialogDisabled: true,
            tableData:[],
            totalCount:null,
            typeName:[
                {id:'11',name:'变压器'},
                {id:'12',name:'高压进线柜'},
                {id:'13',name:'高压出线柜'},
                {id:'14',name:'低压进线总柜'},
                {id:'15',name:'电容补偿柜'},
                {id:'16',name:'低压出线回路'},
                {id:'21',name:'电表'},
                {id:'22',name:'通讯管理机'},
                {id:'23',name:'环境传感器'},
                {id:'24',name:'摄像头'},
                {id:'25',name:'断电报警器'}
            ],
            devicesInput:null,
            noclick: true,
        }
    },
    watch:{
        isShowDevices(val){
            this.dialogTableVisible = val;
        },
        deviceId(val){
            this.devicesInput = val;
        },
        disabled(val){
            this.dialogDisabled = val;
        }
    },
    mounted(){
        this.dialogDisabled = this.disabled;
    },
    methods:{
        
        getDevicesList(current, size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
            }
            getRequest('/test/devices',getData).then( res => {
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                    this.getTypeName();
                } else {
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })

        },

        seeCustomer(){
            this.dialogTableVisible = true;
            this.getDevicesList();
        },

        getTypeName() {
            this.tableData.map( (val,i) => {
                this.typeName.map((value, index) => {
                    if (val.type == value.id) {
                        this.tableData[i].typeCodeName = value.name;
                    }
                })
            })
        },

        Choice(index, row){
            this.devicesInput = row.id;
            this.$emit('listToChildDevices',row);
            this.dialogTableVisible = false;
        },

        dialogClose(){
            this.$emit('listToChildClose',false);
        },

        // 每页数据条数
        showSizeChange(val){
            this.getDevicesList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getDevicesList(val);
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
</style>

