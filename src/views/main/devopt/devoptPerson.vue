<template>
    <div>
        运维人员
        <div class="filter-container">
            <el-button @click="addNews" size="medium">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="运维人员"></el-table-column>
            <el-table-column prop="agentId" label="运营商编号"></el-table-column>
            <el-table-column prop="position" label="职位"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
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
                <el-form-item label="运维人员名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="运营商编号">
                    <!-- <el-input v-model="dialogFrom.agentId" :disabled="dialogDisabled"></el-input> -->
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled" 
                        :agentId="dialogFrom.agentId"
                        :agentName="dialogFrom.agentName">
                    </operatorChange>
                </el-form-item>
                <el-form-item label="职位类型">
                    <el-input v-model="dialogFrom.position" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <!-- <el-form-item label="运维类型">
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <el-radio :label="1">智慧用电用户</el-radio>
                        <el-radio :label="2">配电房托管基础用户（线上托管）</el-radio>
                        <el-radio :label="3">配电房托管中级用户（线上加线下巡检</el-radio>
                        <el-radio :label="4">配电房高级用户（线上 线下巡检  年度试验和保养）</el-radio>
                        <el-radio :label="5">配电全托管用户（高级用户+现场专业值守人员）</el-radio>
                        <el-radio :label="6">能耗综合托管用户</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="电话">
                    <el-input v-model="dialogFrom.phone" :disabled="dialogDisabled"></el-input>
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
                name: null,
                phone: null,
                position: null,
                agentId: null,
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

            getRequest('/mode/maintenance/operators',getData).then((res) => {
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                }else{
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch((err) => {
                console.log(err);
            });

            // 
        },

        getRecordPerson(rowID){
            getRequest('/mode/maintenance/operators/'+rowID).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.dialogFrom.name = res.data.data.name;
                    this.dialogFrom.phone = res.data.data.phone;
                    this.dialogFrom.position = res.data.data.position;
                    this.dialogFrom.agentId = res.data.data.agentId;
                    this.dialogFrom.id = res.data.data.id;
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
            deleteRequest('/mode/maintenance/operators/'+row.id).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.$message.success('删除成功！！！')
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
        },

        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if ( this.flag === 1) {
                        postJsonRequest('/mode/maintenance/operators',this.dialogFrom).then( res => {
                            // console.log(res);
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
                        putJsonRequest('/mode/maintenance/operators/'+this.dialogFrom.id,this.dialogFrom).then( res => {
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

