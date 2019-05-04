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
                <!-- <a href="javascript:;" @click="recovery">恢复数据</a> -->
            </li>
        </ul>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="agentId" label="极能或运营商id"></el-table-column>
            <el-table-column prop="customerName" label="客户名"></el-table-column>
            <el-table-column prop="customerType" label="客户类型"></el-table-column>
            <el-table-column prop="contacts" label="联系人"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="assistant" label="业务员"></el-table-column>
            <el-table-column prop="operationType" label="业务类型"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="latitude" label="纬度"></el-table-column>
            <el-table-column prop="longitude" label="经度"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
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
        <el-dialog title="客户管理信息" :visible.sync="dialogTableVisible" :source="source">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px" :rules="rules">
                <el-form-item label="客户名" prop="customerName">
                    <el-input v-model="dialogFrom.customerName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="客户类型" prop="customerType">
                    <el-input v-model="dialogFrom.customerType" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input v-model="dialogFrom.contacts" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="dialogFrom.phone" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="运营商">
                    <el-cascader
                        :options="options"
                        :props="optionProps"
                        v-model="selectedOptions"
                        :disabled="dialogDisabled"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="业务员" prop="assistant">
                    <el-input v-model="dialogFrom.assistant" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="operationType">
                    <el-input v-model="dialogFrom.operationType" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="dialogFrom.address" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="dialogFrom.latitude" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="dialogFrom.longitude" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
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
import rules from '@/tool/rules'
// import {clearValidate} from '@/tool/clearValidate'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
export default {
    components:{page,searItemsBox},
    data() {
        return {
            tableData:[],
            dialogTableVisible: false,
            dialogDisabled: false,
            dialogBtn: false,
            searItemShow: false,
            source:true,
            activeIndex: '',
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],
            options:[],
            selectedOptions:[],
            dialogFrom:{
                customerName:'', // 客户名称
                customerType:'', // 客户类型
                contacts:'', // 联系人
                phone:'', // 手机
                assistant:'',// 业务员
                operationType:'',// 业务类型
                address:'', // 地址
                latitude:'', // 纬度
                longitude:'', // 经度
                description:'', // 描述
                customerId:'',
                agentId:'',
            },
            rules:{},
            optionProps:{
                value: 'agentId',
                label: 'name',
                children: 'children'
            },
            // 总条数
            totalCount:null,
        }
    },
    created() {
        this.getCustomerList();
        this.rules = rules;
    },
    methods: {
        getCustomerList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            }
            console.log(current,getData)
            getRequest('/api/customers',getData).then( res => {
                console.log(res);
                this.tableData = res.data.page.list;
                this.totalCount = res.data.page.totalCount;
                // console.log( this.tableData);
            }).catch( err => {
                console.log(err);
            })
        },
        getCustomers(id,agentId){
            this.dialogTableVisible = true;
            this.source = false;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogFrom.customerId = id;
            this.getAgent(agentId);
            
            getRequest('/api/customers/'+ id).then( res => {
                console.log(res);
                if ( res.data.code === 0 ){
                    this.dialogFrom.customerName = res.data.customer.customerName;
                    this.dialogFrom.customerType = res.data.customer.customerType;
                    this.dialogFrom.contacts = res.data.customer.contacts;
                    this.dialogFrom.phone = res.data.customer.phone;
                    this.dialogFrom.assistant = res.data.customer.assistant;
                    this.dialogFrom.operationType = res.data.customer.operationType;
                    this.dialogFrom.address = res.data.customer.address;
                    this.dialogFrom.latitude = res.data.customer.latitude;
                    this.dialogFrom.longitude = res.data.customer.longitude;
                    this.dialogFrom.description = res.data.customer.description;
                    this.dialogFrom.agentId = res.data.customer.agentId;
                }
            }).catch( err => {
                console.log(err);
            })
        },
        handleClick(index,row){
            this.dialogDisabled = true;
            this.dialogBtn = false;
            this.getCustomers(row.customerId,row.agentId);
            console.log(index,row);
        },
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        listenChildShowItem(data){
            this.searItemShow = false;
        },
        added(){
            this.clearValidate('dialogFrom');
            this.dialogTableVisible = true;
            this.dialogBtn = true;
            this.dialogDisabled = false;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.getAgent();
            this.source = true;
        },
        getAgent(agentId){
            // options
            this.selectedOptions = [];
            this.selectedOptions.push(agentId);
            getRequest('/api/agent/select').then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.options = res.data.agentList;
                    this.options.map( (val, index) => {
                        if (val.agentId == agentId) {
                            console.log(val.agentId);
                        }
                    })
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
            // 编辑按钮
        editClick(index,row){
            this.clearValidate('dialogFrom');
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.getCustomers(row.customerId,row.agentId);
        },
        // 删除按钮点击
        deleteClick(index,row){
            console.log(index,row);
            deleteRequest('/api/customers/' + row.customerId).then( res => {
                if (res.data.code === 0) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getCustomerList();
                } else {
                    this.$message.error(res.data.code+res.data.msg);
                }
            }).catch( err=> {
                console.log(err);
                this.$message.error(err);
            })
        },
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if ( this.source ) {
                        console.log(this.dialogFrom);
                        postJsonRequest('/api/customers',this.dialogFrom).then( res => {
                            console.log(res);
                            if (res.data.code === 0) {
                                this.dialogTableVisible = false;
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.getCustomerList();
                            } else {
                                this.$message.error(res.data.code+res.data.msg);
                            }
                        }).catch( err => {
                            this.$message.error(err);
                        })
                    } else {
                        putJsonRequest('/api/customers/'+ this.dialogFrom.customerId,this.dialogFrom).then( res => {
                            console.log(res.data.code);
                            if (res.data.code === 0 ) {
                                this.dialogTableVisible = false;
                                this.getCustomerList();
                            }else{
                                this.$message.error(res.data.code+res.data.msg);
                            }
                            // if (res.data.code === 0) {
                            //     this.dialogTableVisible = false;
                            //     this.$message({
                            //         message: res.data.msg,
                            //         type: 'success'
                            //     });
                            //     this.getCustomerList();
                            // } else {
                            //     this.$message.error(res.data.code+res.data.msg);
                            // }
                        }).catch( err => {
                            this.$message.error(err);
                        })
                    }
                } else {
                    this.$message.error('验证失败');
                    return false;
                }
            });
        },
        recovery(){
            this.$prompt('请输入您要恢复的客户ID','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then( ({ value }) => {
                this.$message({
                    type: 'success',
                    message: '你输入的id是: ' + value
                });
            }).catch( ()=> {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            })
        },
        clearValidate(formName){
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].resetFields();
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

<style lang="scss">
    
</style>