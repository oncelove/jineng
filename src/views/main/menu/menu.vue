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
                <a href="javascript:;" @click="addDialogShow('','',3)">添加</a>
                <!-- <a href="javascript:;">删除</a> -->
            </li>
        </ul>
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
                        @click="() => addDialogShow(node, data, 0)">
                        查看
                    </el-button>
                    <el-button
                        v-if="data.type != 2"
                        type="primary"
                        size="mini"
                        @click="() => addDialogShow(node, data, 1)">
                        新增
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
        <!-- <page></page> -->
        <el-dialog title="菜单管理信息" :visible.sync="dialogTableVisible" :source="source">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="100px">
                <el-form-item label="父菜单">
                    <el-input v-model="dialogFrom.parentName" :disabled="labelEdit"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="菜单URL">
                    <el-input v-model="dialogFrom.url" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="权限标识符" prop="perms">
                    <el-input v-model="dialogFrom.perms" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <el-radio :label="0">目录</el-radio>
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="dialogFrom.icon" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input v-model="dialogFrom.orderNum" :disabled="dialogDisabled"></el-input>
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
import rules from '@/tool/rules'
export default {
    components:{page, searItemsBox},
    data() {
        return {
            tableData:[],
            dialogData: [],
            searItemShow: false,
            activeIndex: '',
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],

            rules:{},

            //树状
            treeData:[],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            flag:null,

             // 弹窗的
            dialogFrom:{
                parentId: null,
                parentName: null,
                name: null,
                url: null,
                perms: null,
                type: null,
                icon: null,
                orderNum: null,
            },
            dialogTableVisible:false,
            dialogDisabled: false,
            dialogBtn: false,
            source:true,
            labelEdit: true,
        }
    },
    created() {
        this.rules = rules;
        this.getMenusList();
    },
    mounted(){
        
    },
    methods: {
        getMenusList(){
            getRequest('/api/menus').then( res => {
                console.log(res);
                if ( res.data.code == 0) {
                    this.getIdIsShow(res.data.menuList,res.data.menuIdList);
                    this.treeData = res.data.menuList;
                    
                }else {
                    this.$message.error(res.data.code+res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        listenChildShowItem(data){
            this.searItemShow = false;
        },

        // 树结构
        //新增
        addDialogShow(node,data,flag) {
            console.log(flag)
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            console.log(this.dialogFrom);
            this.dialogTableVisible = true;
            this.flag = flag;

            if (flag === 0 || flag === 2) {
                this.dialogFrom.url = data.url;
                this.dialogFrom.type = data.type;
                this.dialogFrom.name = data.name;
                this.dialogFrom.orderNum = data.orderNum;
                this.dialogFrom.perms = data.perms;
                this.dialogFrom.icon = data.icon;
                this.dialogFrom.parentName = node.parent.label;
            }
            
            if (flag === 0) {
                this.dialogDisabled = true;
                this.dialogBtn = false;
            }

            if (flag === 2) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.dialogFrom.menuId = data.menuId;
                this.dialogFrom.parentId = data.parentId;
            }

            if ( flag === 1 ) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.dialogFrom.parentName = data.name;
                this.dialogFrom.parentId = data.menuId;
            }

            if ( flag === 3 ) {
                this.dialogFrom.parentId = 0;
                this.dialogBtn = true;
            }
            
        },
        onSubmit(formName) {
           this.$refs[formName].validate( (valid) => {
                if(valid){
                    
                    // 编辑
                    if ( this.flag === 2 ) {
                        console.log(this.dialogFrom);
                        putJsonRequest('/api/menus/'+this.dialogFrom.menuId,this.dialogFrom).then( res => {
                            console.log(res);
                            this.dialogTableVisible = false;
                            if (res.data.code == 0) {
                                this.getMenusList();
                                this.$notify.success({
                                    message:'更新成功',
                                    duration: 2000
                                })
                            }else{
                                console.log()
                                this.$message.error(res.data.code+res.data.msg)
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                        return;
                    }
                    // 添加
                    console.log(this.dialogFrom);
                    postJsonRequest('/api/menus',this.dialogFrom).then( res => {
                        console.log(res);
                        this.dialogTableVisible = false;
                        if (res.data.code == 0) {
                            this.getMenusList();
                            this.$notify.success({
                                message:'添加成功',
                                duration: 2000
                            })
                        }else{
                            this.$message.error(res.data.code+res.data.msg)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                } else {
                    this.$message.error('验证未通过，请检查');
                }
            })
        },
        remove(node, data) {
            deleteRequest('/api/menus/'+data.menuId).then( res => {
                console.log(res)
                if (res.data.code == 0) {
                    this.getMenusList();
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.data.code+res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },

        getIdIsShow(menusArr,){

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
</style>