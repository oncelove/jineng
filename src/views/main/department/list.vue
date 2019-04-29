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
                <a href="javascript:;" @click="addList">添加</a>
                <a href="javascript:;">删除</a>
            </li>
        </ul>
        <!-- <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="departmentId" label="departmentId" width="150">
            </el-table-column>
            <el-table-column fixed prop="agentName" label="项目名称">
            </el-table-column>
            <el-table-column prop="name" label="name">
            </el-table-column>
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
        </el-table> -->
        <!-- <el-tree
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            accordion
            node-key="departmentId"
            @node-click="handleNodeClick"
            :render-content="renderContent"
        ></el-tree> -->
        <!-- <page></page> -->
        <el-dialog title="部门管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="部门名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="dialogFrom.orderNum" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="父部门ID">
                    <el-input v-model="dialogFrom.parentId" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="dialogFrom.type" :disabled="dialogDisabled"></el-input>
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
export default {
    components:{page,searItemsBox},
    data() {
        return {
            tableData:[],
            dialogData: [],
            dialogTableVisible: false,
            dialogDisabled: false,
            dialogBtn: true,
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
                type:'0',
                parentId:'',
                name:'',
                orderNum:'',
            },
            // 部门列表树
            treeData:[],
            defaultProps:{
                children: 'children',
                label: 'name'
            }
        }
    },
    created() {
        getRequest('/departments').then( res => {
            // console.log(res);
            this.tableData = res.data.deptList;
            this.treeData = res.data.deptList;
            console.log( this.treeData);
        }).catch( err => {
            console.log(err);
        });

        getRequest('/departments/select').then( res => {
            console.log(res);
        }).catch( err => {
            console.log(err);
        });
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
        addList(){
            this.dialogTableVisible = true;
        },
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    postJsonRequest('/departments', this.dialogFrom).then( res => {
                        console.log(res);
                        if (res.data.code === 0) {
                            this.dialogTableVisible = false;
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res.data.code,res.data.msg);
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
        handleNodeClick(data){
            // console.log(data)
        },
        renderContent(h, { node, data, store }) {
            return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                    <span>
                    <span>{node.label}</span>
                    </span>
                    <span>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>Append</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
                    </span>
                </span>);
        },
        append(data) {
            const newChild = { departmentId: id++, label: 'testtest', children: [] };
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
            console.log(data);
        },

        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },
    },
}
</script>

<style lang="scss">
    
</style>