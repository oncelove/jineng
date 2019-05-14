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
            <el-button @click="addList" size="medium">新增</el-button>
        </div>
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
                    <el-button
                        v-if="data.type != 2"
                        type="primary"
                        size="mini"
                        @click="() => addDialogShow(node, data, 0)">
                        查看
                    </el-button>
                    <!-- <el-button
                        v-if="data.type != 2"
                        type="primary"
                        size="mini"
                        @click="() => addDialogShow(node, data, 1)">
                        新增
                    </el-button> -->
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
        <el-dialog title="部门管理信息" :visible.sync="dialogTableVisible" :source="source">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="100px">
                <el-form-item label="父部门id">
                    <el-input v-model="dialogFrom.parentId" :disabled="labelEdit"></el-input>
                </el-form-item>
                <el-form-item label="父部门">
                    <el-input v-model="dialogFrom.parentName" :disabled="labelEdit"></el-input>
                </el-form-item>
                <el-form-item label="部门id">
                    <el-input v-model="dialogFrom.departmentId" :disabled="labelEdit"></el-input>
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
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
    components:{page,searItemsBox},
    data() {
        return {
            searItemShow: false,
            activeIndex: '',
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],
            dialogFrom:{
                parentName:'',
                parentId:'',
                departmentId:'',
                name:'',
                orderNum:'',
            },
            dialogTableVisible:false,
            dialogDisabled: false,
            dialogBtn: false,
            source:true,
            labelEdit: true,
            rules:'',
            flag:'',
            // 部门列表树
            treeData:[],
            defaultProps:{
                children: 'children',
                label: 'name'
            }
        }
    },
    created() {
        this.rules = rules;
        this.getDepartmentsList();
    },
    methods: {
        getDepartmentsList(){
            getRequest('/api/departments').then( res => {
            // console.log(res);
                this.treeData = res.data.deptList;
                let departmentArray = [];
                res.data.deptList.map( (val, index) => {
                    departmentArray.push({
                        depid: val.departmentId,
                        name: val.name,
                    })
                })
                this.$store.commit('changeDepartmentArray',departmentArray);
            }).catch( err => {
                console.log(err);
            });
        },
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        listenChildShowItem(data){
            this.searItemShow = false;
        },
        addList(){
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogFrom.parentId = 0;
        },
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    postJsonRequest('/api/departments', this.dialogFrom).then( res => {
                        console.log(res);
                        if (res.data.code === 0) {
                            this.dialogTableVisible = false;
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res.data.code+res.data.msg);
                        }
                    }).catch( err => {
                        this.$message.error(err);
                    })
                } else {
                    this.$message.error('验证失败');
                    return false;
                }
            })
        },

        // 树结构
        //新增
        addDialogShow(node,data,flag) {

            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.flag = flag;
            this.dialogBtn = true;

            if (flag === 0 || flag === 2) {
                this.dialogFrom.parentId = data.parentId;
                this.dialogFrom.parentName = data.parentName;
                this.dialogFrom.departmentId = data.departmentId;
                this.dialogFrom.name = data.name;
                this.dialogFrom.orderNum = data.orderNum;
            }

            if (flag === 0) {
                this.dialogDisabled = true;
                this.dialogBtn = false;
            }

            if ( flag === 1) {
                this.dialogFrom.parentId = data.departmentId;
                this.dialogFrom.parentName = data.name;
            }

        },
        onSubmit(formName) {
           this.$refs[formName].validate( (valid) => {
                if(valid){
                    // 编辑
                    if ( this.flag === 2 ) {
                        putJsonRequest('/api/departments/'+this.dialogFrom.departmentId,this.dialogFrom).then( res => {
                            this.dialogTableVisible = false;
                            if (res.data.code == 0) {
                                this.$notify.success({
                                    message:'更新成功',
                                    duration: 2000
                                });
                                this.getDepartmentsList();
                            }else{
                                this.$message.error(this.data.code+this.data.msg)
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                        return;
                    }
                    // 新增
                    postJsonRequest('/api/departments',this.dialogFrom).then( res => {
                        this.dialogTableVisible = false;
                        if (res.data.code == 0) {
                            this.$notify.success({
                                message:'添加成功',
                                duration: 2000
                            });
                            this.getDepartmentsList();
                        }else{
                            this.$message.error(this.data.code+this.data.msg)
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
            deleteRequest('/api/departments/'+data.departmentId).then( res => {
                if (res.data.code == 0) {
                    this.getDepartmentsList();
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