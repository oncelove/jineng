<template>
    <div>
        维修管理
        <div class="filter-container">
            <el-button @click="addNews" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="故障单编号"></el-table-column>
            <el-table-column prop="operatorId" label="运维人员编号"></el-table-column>
            <el-table-column prop="customerName" label="客户编号"></el-table-column>
            <el-table-column prop="deviceId" label="硬件编号"></el-table-column>
            <el-table-column prop="stationId" label="站点编号"></el-table-column>
            <el-table-column prop="content" label="故障单内容"></el-table-column>
            <el-table-column prop="level" label="重要等级"></el-table-column>
            <el-table-column prop="accessory" label="上传图片"></el-table-column>
            <!-- <el-table-column prop="typeName" label="故障单类型"></el-table-column> -->
            <el-table-column prop="status" label="维修状态"></el-table-column>
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
                <el-form-item label="运营商编号">
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled" 
                        :agentId="dialogFrom.agentId"
                        :agentName="dialogFrom.agentName">
                    </operatorChange>
                </el-form-item>
                <el-form-item label="运维人员编号">
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
                <el-form-item label="硬件编号">
                    <devicesChange 
                        :isShowDevices="isShowDevices" 
                        :disabled="dialogDisabled" 
                        :deviceId="dialogFrom.deviceId"
                        v-on:listToChildDevices="ChildDevices">
                    </devicesChange>
                </el-form-item>
                <el-form-item label="站点编号">
                    <stationChange 
                        :disabled="dialogDisabled" 
                        :stationId="dialogFrom.stationId" 
                        v-on:lisenTochildStation="childStation">
                    </stationChange>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="dialogFrom.content" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="附件">
                    <el-input v-model="dialogFrom.accessory" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                
                <!-- <el-form-item label="类型">
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <p v-for="(typeGroup,index) in dialogFrom.typeGroup" :key="index">
                            <el-radio :label="typeGroup.id">{{typeGroup.name}}</el-radio>
                        </p>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="维修状态">
                    <el-radio-group v-model="dialogFrom.status" :disabled="dialogDisabled">
                        <p v-for="(stGroup,index) in statusGroup" :key="index">
                            <el-radio :label="stGroup.id">{{stGroup.name}}</el-radio>
                        </p>
                        <!-- <el-radio :label="1">已分配（系统已经分配的巡检或者维修但没有进行）</el-radio>
                        <el-radio :label="2">经行中（正在进行中的巡检或者运维）</el-radio>
                        <el-radio :label="3">待验收（等待客户验收并且款项未收回的）</el-radio>
                        <el-radio :label="4">完成（运维或者维修完成并且款项收回的）</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="重要等级">
                    <el-radio-group v-model="dialogFrom.level" :disabled="dialogDisabled">
                        <el-radio :label="1">普通</el-radio>
                        <el-radio :label="2">严重</el-radio>
                    </el-radio-group>
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
import CustomerChange from '@/components/CustomerChange'
import operatorChange from '@/components/operatorChange'
import devoptPersonChange from '@/components/devoptPersonChange'
import devicesChange from '@/components/devicesChange2'
import stationChange from '@/components/stationChange'
import { power } from '@/tool/power.js'

export default {
    components:{page, CustomerChange, operatorChange, devoptPersonChange, devicesChange, stationChange},
    data () {
        return {
            totalCount:null,

            tableData:[],

            isShowDevices: false,
            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn: false,
            dialogFrom:{
                operatorId:null,
                typeGroup:[],
                agentId:null,
                type:null,
                accessory: null,
                content: null,
                customerId: null,
                customerName: null,
                deviceId:null,
                level:null,
                stationId:null,
            },
            rules:null,
            statusGroup:[
                {id:1,name:'已分配（系统已经分配的巡检或者维修但没有进行）'},
                {id:2,name:'经行中（正在进行中的巡检或者运维）'},
                {id:3,name:'待验收（等待客户验收并且款项未收回的）'},
                {id:4,name:'完成（运维或者维修完成并且款项收回的）'},
            ],

            flag:null,


            evaluateVisible:false,
            evaluateFrom:{
                content:null,
                sheetId:null,
                type:1,
                level:null,
            },
            noClick:true,
            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:devoptFault:info','sys:devoptFault:add','sys:devoptFault:delete','sys:devoptFault:update');
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
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                    // this.getTypeGroup(true);
                    
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        getRecordPerson(rowID){
            getRequest('/mode/maintenance/faults/'+rowID).then( res => {
                if ( res.data.code === 0) {
                    this.dialogFrom.agentId = res.data.data.agentId;
                    this.dialogFrom.operatorId = res.data.data.operatorId;
                    this.dialogFrom.type = res.data.data.type;
                    this.dialogFrom.accessory = res.data.data.accessory;
                    this.dialogFrom.content = res.data.data.content;
                    this.dialogFrom.customerName = res.data.data.customerName;
                    this.dialogFrom.customerId = res.data.data.customerId;
                    this.dialogFrom.customerName = res.data.data.customerName;
                    this.dialogFrom.deviceId = res.data.data.deviceId;
                    this.dialogFrom.level = res.data.data.level;
                    this.dialogFrom.stationId = res.data.data.stationId;
                    // this.getTypeGroup();
                }else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        getTypeGroup(da){
            getRequest('/mode/maintenance/faults/types').then( res => {
                if ( res.data.code === 0) {
                    this.dialogFrom.typeGroup = res.data.data;
                    if (da) {
                        this.changeType();
                    }
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        changeType(){
            this.dialogFrom.typeGroup.map( (val,i) => {
                this.tableData.map((value, index) => {
                    if (value.type === val.id) {
                        this.tableData[index].typeName = val.name;
                    }
                })
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
            this.flag = 2;
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            this.dialogDisabled = false;
            this.getRecordPerson(row.id);
        },

        deleteClick(index, row){
            deleteRequest('/mode/maintenance/faults/'+row.id).then( res => {
                if ( res.data.code === 0) {
                    this.getRecordList();
                    this.$message.success('删除成功！！！')
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        addNews(){
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.flag = 1;
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.getTypeGroup();
        },

        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if ( this.flag === 1) {
                        postJsonRequest('/mode/maintenance/faults',this.dialogFrom).then( res => {
                            // console.log(res);
                             if ( res.data.code === 0) {
                                this.getRecordList();
                                this.dialogTableVisible = false;
                                this.$message.success('添加成功！！！')
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
                        }).catch( err => {
                            console.log(err);
                        })
                        return;
                    } else {
                        putJsonRequest('/mode/maintenance/faults/'+this.dialogFrom.operatorId,this.dialogFrom).then( res => {
                            if ( res.data.code === 0) {
                                this.getRecordList();
                                this.dialogTableVisible = false;
                                this.$message.success('修改成功！！！')
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


        ChildCustomer(val){
            this.dialogFrom.customerId = val.customerId;
        },
        selectedOptions(val){
            this.dialogFrom.agentName = val.name;
            this.dialogFrom.agentId = val.agentId;
        },
        ChildSelected(val){
            this.dialogFrom.operatorId = val;
        },
        ChildDevices(val){
            this.dialogFrom.deviceId = val.id;
        },
        childStation(val){
            this.dialogFrom.stationId = val.id;
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

