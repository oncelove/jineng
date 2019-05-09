<template>
    <div>
        故障管理
        <el-button @click="addNews">新增</el-button>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="故障单编号"></el-table-column>
            <el-table-column prop="recordId" label="运维记录编号"></el-table-column>
            <el-table-column prop="operatorId" label="运维人员编号"></el-table-column>
            <el-table-column prop="customerId" label="客户编号"></el-table-column>
            <el-table-column prop="deviceId" label="硬件编号"></el-table-column>
            <el-table-column prop="title" label="故障单标题"></el-table-column>
            <el-table-column prop="content" label="故障单内容"></el-table-column>
            <el-table-column prop="accessory" label="上传图片"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="type" label="故障单类型"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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

        <el-dialog title="用户信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="100px">
                <el-form-item label="运营商编号">
                    <operatorChange v-on:lintenToChildSelected="selectedOptions" :disabled="dialogDisabled" :agentId="dialogFrom.agentId"></operatorChange>
                </el-form-item>
                <el-form-item label="运维人员编号">
                    <!-- <el-input v-model="dialogFrom.operatorId" :disabled="dialogDisabled"></el-input> -->
                    <devoptPersonChange :disabled="dialogDisabled" :operatorId="dialogFrom.operatorId" v-on:lintenToChildSelected="ChildSelected"></devoptPersonChange>
                </el-form-item>
                <el-form-item label="客户编号">
                    <CustomerChange 
                        :agentId="dialogFrom.agentId"
                        v-on:lisenTochildCustomer="ChildCustomer"
                        :disabled="dialogDisabled"
                        :customerId="dialogFrom.customerId"
                        :customerName="dialogFrom.customerName"
                    ></CustomerChange>
                </el-form-item>
                <!-- <el-form-item label="标题">
                    <el-input v-model="dialogFrom.title" :disabled="dialogDisabled"></el-input>
                </el-form-item> -->
                <el-form-item label="内容">
                    <el-input v-model="dialogFrom.content" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="附件">
                    <el-input v-model="dialogFrom.accessory" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="硬件编号">
                    <el-input v-model="dialogFrom.deviceId" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <el-radio :label="1">智慧用电用户</el-radio>
                        <p v-for="(typeGroup,index) in dialogFrom.typeGroup" :key="index">
                            <el-radio :label="typeGroup.id">{{typeGroup.name}}</el-radio>
                        </p>
                        
                    </el-radio-group>
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
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'

import page from '@/components/page'

import rules from '@/tool/rules.js'
import CustomerChange from '@/components/CustomerChange'
import operatorChange from '@/components/operatorChange'
import devoptPersonChange from '@/components/devoptPersonChange'

export default {
    components:{page, CustomerChange, operatorChange, devoptPersonChange},
    data () {
        return {
            totalCount:null,

            tableData:[],

            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn: false,
            dialogFrom:{
                operatorId:null,
                typeGroup:[],
                agentId:null,
            },
            rules:null,

            flag:null,
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

            getRequest('/mode/maintenance/faults',getData).then((res) => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        getRecordPerson(rowID){
            putJsonRequest('/mode/maintenance/faults/'+rowID, this.dialogFrom).then( res => {
                console.log(res);
                this.getTypeGroup();
            }).catch( err => {
                console.log(err);
            })
        },

        getTypeGroup(){
            getRequest('/mode/maintenance/faults/types').then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.dialogFrom.typeGroup = res.data.data
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        handleClick(index, row){
            this.dialogTableVisible = true;
            this.dialogBtn =  false;
            this.dialogDisabled = true;
            this.getRecordPerson(row.id);
        },
        editClick(index, row){
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            this.dialogDisabled = false;
            this.getRecordPerson(row.id);
        },
        deleteClick(index, row){
            deleteRequest('/mode/maintenance/faults/'+row.id).then( res => {
                console.log(res);
            }).catch( err => {
                console.log(err);
            })
        },
        addNews(){
            this.flag = 1;
            this.dialogTableVisible = true;
            this.getTypeGroup();
        },

        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if ( this.flag === 1) {
                        postJsonRequest('/mode/maintenance/faults',this.dialogFrom).then( res => {
                            console.log(res);
                        }).catch( err => {
                            console.log(err);
                        })
                        return;
                    } else {
                        putJsonRequest('/mode/maintenance/faults/'+this.dialogFrom.operatorId,this.dialogFrom).then( res => {
                            console.log(res);
                        }).catch( err => {
                            console.log(err);
                        })
                    }
                } else {
                    this.$message.error('验证失败');
                    return false;
                }
            });
        },


        ChildCustomer(val){
            this.dialogFrom.customerId = val.customerId;
        },
        selectedOptions(val){
            this.dialogFrom.agentId = val;
        },
        ChildSelected(val){
            this.dialogFrom.operatorId = val;
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
        this.rules = rules;
    }
}
</script>

<style lang="scss" scoped>

</style>

