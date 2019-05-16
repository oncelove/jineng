<template>
    <div>
        运维车辆
        <div class="filter-container">
            <el-button @click="addNews" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="车辆编号"></el-table-column>
            <el-table-column prop="agentId" label="运营商编号"></el-table-column>
            <el-table-column prop="license" label="车牌号"></el-table-column>
            <el-table-column prop="type" label="车辆类型"></el-table-column>
            <el-table-column prop="createDate" label="购买日期"></el-table-column>
            <el-table-column prop="description" label="车辆描述"></el-table-column>
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
                <el-form-item label="运营商编号">
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled" 
                        :agentId="dialogFrom.agentId"
                        :agentName="dialogFrom.agentName">
                    </operatorChange>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-input v-model="dialogFrom.license" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="dialogFrom.type" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="车辆描述">
                    <el-input v-model="dialogFrom.description" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="购买日期">
                    <el-date-picker
                        v-model="dialogFrom.createDate"
                        :disabled="dialogDisabled"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
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
import { power } from '@/tool/power.js'

export default {
    components:{page, operatorChange},
    data () {
        return {
            totalCount:null,

            tableData:[],

            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn: false,
            dialogFrom:{
                id:null,
                agentId: null,
                license: null,
                type: null,
                description: null,
                createDate: null,
            },
            rules:null,

            flag:null,
            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:devoptCar:info','sys:devoptCar:save','sys:devoptCar:delete','sys:devoptCar:update');
    },
    methods:{
        getRecordList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };

            getRequest('/operation/maintenance/vehicles',getData).then((res) => {
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch((err) => {
                console.log(err);
            });

            // 
        },

        getRecordPerson(rowID){
            getRequest('/operation/maintenance/vehicles/'+rowID).then( res => {
                if ( res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.agentId = res.data.data.agentId;
                    this.dialogFrom.license = res.data.data.license;
                    this.dialogFrom.type = res.data.data.type;
                    this.dialogFrom.description = res.data.data.description;
                    this.dialogFrom.createDate = res.data.data.createDate;
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
            deleteRequest('/operation/maintenance/vehicles/'+row.id).then( res => {
                if ( res.data.code === 0) {
                    this.$message.success('删除成功！！！')
                    this.getRecordList();
                } else {
                    this.$message.error(res.data.code + res.data.msg);
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
                        postJsonRequest('/operation/maintenance/vehicles',this.dialogFrom).then( res => {
                            if ( res.data.code === 0) {
                                this.$message.success('添加成功');
                                this.dialogTableVisible = false;
                                this.getRecordList();
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
                        }).catch( err => {
                            console.log(err);
                        })
                        return;
                    } else {
                        putJsonRequest('/operation/maintenance/vehicles/'+this.dialogFrom.id,this.dialogFrom).then( res => {
                            if ( res.data.code === 0) {
                                this.$message.success('更新成功！！！');
                                this.dialogTableVisible = false;
                                this.getRecordList();
                            } else {
                                this.$message.err(res.data.code + res.data.msg);
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

