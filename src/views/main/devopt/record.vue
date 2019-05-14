<template>
    <div>
        运维维修记录
        <div class="filter-container">
            <el-button @click="addNews" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="operators" label="运维人员编号"></el-table-column>
            <el-table-column prop="customerName" label="客户"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="typeName" label="运维类型"></el-table-column>
            <el-table-column prop="devices" label="硬件编号集"></el-table-column>
            <el-table-column prop="stations" label="站点编号集"></el-table-column>
            <el-table-column fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.$index,scope.row)"
                        type="text"
                        size="small"
                        >查看</el-button
                    >
                    <el-button type="text" size="small" @click="editClick(scope.$index,scope.row)" v-if="permissionsBox.updateBtn">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteClick(scope.$index,scope.row)" v-if="permissionsBox.deleteBtn">删除</el-button>
                    <el-button type="text" size="small" @click="evaluate(scope.$index,scope.row)" v-if="!scope.row.feedbackId">评价</el-button>
                    <el-button type="text" size="small" @click="handEvaluate(scope.$index,scope.row)" v-if="scope.row.feedbackId">查看评价</el-button>
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
                <el-form-item label="运维人员编号">
                    <!-- <el-input v-model="dialogFrom.operatorId" :disabled="dialogDisabled"></el-input> -->
                    <personChange 
                        :disabled="dialogDisabled" 
                        :operatorId="dialogFrom.operators"
                        v-on:lintenToChildSelected="childOperators">
                    </personChange>
                </el-form-item>
                <el-form-item label="运营商编号">
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled" 
                        :agentId="dialogFrom.agentId"
                        :agentName="dialogFrom.agentName">
                    </operatorChange>
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
                <el-form-item label="内容">
                    <el-input v-model="dialogFrom.content" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="运维类型">
                    <!-- <el-input v-model="dialogFrom.type" :disabled="dialogDisabled"></el-input> -->
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <p v-for="(devoptType, index) in typeArr" :key="index">
                            <el-radio :label="devoptType.id">{{devoptType.name}}</el-radio>
                        </p>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备编号">
                    <!-- <el-input v-model="dialogFrom.devices" :disabled="dialogDisabled"></el-input> -->
                    <devicesChange 
                        :isShowDevices="isShowDevices" 
                        :disabled="dialogDisabled" 
                        :deviceId="dialogFrom.devices"
                        v-on:listToChildDevices="ChildDevices">
                    </devicesChange>
                </el-form-item>
                <el-form-item label="站点编号">
                    <!-- <el-input v-model="dialogFrom.stations" :disabled="dialogDisabled"></el-input> -->
                    <stationChange 
                        :disabled="dialogDisabled" 
                        :stationId="dialogFrom.stations" 
                        v-on:lisenTochildStation="childStation">
                    </stationChange>
                </el-form-item>
                <el-form-item v-if="dialogBtn">
                    <el-button type="primary" @click="onSubmit('dialogFrom')">保存</el-button>
                    <el-button @click="dialogTableVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title=评价信息 :visible.sync="evaluateVisible">
             <el-form ref="evaluateFrom" :model="evaluateFrom" label-width="100px">
                <el-form-item label="维修单编号">
                    <el-input v-model="evaluateFrom.sheetId" :disabled="noClick"></el-input>
                </el-form-item>
                <el-form-item label="评价内容">
                    <el-input v-model="evaluateFrom.content" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="评价等级">
                    <el-rate v-model="evaluateFrom.level"></el-rate>
                </el-form-item>
                <el-form-item v-if="dialogBtn">
                    <el-button type="primary" @click="evaluateSubmit">保存</el-button>
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
import personChange from '@/components/devoptPersonChange'
import stationChange from '@/components/stationChange'
import devicesChange  from '@/components/devicesChange2'
import { power } from '@/tool/power.js'

export default {
    components:{page, CustomerChange, operatorChange, personChange, stationChange, devicesChange},
    data () {
        return {
            totalCount:null,

            tableData:[],

            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn: false,
            dialogFrom:{
                id:null,
                content:null,
                customerId:null,
                customerName:null,
                devices:null,
                operators: null,
                stations: null,
                type: null,
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
            
            isShowDevices:false,

            flag:null,


            evaluateVisible:false,
            evaluateFrom:{
                content:null,
                sheetId:null,
                type:0,
                level:null,
            },
            noClick:true,
            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:record:info','sys:record:add','sys:record:delete','sys:record:update');
    },
    methods:{
        getRecordList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };

            getRequest('/mode/maintenance/records',getData).then((res) => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                    this.typeNameShow();
                }else {
                    this.$message.error(res.data.code + res.data.msg);
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
            getRequest('/mode/maintenance/records/'+rowID, this.dialogFrom).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.content = res.data.data.content;
                    this.dialogFrom.customerId = res.data.data.customerId;
                    this.dialogFrom.customerName = res.data.data.customerName;
                    this.dialogFrom.devices = res.data.data.devices;
                    this.dialogFrom.operators = res.data.data.operators;
                    this.dialogFrom.stations = res.data.data.stations;
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
            deleteRequest('/mode/maintenance/records/'+row.id).then( res => {
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
                        // console.log(this.dialogFrom);
                        postJsonRequest('/mode/maintenance/records',this.dialogFrom).then( res => {
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
                        putJsonRequest('/mode/maintenance/records/'+this.dialogFrom.id,this.dialogFrom).then( res => {
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


        evaluate( index, row){
            this.evaluateVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.evaluateFrom.sheetId = row.id;
            this.evaluateFrom.content = null;
            this.evaluateFrom.level = null;
        },
        handEvaluate(index, row){
            this.evaluateVisible = true;
            this.dialogDisabled = true;
            this.dialogBtn = false;
            this.evaluateFrom.sheetId = row.id;
            this.getEvaluate(row.feedbackId);
        },
        getEvaluate(feedbackId){
            getRequest('/mode/maintenance/feedbacks/'+feedbackId).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.evaluateFrom.content = res.data.data.content;
                    this.evaluateFrom.level = res.data.data.level;
                }else{
                    this.$message.error(res.data.code + res.data.msg);
                }
            })
        },
        evaluateSubmit(){
            postJsonRequest('/mode/maintenance/feedbacks',this.evaluateFrom).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.evaluateVisible = false;
                    this.$message.success('添加成功');
                    this.getRecordList();
                }else{
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },




        childStation(val){
            this.dialogFrom.stations = val.id;
        },
        childOperators(val){
            this.dialogFrom.operators = val;
        },
        ChildDevices(val){
            this.dialogFrom.devices = val.id;
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

