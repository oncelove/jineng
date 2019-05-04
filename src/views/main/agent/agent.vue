<template>
    <div>
        <ul class="top-search-box">
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
                <a href="javascript:;" @click="added">新增</a>
            </li>
        </ul>
        <el-row :gutter="20" class="agentsBox">
            <el-col :span="8">
                <el-tree
                    empty-text="暂无数据"
                    ref="tree"
                    :data="treeData"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    node-key="id"
                >
                    <!-- @check="handleCheck" :render-content="renderContent" -->
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <div><i class="el-icon-menu"></i>{{ node.label }}</div>
                        <div>
                            <!-- v-if="data.type != 2" -->
                            <el-button @click="goNewWindows" size="mini">跳转</el-button>
                            <el-button
                                type="primary"
                                size="mini"
                                v-if="data.parentId === 0"
                                @click="() => addDialogShow(node, data, 1)">
                                添加
                            </el-button>
                            <el-button
                                type="primary"
                                size="mini"
                                @click="() => addDialogShow(node, data, 0)">
                                查看
                            </el-button>
                            <el-button
                                v-if="data.type != 2"
                                type="primary"
                                plain 
                                size="mini"
                                @click="() => addDialogShow(node, data, 2)">
                                更新
                            </el-button>
                            <el-button
                                type="danger"
                                size="mini"
                                @click="() => remove(node, data)">
                                删除
                            </el-button>
                            <el-button
                                size="mini"
                                @click="() => transfer(node, data)">
                                转移
                            </el-button>
                        </div>
                    </div>
                </el-tree>
            </el-col>
            <el-col :span="16">
                <div class="CustomerBox">
                    <el-table :data="tableData" style="width: 100%"  class="table-box">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="agentName" label="运营商名称"></el-table-column>
                        <el-table-column prop="customerName" label="客户名"></el-table-column>
                        <el-table-column prop="contacts" label="联系人"></el-table-column>
                        <el-table-column prop="phone" label="手机"></el-table-column>
                        <el-table-column prop="address" label="地址"></el-table-column>
                        <!-- <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                            <el-button
                                    @click="handleClick(scope.$index,scope.row)"
                                    type="text"
                                    size="small"
                                    >查看</el-button
                                >
                                <el-button type="text" size="small">编辑</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
            </el-col>
        </el-row>
        
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>
        <el-dialog title="运营商信息" :visible.sync="dialogTableVisible" >
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="120px">
                <el-form-item label="父运营商id">
                    <el-input v-model="dialogFrom.parentId" :disabled="noDisabled"></el-input>
                </el-form-item>
                <el-form-item label="经销商名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="dialogFrom.orderNum" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogBtn">
                    <el-button type="primary" @click="onSubmit('dialogFrom')">保存</el-button>
                    <el-button @click="dialogTableVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="迁移客户" :visible.sync="transferVisible">
            <el-form ref="transferFrom" :model="transferFrom" >
                <el-form-item label="客户名">
                    <el-select v-model="transferData" multiple placeholder="请选择">
                        <el-option
                            v-for="item in transferOptions"
                            :key="item.customerId"
                            :label="item.contacts"
                            :value="item.customerId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运营商">
                    <el-cascader
                        :options="options"
                        :props="optionProps"
                        v-model="selectedOptions"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="transferSubmit('transferFrom')">保存</el-button>
                    <el-button @click="transferVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import page from '@/components/page'
import searItemsBox from '@/components/searItemsBox'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
export default {
    components:{page,searItemsBox},
    data() {
        return {
            tableData:[],
            dialogData: [],
            dialogTableVisible: false,
            searItemShow: false,
            activeIndex: '',
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],

            //树状
            treeData:[],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            flag:null,

            // 总条数
            totalCount:null,

            defaultAgentId:'',

            // 弹窗的
            dialogFrom:{
                parentId: 0,
            },
            dialogTableVisible:false,
            dialogDisabled: false,
            dialogBtn: false,
            noDisabled: true,

            transferVisible:false,
            transferData:[],
            transferOptions:[],
            transferFrom:{},

            selectedOptions:[],
            options:[],
            optionProps:{
                value: 'agentId',
                label: 'name',
                children: 'children'
            },
        }
    },
    created() {
        this.getAgentList();
    },
    methods: {

        getAgentList(){
            getRequest('/api/agent').then( res => {
                // console.log(res);
                this.treeData = res.data.agentList;
                // console.log( this.tableData);
            }).catch( err => {
                console.log(err);
            })
        },

        handleClick(index,row){
            this.dialogTableVisible = true;
            this.dialogData = [];
            this.dialogData.push(row);
            console.log(index,row);
        },
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        listenChildShowItem(data){
            this.searItemShow = false;
        },

        addDialogShow(node,data,flag){
            this.defaultAgentId = data.agentId;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            if (flag === 0) {
                this.getCustomersList();
            }

            if ( flag === 1 || flag === 2) {
                this.dialogTableVisible = true;
                this.dialogBtn = true;
                this.dialogFrom.parentId = data.agentId;
            }

            if (flag === 2) {
                this.dialogFrom.name = data.name;
                this.dialogFrom.orderNum = data.orderNum;
            }
        },

        getCustomersList(current, size){

            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
                customerId: this.customerId
            }

            getRequest('/api/customers?agentId='+this.defaultAgentId,getData).then( res => {
                if ( res.data.code === 0) {
                    this.tableData = res.data.page.list;
                    this.totalCount = res.data.page.totalCount;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        goNewWindows(){
            // window.open('http://localhost:8080/','_blank','menubar=no,toolbar=no,status=no,scrollbars=yes')
        },

        added(){
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogFrom.parentId = 0;
        },

        onSubmit(){
            this.dialogTableVisible = false;
            postJsonRequest('/api/agent',this.dialogFrom).then( res => {
                if (res.data.code === 0) {
                    this.$message.success(res.data.msg);
                    this.getAgentList();
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        remove(node,data){
            deleteRequest('/api/agent/'+data.agentId).then( res => {
                if (res.data.code === 0) {
                    this.$message.success(res.data.msg);
                    this.getAgentList();
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        transfer(node, data){
            console.log(data);
            this.transferVisible = true;
            // this.transferOptions
            getRequest('/api/customers?agentId='+data.agentId).then( res => {
                console.log(res);
                this.transferOptions = res.data.page.list;
            }).catch( err => {
                console.log(err);
            });

            getRequest('/api/agent/select').then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.options = res.data.agentList;
                } else {
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },

        handleChange(nowval){
            console.log(nowval);
            this.dialogFrom.agentId = nowval[0];
        },

        transferSubmit(){
            this.transferVisible = false;
            let postData = {
                ids: this.transferData,
                targetId: this.selectedOptions
            }
            postJsonRequest('/api/agent/transfer',postData).then( res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },

        // 每页数据条数
        showSizeChange(val){
            this.getCustomersList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getCustomersList(val);
        }
    },
}
</script>

<style lang="scss" scope>
.el-tree-node{
    padding: 10px;
}
.el-tree-node__content {
    padding: 10px 0;
    .custom-tree-node {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.CustomerBox{
    margin: 30px 0 20px;
    box-shadow: 0 0 10px rgba(50, 51, 50, 0.1);
    border-radius: 12px;
    background: #FFF;
}
</style>