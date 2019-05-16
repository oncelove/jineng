<template>
    <div>
        巡检计划
        <div class="filter-container">
            <el-button @click="addNews" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="巡检计划编号"></el-table-column>
            <el-table-column prop="customerName" label="客户"></el-table-column>
            <el-table-column prop="cycle" label="巡检周期"></el-table-column>
            <el-table-column prop="typeName" label="计划类型"></el-table-column>
            <!-- <el-table-column prop="type" label="计划类型"></el-table-column> -->
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.$index,scope.row)"
                        type="text"
                        size="small"
                        >查看</el-button
                    >
                    <el-button type="text" size="small" @click="editClick(scope.$index,scope.row)" v-if="permissionsBox.updateBtn">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteClick(scope.$index,scope.row)" v-if="permissionsBox.deleteBtn">删除</el-button>
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
                <el-form-item label="巡检周期(天)">
                    <el-input v-model="dialogFrom.cycle" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="客户编号">
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled" 
                        :agentId="dialogFrom.agentId"
                        :agentName="dialogFrom.agentName"></operatorChange>
                    <CustomerChange 
                        :agentId="dialogFrom.agentId"
                        v-on:lisenTochildCustomer="ChildCustomer"
                        :disabled="dialogDisabled"
                        :customerId="dialogFrom.customerId"
                        :customerName="dialogFrom.customerName"
                    ></CustomerChange>
                </el-form-item>
                <el-form-item label="运维类型">
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <el-radio :label="1">智慧用电用户</el-radio>
                        <el-radio :label="2">配电房托管基础用户（线上托管）</el-radio>
                        <el-radio :label="3">配电房托管中级用户（线上加线下巡检</el-radio>
                        <el-radio :label="4">配电房高级用户（线上 线下巡检  年度试验和保养）</el-radio>
                        <el-radio :label="5">配电全托管用户（高级用户+现场专业值守人员）</el-radio>
                        <el-radio :label="6">能耗综合托管用户</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="巡检日期">
                    <el-date-picker
                        v-model="dialogFrom.startTime"
                        :disabled="dialogDisabled"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期">
                    </el-date-picker>
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
import operatorChange from '@/components/operatorChange'
import CustomerChange from '@/components/CustomerChange'
import { power } from '@/tool/power.js'

export default {
    components:{page, CustomerChange, operatorChange},
    data () {
        return {
            totalCount:null,

            tableData:[],

            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn: false,
            dialogFrom:{
                id:null,
                agentId:null,
                startTime:null,
                customerName:null,
                customerId:null,
                cycle:null,
                type:null,
            },
            rules:null,

            typeArr:[
                {id:1,name:'智慧用电用户'},
                {id:2,name:'配电房托管基础用户（线上托管）'},
                {id:3,name:'配电房托管中级用户（线上加线下巡检）'},
                {id:4,name:'配电房高级用户（线上线下巡检  年度试验和保养）'},
                {id:5,name:'配电全托管用户（高级用户+现场专业值守人员）'},
                {id:6,name:'能耗综合托管用户'},
            ],
            

            flag:null,
            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:devoptPlan:info','sys:devoptPlan:save','sys:devoptPlan:delete','sys:devoptPlan:update');
    },
    methods:{
        getRecordList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };

            getRequest('/operation/maintenance/plans',getData).then((res) => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                    this.typeNameShow();
                }else{
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        typeNameShow(){
            this.typeArr.map( (val,i) => {
                this.tableData.map( (value, index) => {
                    if (value.type == val.id) {
                        this.tableData[index].typeName = val.name;
                    }
                })
            })
        },

        getRecordPerson(rowID){
            getRequest('/operation/maintenance/plans/'+rowID, this.dialogFrom).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.startTime = res.data.data.startTime;
                    this.dialogFrom.customerName = res.data.data.customerName;
                    this.dialogFrom.customerId = res.data.data.customerId;
                    this.dialogFrom.cycle = res.data.data.cycle;
                    this.dialogFrom.type = res.data.data.type;
                    this.typeNameShow();
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        handleClick(index, row){
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogTableVisible = true;
            this.dialogBtn =  false;
            this.dialogDisabled = true;
            this.getRecordPerson(row.id);
        },
        editClick(index, row){
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            this.dialogDisabled = false;
            this.getRecordPerson(row.id);
        },
        deleteClick(index, row){
            deleteRequest('/operation/maintenance/plans/'+row.id).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.$message.success('删除成功');
                }else {
                    this.$message.error(this.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        addNews(){
            this.flag = 1;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            this.dialogDisabled = false;
        },

        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if ( this.flag === 1) {
                        postJsonRequest('/operation/maintenance/plans',this.dialogFrom).then( res => {
                            this.dialogTableVisible = false;
                            if ( res.data.code === 0) {
                                this.$message.success('添加成功');
                                this.getRecordList();
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
                        }).catch( err => {
                            console.log(err);
                        })
                        return;
                    } else {
                        putJsonRequest('/operation/maintenance/plans/'+this.dialogFrom.id,this.dialogFrom).then( res => {
                            this.dialogTableVisible = false;
                            if ( res.data.code === 0) {
                                this.$message.success('修改成功');
                                this.getRecordList();
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
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
            this.dialogFrom.agentName = val.name;
            this.dialogFrom.agentId = val.agentId;
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

