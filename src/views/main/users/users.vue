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
                <a href="javascript:;">删除</a>
            </li>
        </ul>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="deptName" label="所属部门"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <i v-if="scope.row.is_show===0" class="el-icon-close"></i>
                    <i v-else class="el-icon-check"></i>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
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
        <el-dialog title="用户信息" :visible.sync="dialogTableVisible" :source="source">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="dialogFrom.username" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="dialogFrom.password" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptId">
                    <el-select v-model="dialogFrom.deptId" :disabled="dialogDisabled">
                        <el-option v-for="(dept, index) in deptArray" :key="index" :label="dept.name" :value="dept.depid">
                            {{ dept.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="dialogFrom.email" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="dialogFrom.mobile" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="dialogFrom.status" :disabled="dialogDisabled">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色" prop="roleIdList">
                    <el-checkbox-group v-model="roleIdList" :disabled="dialogDisabled">
                        <el-checkbox :label="roles.roleId" v-for="(roles,index) in rolesArray" :key="index">
                            {{roles.roleName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="角色属性" prop="userType">
                    <el-radio-group v-model="dialogFrom.userType" :disabled="dialogDisabled">
                        <el-radio v-for="(usertype,index) in usersType" :key="index" :label="usertype.id" @change="radioChange">
                            <!-- {{usertype.id}}-- -->
                            {{usertype.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="运营商" v-if="OperatorShow">
                    <operatorChange v-on:lintenToChildSelected="selectedOptions" :disabled="dialogDisabled" :agentId="dialogFrom.agentId"></operatorChange>
                </el-form-item>
                <el-form-item label="客户" v-if="CustomerShow">
                    <CustomerChange 
                        :agentId="dialogFrom.agentId"
                        v-on:lisenTochildCustomer="lisenTochildCustomer" 
                        :disabled="dialogDisabled" 
                        :customerId="dialogFrom.customerId">
                    </CustomerChange>
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
import rules from '@/tool/rules.js'
import operatorChange from '@/components/operatorChange'
import CustomerChange from '@/components/CustomerChange'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
export default {
    components:{page, searItemsBox, operatorChange, CustomerChange},
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
            source: true, // 默认是新增
            // 显示弹窗
            dialogTableVisible: false,
            // disabled 表单是否可编辑
            dialogDisabled: true,
            // dialogBtn 表单是否可以提交
            dialogBtn: false,
            // 弹窗显示的数据
            deptArray:[], // 部门列表
            rolesArray:[], // 角色列表
            roleIdList: [], // 用户所属角色
            dialogFrom:{
                username:'', // 用户名
                password:'', // 密码
                mobile:'', // 手机
                email:'', // 邮件
                status: null, // 状态
                deptId:'', // 所属部门
                roleIdList: [], // 用户所属角色
                userId:null,
                userType:'',// 角色属性状态
                salt:'',
                agentId:0,  // 运营商id
                customerId:null, // 客户id
            },
            // 角色属性
            usersTypeStatus:'',
            usersType:[
                {id:1,name:'极能管理员'},
                {id:2,name:'运营商'},
                {id:3,name:'客户'},
                {id:4,name:'客户下角色'},
            ],
            // 校验规则
            rules:{},
            // 总条数
            totalCount:null,

            OperatorShow:false,
            CustomerShow:false,
        }
    },
    created() {
        this.getUsersList();
        this.rules = rules;
    },
    mounted(){
        
    },
    methods: {
        // 获取列表数据
        getUsersList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            }
            getRequest('/api/users',getData).then( res => {
                console.log(res);
                this.tableData = res.data.page.list;
                this.totalCount = res.data.page.totalCount;
                // console.log(this.totalCount);
            }).catch( err => {
                console.log(err);
                this.$message.error(err);
            });
        },
        // 获取用户信息
        getUserMsg(userId,whereClick,salt){
            this.dialogTableVisible = true;
            this.source = false;
            this.rolesArray = this.$store.state.roleNames;
            this.deptArray = this.$store.state.departmentArray;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.roleIdList = new Array();
            this.dialogFrom.salt = salt;
            if (whereClick) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.dialogFrom.userId = userId;
            } else {
                this.dialogDisabled = true;
                this.dialogBtn = false;
            }
            // this.getUserType();
            getRequest('/api/users/'+ userId).then( res => {
                console.log(res);
                if ( res.data.code === 0 ) {
                    this.dialogFrom.username = res.data.user.username;
                    this.dialogFrom.mobile = res.data.user.mobile;
                    this.dialogFrom.email =  res.data.user.email;
                    this.dialogFrom.status =  res.data.user.status;
                    this.dialogFrom.deptId =  res.data.user.deptId;
                    this.dialogFrom.userType = res.data.user.userType;
                    this.roleIdList = res.data.user.roleIdList;
                    this.dialogFrom.agentId = res.data.user.agentId;
                    this.dialogFrom.customerId = res.data.user.customerId;
                    if (this.dialogFrom.userType != 1) {
                        this.OperatorShow = true;
                    } else {
                        this.OperatorShow = false;
                    }

                    if ( this.dialogFrom.userType != 1 && this.dialogFrom.userType != 2) {
                        this.CustomerShow = true;
                    } else {
                        this.CustomerShow =false;
                    }
                }else{
                    this.$message.error(res.data.code+res.data.msg);
                }
            }).catch( err => {
                console.log(err);
                this.$message.error(err);
            })
        },
        // 获取用户属性
        getUserType(){
            if (this.$store.state.usersList) {
                this.usersTypeStatus = this.$store.state.usersList.userType;
                this.usersType.map( (val, index) => {
                    if (this.usersTypeStatus == val.id) {
                        if ( index != 0 ) {
                            let len = index + 1;
                            this.usersType.splice(index,len);
                        }
                    }
                })
            } else {
                this.$message.error('用户角色属性为空，请重新登录');
                this.$router.push({path:'/login'});
            }
        },
        // 查看按钮点击
        handleClick(index,row){
            this.getUserMsg(row.userId);
            // console.log(index,row);
        },
        // 编辑按钮点击
        editClick(index,row){
            this.getUserMsg(row.userId, true,row.salt);
        },
        // 删除按钮点击
        deleteClick(index,row){
            console.log(index,row);
            deleteRequest('/api/users/' + row.userId).then( res => {
                if (res.data.code === 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getUsersList();
                } else {
                    this.$message.error(res.data.code+res.data.msg);
                }
            }).catch( err=> {
                console.log(err);
                this.$message.error(err);
            })
        },
        // 新增按钮点击
        added(){
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.source = true;
            this.rolesArray = this.$store.state.roleNames;
            this.deptArray = this.$store.state.departmentArray;
            this.roleIdList = new Array();
            this.dialogFrom.agentId = 0;
        },
        // 搜索下拉框点击
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        // 子组件传值，鼠标移出隐藏下拉框
        listenChildShowItem(data){
            this.searItemShow = false;
        },
        // 保存修改内容
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                console.log(this.dialogFrom);
                if (valid) {
                    this.dialogFrom.roleIdList = this.roleIdList;
                    if ( this.source ) {
                        postJsonRequest('/api/users',this.dialogFrom).then( res => {
                            if (res.data.code === 0) {
                                this.dialogTableVisible = false;
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.getUsersList();
                            } else {
                                this.$message.error(res.data.code+res.data.msg);
                            }
                        }).catch( err => {
                            this.$message.error(err);
                        })
                    } else {
                        putJsonRequest('/api/users/'+ this.dialogFrom.userId, this.dialogFrom).then( res => {
                            if (res.data.code === 0) {
                                this.dialogTableVisible = false;
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.getUsersList();
                            } else {
                                this.$message.error(res.data.code+res.data.msg);
                            }
                        }).catch( err => {
                            this.$message.error(err);
                        })
                    }
                    
                } else {
                    this.$message.error('验证失败');
                    return false;
                }
            })
        },
        // 每页数据条数
        showSizeChange(val){
            console.log(val);
            this.getUsersList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            console.log(val);
            this.getUsersList(val);
        },

        radioChange(data){
            console.log(data);
            if ( data != 1) {
                this.OperatorShow = true;
            } else {
                this.OperatorShow = false;
            }

            if ( data != 1 && data != 2) {
                this.CustomerShow = true;
            } else {
                this.CustomerShow =false;
            }
        },

        selectedOptions(val){
            this.dialogFrom.agentId = val[0];
        },
        lisenTochildCustomer(val){
            this.dialogFrom.customerId = val.customerId;
        }
    },
}
</script>

<style lang="scss">
    
</style>