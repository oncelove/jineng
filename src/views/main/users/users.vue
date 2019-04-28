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
            <el-table-column prop="agentName" label="运营商"></el-table-column>
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
        <page></page>
        <el-dialog title="用户信息" :visible.sync="dialogTableVisible" :source="source">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="dialogFrom.username" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="dialogFrom.password" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="所属部门">
                    <el-select v-model="dialogFrom.deptId" :disabled="dialogDisabled">
                        <el-option v-for="(dept, index) in deptArray" :key="index" :label="dept.name" :value="dept.depid">
                            {{ dept.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="dialogFrom.email" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="dialogFrom.mobile" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="dialogFrom.status" :disabled="dialogDisabled">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色">
                    <el-checkbox-group v-model="roleIdList" :disabled="dialogDisabled">
                        <!--  @change="roleIdChange(roles.roleId)" -->
                        <el-checkbox :label="roles.roleId" v-for="(roles,index) in rolesArray" :key="index">
                            {{roles.roleName}}
                        </el-checkbox>
                    </el-checkbox-group>
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
import {getRequest, putJsonRequest, postJsonRequest} from '@/axios2.js'
export default {
    components:{page, searItemsBox},
    data() {
        return {
            tableData:[],
            dialogData: null,
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
            }
        }
    },
    created() {
        // 获取列表数据
        getRequest('/users').then( res => {
            console.log(res);
            this.tableData = res.data.page.list;
        }).catch( err => {
            console.log(err);
        });
    },
    methods: {
        getUserMsg(userId,whereClick){
            this.dialogTableVisible = true;
            this.source = false;
            this.rolesArray = this.$store.state.roleNames;
            this.deptArray = this.$store.state.departmentArray;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            if (whereClick) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.dialogFrom.userId = userId;
            } else {
                this.dialogDisabled = true;
                this.dialogBtn = false;
            }
            
            getRequest('/users/'+ userId).then( res => {
                console.log(res);
                if ( res.data.code === 0 ) {
                    this.dialogFrom.username = res.data.user.username;
                    this.dialogFrom.mobile = res.data.user.mobile;
                    this.dialogFrom.email =  res.data.user.email;
                    this.dialogFrom.status =  res.data.user.status;
                    this.dialogFrom.deptId =  res.data.user.deptId;
                    // this.dialogFrom.roleIdList = res.data.user.roleIdList;
                    this.roleIdList = res.data.user.roleIdList;
                }else{
                    this.$message.error(res.data.code,res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        // 查看按钮点击
        handleClick(index,row){
            
            this.getUserMsg(row.userId);
            // console.log(index,row);
        },
        // 编辑按钮点击
        editClick(index,row){
            this.getUserMsg(row.userId, true);
        },
        // 删除按钮点击
        deleteClick(index,row){
            console.log(1111);
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
                if (valid) {
                    console.log(this.dialogFrom);
                    this.dialogFrom.roleIdList = this.roleIdList;
                    if ( this.source ) {
                        alert('你点击新增里面的提交');
                        // postJsonRequest('/users',this.dialogFrom).then( res => {
                        //     console.log(res);
                        // }).catch( err => {
                        //     console.log(err);
                        // })
                    } else {
                        putJsonRequest('/users/'+ this.dialogFrom.userId, this.dialogFrom).then( res => {
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
                            console.log(err);
                        })
                    }
                    
                } else {
                    console.log('err');
                    return false;
                }
            })
        }
    },
}
</script>

<style lang="scss">
    
</style>