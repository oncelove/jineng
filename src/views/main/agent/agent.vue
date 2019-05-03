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
                <a href="javascript:;">删除</a>
            </li>
        </ul>
        <el-row :gutter="20" class="agentsBox">
            <el-col :span="12">
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
                            <el-button
                                type="primary"
                                size="mini"
                                v-if="data.$treeNodeId == 1"
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
                        </div>
                    </div>
                </el-tree>
            </el-col>
            <el-col :span="12">
                <div class="CustomerBox">
                    <el-table :data="tableData" style="width: 100%"  class="table-box">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="agentName" label="运营商名称"></el-table-column>
                        <el-table-column prop="customerName" label="客户名"></el-table-column>
                        <el-table-column prop="contacts" label="联系人"></el-table-column>
                        <el-table-column prop="phone" label="手机"></el-table-column>
                        <el-table-column prop="address" label="地址"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                            <el-button
                                    @click="handleClick(scope.$index,scope.row)"
                                    type="text"
                                    size="small"
                                    >查看</el-button
                                >
                                <el-button type="text" size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>
        <el-dialog title="运营商管理信息" :visible.sync="dialogTableVisible">
            <el-table :data="dialogData">
                <el-table-column property="name" label="name" width="150"></el-table-column>
                <el-table-column property="parentId" label="parentId" width="200"></el-table-column>
                <el-table-column property="agentId" label="agentId"></el-table-column>
            </el-table>
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
        }
    },
    created() {
        getRequest('/api/agent').then( res => {
            console.log(res);
            this.treeData = res.data.agentList;
            // console.log( this.tableData);
        }).catch( err => {
            console.log(err);
        })
    },
    methods: {
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
            console.log(data);
            if (flag === 0) {
                getRequest('/api/customers?agentId='+data.agentId).then( res => {
                    console.log(res);
                }).catch( err => {
                    console.log(err);
                })
            }
        },

        // 每页数据条数
        showSizeChange(val){
            console.log(val);
            this.getCustomerList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            console.log(val);
            this.getCustomerList(val);
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