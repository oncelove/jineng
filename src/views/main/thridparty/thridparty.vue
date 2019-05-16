<template>
    <div>
        前端监控管理
        <div class="filter-container">
            <el-button @click="added" size="medium">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="deptName" label="所属部门"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <i v-if="scope.row.is_show===0" class="el-icon-close"></i>
                    <i v-else class="el-icon-check"></i>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.$index,scope.row)" size="small">查看</el-button>
                    <el-button @click="seeVideo(scope.$index,scope.row)" size="small">查看视频</el-button>
                    <el-button size="small" @click="editClick(scope.$index,scope.row)" v-if="permissionsBox.updateBtn">编辑</el-button>
                    <el-button size="small" @click="deleteClick(scope.$index,scope.row)" v-if="permissionsBox.deleteBtn">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>

        <el-dialog title="用户信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="120px">
                <el-form-item label="设备名称">
                    <el-input v-model="dialogFrom.deviceName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <el-input v-model="dialogFrom.deviceSerial" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设备类型">
                    <el-radio-group v-model="dialogFrom.deviceType" :disabled="dialogDisabled">
                        <el-radio :label="1">摄像头</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="运营商">
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled" 
                        :agentName="dialogFrom.agentName"
                        :agentId="dialogFrom.agentId">
                    </operatorChange>
                </el-form-item>
                <el-form-item label="客户名称">
                    <!-- <el-input v-model="dialogFrom.customerName" :disabled="dialogDisabled"></el-input> -->
                    <CustomerChange 
                        :agentId="dialogFrom.agentId"
                        v-on:lisenTochildCustomer="lisenTochildCustomer" 
                        :disabled="dialogDisabled" 
                        :customerId="dialogFrom.customerId"
                        :customerName="dialogFrom.customerName">
                    </CustomerChange>
                </el-form-item>
                <el-form-item label="站点名称">
                    <el-input v-model="dialogFrom.stationName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="附加参数信息">
                    <el-input v-model="dialogFrom.addition.validateCode" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogBtn">
                    <el-button type="primary" @click="onSubmit('dialogFrom')">保存</el-button>
                    <el-button @click="dialogTableVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import page from '@/components/page'
import operatorChange from '@/components/operatorChange'
import CustomerChange from '@/components/CustomerChange'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
import { power } from '@/tool/power.js'
export default {
    components:{ page, operatorChange, CustomerChange},
    data() {
        return {
            totalCount:null,
            tableData:[],
            dialogDisabled:false,
            dialogTableVisible:false,
            dialogBtn: false,
            dialogFrom:{
                deviceName: null,
                deviceSerial: null,
                deviceType: 1,
                customerId: null,
                customerName: null,
                stationId: null,
                stationName: null,
                agentId: null,
                agentName: null,
                addition:{
                    validateCode:null,
                }
            },
        }
    },

    mounted(){

    },

    created(){
        this.getList();
    },

    methods:{
        getList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            }

            getRequest('/catch/thridparty',getData).then( res => {
                console.log(res);
            }).catch( err => {
                console.log(err);
            })

        },
        getListMsg(rowId){
            this.dialogTableVisible = true;
            getRequest(`/catch/thridparty/${rowId}`).then( res => {
                console.log(res);
            }).catch( err => {
                console.log(err);
            })
        },
        added(){
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            this.dialogDisabled = false;
        },
        handleClick(index,row){
            this.dialogBtn = false;
            this.dialogDisabled = true;
            this.getListMsg(row.id);
        },
        editClick(index,row){
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.getListMsg(row.id);
        },
        deleteClick(index,row){

        },
        onSubmit(){

        },
        seeVideo(index, row){

        },


        // 每页数据条数
        showSizeChange(val){
            this.getList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getList(val);
        },
        // 客户
        lisenTochildCustomer(val){
            this.dialogFrom.customerId = val.customerId;
        },
        // 运营商
        selectedOptions(val){
            this.dialogFrom.agentName = val.name;
            this.dialogFrom.agentId = val.agentId;
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
