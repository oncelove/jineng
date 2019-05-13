<template>
    <div class="stations">
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
                <a href="javascript:;" @click="added">新增</a>
            </li>
        </ul> -->
        <div class="filter-container">
            <el-button @click="added" size="medium">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="id" label="站点编号" width="80"></el-table-column>
            <el-table-column prop="customerId" label="客户编号"></el-table-column>
            <el-table-column prop="name" label="站点名称"></el-table-column>
            <el-table-column prop="address" label="站点地址"></el-table-column>
            <el-table-column prop="type" label="站点类型"></el-table-column>
            <el-table-column prop="lon" label="经度"></el-table-column>
            <el-table-column prop="lat" label="纬度"></el-table-column>
            <el-table-column prop="description" label="站点描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.row)"
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
        <el-dialog title="站点信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="80px">
                <el-form-item label="站点编号" prop="id">
                    <el-input v-model="dialogFrom.id" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="客户编号" prop="customer_id">
                    <CustomerChange 
                        :agentId="agentId"
                        v-on:lisenTochildCustomer="ChildCustomer"
                        :disabled="dialogDisabled"
                        :customerId="dialogFrom.customerId"
                        :customerName="dialogFrom.customerName"
                    ></CustomerChange>
                    <!-- <el-input v-model="dialogFrom.customerId" :disabled="dialogDisabled"></el-input> -->
                </el-form-item>
                <el-form-item label="站点名称" prop="name">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="站点地址" prop="address">
                    <el-input v-model="dialogFrom.address" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="站点类型" prop="type">
                    <el-input v-model="dialogFrom.type" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="经度" prop="lon">
                    <el-input v-model="dialogFrom.lon" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="lat">
                    <el-input v-model="dialogFrom.lat" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="站点描述" prop="description">
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
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
import page from '@/components/page'
import searItemsBox from '@/components/searItemsBox'
import rules from '@/tool/rules'
import CustomerChange from '@/components/CustomerChange'
export default {
    components:{page, searItemsBox, CustomerChange},
    data(){
        return{
            tableData:[],
            
            customerId:null,
            UrlBase:'',
            rules:{},

            //搜索栏的
            activeIndex: '',
            searItemShow: false,
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],

            // 弹窗的
            dialogFrom:{
                id: null,
                customerId: null,
                name: null,
                address: null,
                type: null,
                lon: null,
                lat: null,
                description: null,
            },
            dialogTableVisible:false,
            dialogDisabled: false,
            dialogBtn: false,

            // 总条数
            totalCount:null,
            pages:1,
            limit:10,

            whileAdd:false,
            editId:0,

            agentId:null,
        }
    },
    methods:{
        // 第一次掉的接口
        getList(current, size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData ={
                cursor: cursor,
                limit: limit,
            }

            getRequest('/test/stations',getData).then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                } else {
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },
        seeList(id){
            this.dialogTableVisible = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.getAgentId();
            getRequest('/test/stations/'+id).then( res => {
                if ( res.data.code === 0 ) {
                    console.log(res.data.data)
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.customerId = res.data.data.customerId;
                    this.dialogFrom.name = res.data.data.name;
                    this.dialogFrom.address = res.data.data.address;
                    this.dialogFrom.type = res.data.data.type;
                    this.dialogFrom.lon = res.data.data.lon;
                    this.dialogFrom.lat = res.data.data.lat;
                    this.dialogFrom.description = res.data.data.description;
                    this.dialogFrom.customerName = res.data.data.customerName;
                    console.log(this.dialogFrom);
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        added(){
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.whileAdd = true;
            this.getAgentId();
        },
        getAgentId(){
            console.log(this.$store.state.usersList);
            if ( this.$store.state.usersList ) {
                // this.agentId = this.$store.state.usersList.agentId;
                this.agentId = 31;
            } else {
                this.agentId = 0;
            }
        },
        deleteClick(index, row){
            deleteRequest('/test/stations/'+row.id).then( res => {
                if ( res.data.code === 0) {
                    this.$message.success('删除成功');
                    this.getList();
                } else {
                    this.$message.error( res.data.code + res.data.msg );
                }
            }).catch( err => {
                console.log(err);
            })
        },
        editClick(index, row){
            console.log(row);
            this.dialogBtn = true;
            this.dialogDisabled = false;
            this.seeList(row.id);
            this.whileAdd = false;
            this.editId = row.id;
        },
        handleClick(row) {
            console.log(row);
            this.dialogBtn = false;
            this.dialogDisabled = true;
            this.seeList(row.id)
        },
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if ( this.whileAdd ) {
                        postJsonRequest('/test/stations',this.dialogFrom).then( res => {
                            console.log(res);
                            if ( res.data.code === 0) {
                                this.getList();
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
                        }).catch( err => {
                            console.log(err);
                        })
                    } else {
                        putJsonRequest('/test/stations/'+this.editId, this.dialogFrom).then( res => {
                            if ( res.data.code === 0) {
                                this.dialogTableVisible = false;
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
                        }).catch( error => {
                            console.log(error);
                        })
                    }
                }else {
                    this.$message.error('验证失败');
                    return false;
                }
            });
        },

        // 监听子节点的
        listenChildShowItem(data){
            this.searItemShow = false;
        },
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },

        // 分页的
        // 每页数据条数
        showSizeChange(val){
            console.log(val);
            this.getList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            console.log(val);
            this.getList(val);
        },


        ChildCustomer(val){
            this.dialogFrom.customerId = val.customerId;
        }
    },
    created() {
        this.getList();
        this.rules = rules;
    },
}
</script>

<style lang="scss" scoped>

</style>
