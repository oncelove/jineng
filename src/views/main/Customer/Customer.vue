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
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog title="客户管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="客户名">
                    <el-input v-model="dialogFrom.customerName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="客户类型">
                    <el-input v-model="dialogFrom.customerType" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="dialogFrom.contacts" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="dialogFrom.phone" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="业务员">
                    <el-input v-model="dialogFrom.assistant" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="业务类型">
                    <el-input v-model="dialogFrom.operationType" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="dialogFrom.address" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input v-model="dialogFrom.latitude" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input v-model="dialogFrom.longitude" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="dialogFrom.description" :disabled="dialogDisabled"></el-input>
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
            dialogFrom:{
                customerName:'',
                customerType:'',
                contacts:'',
                phone:'',
                assistant:'',
                operationType:'',
                address:'',
                latitude:'',
                longitude:'',
                description:'',
            }
        }
    },
    created() {
        getRequest('/customers').then( res => {
            console.log(res);
            this.tableData = res.data.page.list;
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
        added(){
            console.log(111);
        }
    },
}
</script>

<style lang="scss">
    
</style>