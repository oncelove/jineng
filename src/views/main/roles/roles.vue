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
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="roleId" label="角色ID"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="departmentId" label="部门ID"></el-table-column>
            <el-table-column prop="deptName" label="部门名称"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="remark" label="备注信息"></el-table-column>
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
                        @click="() => addDialogShow(scope.$index,scope.row,2)">
                        更新
                    </el-button>
                    <el-button
                        type="danger"
                        size="mini"
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
        <el-dialog title="角色管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="角色ID">
                    <el-input v-model="dialogFrom.roleId" :disabled="dialogNoEdit"></el-input>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="dialogFrom.roleName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="部门ID">
                    <el-input v-model="dialogFrom.departmentId" :disabled="dialogNoEdit"></el-input>
                </el-form-item>
                <el-form-item label="部门名称">
                    <el-input v-model="dialogFrom.deptName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="菜单集合" class="rolesMenu">
                    <el-input v-model="dialogFrom.menuIdList" :disabled="dialogNoEdit"></el-input>
                    <el-button>菜单</el-button>
                </el-form-item>
                <el-form-item label="站点集合">
                    <el-input v-model="dialogFrom.stationIdList" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="备注信息">
                    <el-input v-model="dialogFrom.remark" :disabled="dialogDisabled"></el-input>
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
            dialogBtn:true,
            dialogNoEdit:true,
            flag:'',
            dialogFrom:{
                roleId: null,
                roleName: null,
                departmentId: null,
                deptName: null,
                menuIdList: null,
                stationIdList:null,
                remark: null,
            },
        }
    },
    created() {
        this.getRolesList();
        this.rules = rules;
    },
    methods: {

        getRolesList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };
            getRequest('/api/roles',getData).then( res => {
                console.log(res);
                this.tableData = res.data.page.list;
                this.totalCount = res.data.page.totalCount;
            }).catch( err => {
                console.log(err);
            })
        },

        getRolesMsg(roleId){
            this.dialogFrom.stationIdList = [];
            console.log(typeof(this.dialogFrom.stationIdList));
            
            getRequest('/api/roles/'+roleId).then( res => {
                console.log(res);
                if (res.data.code === 0) {
                    this.dialogFrom.roleId = res.data.role.roleId;
                    this.dialogFrom.roleName = res.data.role.roleName;
                    this.dialogFrom.departmentId = res.data.role.departmentId;
                    this.dialogFrom.deptName = res.data.role.deptName;
                    this.dialogFrom.menuIdList = res.data.role.menuIdList;
                    this.dialogFrom.stationIdList.push(res.data.role.stationIdList);
                    console.log(typeof(res.data.role.stationIdList));
                    console.log(typeof(this.dialogFrom.stationIdList));
                    this.dialogFrom.remark = res.data.role.remark;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        addDialogShow(index,row,flag){
            this.dialogTableVisible = true;
            
            
            this.flag = flag;
            if ( flag === 0 ) {
                this.dialogDisabled = true;
                this.dialogBtn = false;
            }

            if ( flag === 2 ) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
            }

            this.getRolesMsg(row.roleId);
        },

        remove(index,row){

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
            console.log(val);
            this.getRolesList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            console.log(val);
            this.getRolesList(val);
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
</style>