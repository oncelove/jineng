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
                <!-- <el-form-item label="部门名称">
                    <el-input v-model="dialogFrom.deptName" :disabled="dialogDisabled"></el-input>
                </el-form-item> -->
                <el-form-item label="所属部门">
                    <el-select v-model="dialogFrom.deptId" :disabled="dialogDisabled" @change="departmentChange">
                        <el-option v-for="(dept, index) in deptArray" :key="index" :label="dept.name" :value="dept.depid">
                            {{ dept.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单集合" class="rolesMenu">
                    <el-input v-model="dialogFrom.menuIdListShow" :disabled="dialogNoEdit"></el-input>
                    <el-button @click="seeMenus">{{text}}菜单</el-button>
                </el-form-item>
                <el-form-item label="站点集合" class="rolesMenu" v-if="stationShow">
                    <el-input v-model="dialogFrom.stationIdListShow" :disabled="dialogNoEdit"></el-input>
                    <el-button @click="seeStation">{{text}}站点</el-button>
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

        <el-dialog title="菜单信息" :visible.sync="dialogMenusVisible">
            <el-form ref="dialogMenusFrom" :model="dialogMenusFrom" label-width="80px">
                <el-tree
                    :data="menusData"
                    show-checkbox
                    node-key="menuId"
                    ref="meuns"
                    :props="defaultProps"
                    :default-checked-keys="dialogMenusFrom.defaultChecked"
                ></el-tree>
                <el-form-item v-if="dialogMenusBtn">
                    <el-button type="primary" @click="onSubmitMenus">保存</el-button>
                    <el-button @click="dialogMenusVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="站点信息" :visible.sync="dialogStationVisible">
            <el-form ref="dialogMenusFrom" :model="dialogMenusFrom" label-width="80px">
                <el-tree
                    :data="menusData"
                    show-checkbox
                    node-key="menuId"
                    :props="defaultProps"
                    :default-checked-keys="dialogMenusFrom.defaultChecked"
                ></el-tree>
                <el-form-item v-if="dialogMenusBtn">
                    <el-button type="primary" @click="onSubmitMenus('dialogMenusFrom')">保存</el-button>
                    <el-button @click="dialogStationVisible = false">取消</el-button>
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

            text:'查看',

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
            deptArray:[], // 部门列表
            dialogFrom:{
                roleId: null,
                roleName: null,
                departmentId: null,
                deptName: null,
                menuIdList: null,
                menuIdListShow: null,
                stationIdList:null,
                stationIdListShow:null,
                remark: null,
                deptId:null,
            },
            stationShow:false,

            // 菜单树
            dialogMenusVisible:false,
            menusData:[],
            dialogMenusBtn:false,
            dialogMenusFrom:{
                defaultChecked:[],
            },
            defaultProps:{
                children: 'children',
                label: 'name'
            },

            // 站点
            dialogStationVisible:false,
            
        }
    },
    created() {
        this.getRolesList();
        this.rules = rules;
        let constUserType = localStorage.getItem('userType');
        if (constUserType === 3) {
            this.stationShow = true;
        }
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
            getRequest('/api/roles/'+roleId).then( res => {
                console.log(res);
                if (res.data.code === 0) {
                    this.dialogFrom.roleId = res.data.role.roleId;
                    this.dialogFrom.roleName = res.data.role.roleName;
                    this.dialogFrom.departmentId = res.data.role.departmentId;
                    this.dialogFrom.deptName = res.data.role.deptName;
                    this.dialogFrom.menuIdList = res.data.role.menuIdList;
                    this.dialogFrom.menuIdListShow = res.data.role.menuIdList.join(',');
                    this.dialogFrom.stationIdList = res.data.role.stationIdList;
                    this.dialogFrom.stationIdListShow = res.data.role.stationIdList.join(',');
                    this.dialogFrom.remark = res.data.role.remark;
                    this.dialogMenusFrom.defaultChecked = res.data.role.menuIdList;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        addDialogShow(index,row,flag){
            this.dialogTableVisible = true;
            this.deptArray = this.$store.state.departmentArray;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.flag = flag;
            if ( flag === 0 ) {
                this.dialogDisabled = true;
                this.dialogBtn = false;
                this.text = "查看";
                this.dialogMenusBtn = false;
            }

            if ( flag === 2 ) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.text = "编辑";
                this.dialogMenusBtn = true;
            }

            this.getRolesMsg(row.roleId);
        },

        // 删除
        remove(index,row){
            deleteRequest('/api/roles/'+row.roleId).then( res => {
                if ( res.data.code === 0) {
                    this.$notify.success({
                        message:'删除成功',
                        duration: 2000
                    });
                    this.getRolesList();
                } else {
                    this.$message.error(this.data.code+this.data.msg)
                }
            }).catch( err => {
                this.$message.error(err);
            })
        },

        // 查看菜单
        seeMenus(){
            this.dialogMenusVisible = true;
            this.menusData = [];
            getRequest('/api/menus').then( res => {
                console.log(res);
                if ( res.data.code == 0) {
                    this.menusData = res.data.menuList;
                }else {
                    this.$message.error(res.data.code+res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },

        // 查看站点
        seeStation(){
            this.dialogStationVisible = true;
        },

        // 保存菜单
        onSubmitMenus(){
            this.dialogMenusVisible = false;
            let checkedList = this.$refs.meuns.getCheckedNodes();
            let checkedId =[];
            checkedList.map((val, index) => {
                checkedId.push(val.menuId);
            })
            this.dialogFrom.menuIdListShow = checkedId.join(',');
            this.dialogFrom.menuIdList = checkedId;
        },

        // 新增
        addList(){
            this.dialogTableVisible = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogMenusBtn = true;
            this.dialogBtn = true;
            this.text = "编辑";
            this.flag = 1;
            this.dialogDisabled = false;
            this.deptArray = this.$store.state.departmentArray;
            this.dialogFrom.stationIdList = [];
            this.dialogFrom.menuIdList = [];
        },

        departmentChange(selVal){
            this.dialogFrom.departmentId = selVal;
        },

        // 提交
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    this.dialogTableVisible = false;
                    console.log(this.dialogFrom);
                    if ( this.flag === 1) {
                        postJsonRequest('/api/roles',this.dialogFrom).then( res => {
                            console.log(res);
                            if ( res.data.code === 0) {
                                this.$notify.success({
                                    message:'添加成功',
                                    duration: 2000
                                });
                                this.getRolesList();
                            } else {
                                this.$message.error(this.data.code+this.data.msg)
                            }
                        }).catch( err => {
                            console.log(err)
                        })
                        return;
                    }
                    putJsonRequest('/api/roles/'+this.dialogFrom.roleId,this.dialogFrom).then( res => {
                        if ( res.data.code === 0) {
                            this.$notify.success({
                                message:'更新成功',
                                duration: 2000
                            });
                            this.getRolesList();
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