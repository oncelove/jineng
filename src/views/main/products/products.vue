<template>
    <div>
        <!-- <ul class="top-search-box">
            <li class="active" v-for="(serchItem, index) in searchTextItem" :key="index">
                <em>{{serchItem.codeText}}</em>
                <div class="list-boxs" @click="itemShowFunc(index)">
                    <code>{{serchItem.selectText}}</code>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                    <searItemsBox
                        class="item-box" 
                        v-if="index == activeIndex && searItemShow"
                        v-on:listenToChildEvent="listenChildShowItem"
                    ></searItemsBox>
                </div>
            </li>
            <li class="operation">
                <a href="javascript:;">查询</a>
                <a href="javascript:;" @click="addList">添加</a>
            </li>
        </ul> -->
        <div class="filter-container">
            <el-button @click="addList" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="nodeType" label="节点类型">
                <template slot-scope="scope">
                    <em v-if="scope.row.nodeType === 0">设备</em>
                    <em v-else>网关</em>
                </template>
            </el-table-column>
            <el-table-column prop="isShow" label="是否显示产品">
                <template slot-scope="scope">
                    <em v-if="scope.row.isShow === 0">不显示</em>
                    <em v-else>显示</em>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="站点描述"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="240">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="() => addDialogShow(scope.$index,scope.row,0)">
                        查看
                    </el-button>
                    <el-button
                        type="primary"
                        plain 
                        size="mini"
                        v-if="permissionsBox.updateBtn"
                        @click="() => addDialogShow(scope.$index,scope.row,2)">
                        更新
                    </el-button>
                    <el-button
                        type="danger"
                        size="mini"
                        v-if="permissionsBox.deleteBtn"
                        @click="() => remove(scope.$index,scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>
        <el-dialog title="产品管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="产品编号">
                    <el-input v-model="dialogFrom.id" :disabled="noClick"></el-input>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="节点类型">
                    <el-radio-group v-model="dialogFrom.nodeType" :disabled="disabledNoEdit">
                        <el-radio :label="0">设备</el-radio>
                        <el-radio :label="1">网关</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio-group v-model="dialogFrom.isShow" :disabled="dialogDisabled">
                        <el-radio :label="0">不显示</el-radio>
                        <el-radio :label="1">显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="站点描述">
                    <el-input v-model="dialogFrom.description" :disabled="dialogDisabled"></el-input>
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
import searItemsBox from '@/components/searItemsBox'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
import rules from '@/tool/rules.js'
import { mapMutations } from 'vuex';
import { power } from '@/tool/power.js'
export default {
    components:{page, searItemsBox},
    data() {
        return {
            tableData:[],
            
            searItemShow: false,
            activeIndex: '',
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],

            // 总条数
            totalCount:null,

            // 校验规则
            rules:{},

            // dialog需要的
            dialogTableVisible: false,
            dialogDisabled:false,
            disabledNoEdit:false,
            dialogBtn:true,
            dialogNoEdit:true,
            flag:'',
            dialogFrom:{
                id: null,
                name: null,
                nodeType: null,
                isShow: null,
                description: null,
                createUser:null,
                updateUser:null,
            },
            stationShow:false,

            noClick:true,

            permissionsBox:null,
            
        }
    },
    created() {
        this.permissionsBox = power(this,'sys:products:info','sys:products:add','sys:products:delete','sys:products:update');
        this.getProsList();
        this.rules = rules;
    },
    methods: {
        getUserID(){
            this.dialogFrom.createUser = this.$store.state.usersList.userId;
            this.dialogFrom.updateUser = this.$store.state.usersList.userId;
        },
        getProsList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };
            getRequest('/test/products',getData).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        getProsMsg(roleId){
            getRequest('/test/products/'+roleId).then( res => {
                // console.log(res);
                if (res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.name = res.data.data.name;
                    this.dialogFrom.nodeType = res.data.data.nodeType;
                    this.dialogFrom.isShow = res.data.data.isShow;
                    this.dialogFrom.description = res.data.data.description;
                    // this.dialogFrom.createUser = this.$store.state.usersList
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        addDialogShow(index,row,flag){
            this.dialogTableVisible = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.flag = flag;
            this.disabledNoEdit = true;
            if ( flag === 0 ) {
                this.dialogDisabled = true;
                this.dialogBtn = false;
                this.dialogMenusBtn = false;
            }

            if ( flag === 2 ) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.dialogMenusBtn = true;
            }

            this.getUserID();
            this.getProsMsg(row.id);
        },

        // 删除
        remove(index,row){
            deleteRequest('/test/products/'+row.id).then( res => {
                if ( res.data.code === 0) {
                    this.$notify.success({
                        message:'删除成功',
                        duration: 2000
                    });
                    this.getProsList();
                } else {
                    this.$message.error(this.data.code+this.data.msg)
                }
            }).catch( err => {
                this.$message.error(err);
            })
        },

        // 新增
        addList(){
            this.dialogTableVisible = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogMenusBtn = true;
            this.dialogBtn = true;
            this.flag = 1;
            this.dialogDisabled = false;
            this.disabledNoEdit = false;
        },

        departmentChange(selVal){
            this.dialogFrom.departmentId = selVal;
        },

        // 提交
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    this.dialogTableVisible = false;
                    if ( this.flag === 1) {
                        postJsonRequest('/test/products',this.dialogFrom).then( res => {
                            if ( res.data.code === 0) {
                                this.$notify.success({
                                    message:'添加成功',
                                    duration: 2000
                                });
                                this.getProsList();
                            } else {
                                this.$message.error(res.data.code+res.data.msg)
                            }
                        }).catch( err => {
                            console.log(err)
                        })
                        return;
                    }
                    putJsonRequest('/test/products/'+this.dialogFrom.id,this.dialogFrom).then( res => {
                        // console.log(res);
                        if ( res.data.code === 0) {
                            this.$notify.success({
                                message:'更新成功',
                                duration: 2000
                            });
                            this.getProsList();
                        } else {
                            this.$message.error(this.data.code+this.data.msg)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            });
        },

        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        listenChildShowItem(data){
            this.searItemShow = false;
        },

        // 每页数据条数
        showSizeChange(val){
            this.getProsList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getProsList(val);
        }
    },
}
</script>

<style lang="scss">
.rolesMenu{
    .el-form-item__content{
        display: flex;
        justify-content: flex-start;
        .el-button{
            position: absolute;
            right: 0;
        }
    }
}
em{
    font-style: normal;
}
</style>