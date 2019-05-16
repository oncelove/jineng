<template>
    <div>
        运维类型
        <div class="filter-container">
            <el-button @click="addNews" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="id" width="100"></el-table-column>
            <el-table-column prop="name" label="运维类型"></el-table-column>
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
                </template>
            </el-table-column>
        </el-table>
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>

        <el-dialog title="运维类型" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="100px">
                <el-form-item label="运维名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
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
                name:null,
            },
            rules:null,

            flag:null,

            permissionsBox:null,
        }
    },
    created(){
        this.permissionsBox = power(this,'sys:devoptType:info','sys:devoptType:save','sys:devoptType:delete','sys:devoptType:update');
    },
    methods:{
        getRecordList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };

            getRequest('/operation/maintenance/faultTypes',getData).then((res) => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data;
                    this.totalCount = res.data.data.total;
                }else{
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        getRecordPerson(rowID){
            getRequest('/operation/maintenance/faultTypes/'+rowID, this.dialogFrom).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.name = res.data.data.name;
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
            deleteRequest('/operation/maintenance/faultTypes/'+row.id).then( res => {
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
                        postJsonRequest('/operation/maintenance/faultTypes',this.dialogFrom).then( res => {
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
                        putJsonRequest('/operation/maintenance/faultTypes/'+this.dialogFrom.id,this.dialogFrom).then( res => {
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
            this.dialogFrom.agentId = val;
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

