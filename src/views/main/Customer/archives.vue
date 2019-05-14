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
                <a href="javascript:;" @click="added">新增</a>
                <a href="javascript:;">删除</a>
            </li>
        </ul> -->
        <div class="filter-container">
            <el-button @click="added" size="medium" v-if="permissionsBox.addBtn">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="documentName" label="文档名称"></el-table-column>
            <el-table-column prop="ossUrl" label="文档地址"></el-table-column>
            <el-table-column prop="customerName" label="上传者"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.$index,scope.row)" size="small" >查看</el-button>
                    <el-button size="small" @click="editClick(scope.$index,scope.row)" v-if="permissionsBox.updateBtn">编辑</el-button>
                    <el-button size="small" @click="deleteClick(scope.$index,scope.row)" v-if="permissionsBox.deleteBtn">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page
            :totalCount="totalCount"
            v-on:listenToSizeChange="showSizeChange"
            v-on:listenToCurrentChange="showCurrentChange"
        ></page>
        <el-dialog title="档案管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="运营商编号">
                    <operatorChange 
                        v-on:lintenToChildSelected="selectedOptions" 
                        :disabled="dialogDisabled"
                        :agentName="dialogFrom.agentName"
                        :agentId="dialogFrom.agentId">
                    </operatorChange>
                </el-form-item>
                <el-form-item label="客户名称">
                    <!-- <el-input v-model="dialogFrom.customerId" :disabled="dialogDisabled"></el-input> -->
                    <CustomerChange 
                        :agentId="dialogFrom.agentId"
                        v-on:lisenTochildCustomer="ChildCustomer"
                        :disabled="dialogDisabled"
                        :customerId="dialogFrom.customerId"
                        :customerName="dialogFrom.customerName"
                    ></CustomerChange>
                </el-form-item>
                <el-form-item label="文档名称">
                    <el-input v-model="dialogFrom.documentName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="文档" v-if="uploadShow">
                    <input id="uploader" type="file" name="file" @change="upload10" />
                </el-form-item>
                <el-form-item label="文档地址">
                    <el-input v-model="dialogFrom.ossUrl" :disabled="noclick"></el-input>
                </el-form-item>
                <el-form-item label="文件类型">
                    <el-radio-group v-model="dialogFrom.documentType" :disabled="dialogDisabled">
                        <el-radio v-for="(usertype,index) in fileType" :key="index" :label="usertype.id">{{usertype.id}}--{{usertype.name}}</el-radio>
                    </el-radio-group>
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
import operatorChange from '@/components/operatorChange'
import CustomerChange from '@/components/CustomerChange'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest, uploadPostRequest} from '@/axios.js'
import { power } from '@/tool/power.js'
export default {
    components:{page,searItemsBox, CustomerChange, operatorChange},
    data() {
        return {
            tableData:[],
            dialogTableVisible: false,
            dialogDisabled: false,
            dialogBtn: false,
            searItemShow: false,
            noclick: true,
            activeIndex: '',
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ],
            dialogFrom:{
                documentName:'',
                documentType:'',
                ossUrl:'',
                customerId:'',
                customerName:'',
                documentId:'',
                agentId: null,
            },
            totalCount:null,
            fileType:[
                {id:1,name:'合同'},
                {id:2,name:'附件'},
                {id:3,name:'报告'},
                {id:4,name:'其它'},
            ],
            flag:null,
            uploadShow:false,// 文件上传是否可见
            uploadActionUrl:'/api/sys/oss/upload',
            permissionsBox:null,
        }
    },
    created() {
        this.permissionsBox = power(this,'sys:documents:info','sys:documents:add','sys:documents:delete','sys:documents:update');
        this.getDocumentsList();
    },
    methods: {
        getDocumentsList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };
            getRequest('/api/documents',getData).then( res => {
                // console.log(res);
                if (res.data.code === 0) {
                    this.tableData = res.data.page.list;
                    this.totalCount = res.data.page.totalCount;
                } else {
                    this.$message.error(res.data.code+res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        getDetails(data){
            this.dialogFrom.documentName = data.documentName;
            this.dialogFrom.ossUrl = data.ossUrl;
            // this.dialogFrom.customerName = data.customerName;
            this.dialogFrom.documentType = data.documentType;
            this.dialogFrom.documentId = data.documentId;
        },
        handleClick(index,row){
            this.dialogTableVisible = true;
            this.dialogDisabled = true;
            this.dialogBtn = false;
            this.uploadShow = false;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.getDetails(row);
        },
        itemShowFunc(index){
            this.activeIndex = index;
            this.searItemShow = !this.searItemShow;
        },
        listenChildShowItem(data){
            this.searItemShow = false;
        },
        // 编辑按钮点击
        editClick(index,row){
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.uploadShow = true;
            this.flag = 2;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.getDetails(row);
        },
        deleteClick(index,row){
            deleteRequest('/api/documents/'+row.documentId).then( res => {
                if ( res.data.code === 0) {
                    this.$message.success('删除成功');
                    this.getDocumentsList();
                } else {
                    this.$message.error( res.data.code + res.data.msg );
                }
            })
        },
        added(){
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.dialogTableVisible = true;
            this.uploadShow = true;
            this.flag = 1;
        },
        upload10(e) {
            const formData = new FormData();
            // this.img10 = e.target.files[0];
            formData.append("upload_type", 1);
            if (e.target.files[0]) {
                if (
                    !e.target.value.match(
                        /\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.PNG|\.JPG|\.JPEG|\.GIF|\.BMP/g
                    )
                ) {
                    return this.$message({
                        message: "图片格式不正确！",
                        type: "error",
                        duration: 1000
                    });
                }
                formData.append("file", e.target.files[0]);
                uploadPostRequest(`/api/sys/oss/upload`, formData).then(res => {
                    if ( res.data.code === 0) {
                        this.dialogFrom.ossUrl = res.data.url;
                    } else {
                        this.$message.error(res.data.code + res.data.msg);
                    }
                });
            }
        },
        // 保存修改内容
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    if (this.flag === 1){
                        postJsonRequest('/api/documents/',this.dialogFrom).then( res => {
                            if (res.data.code === 0) {
                                this.dialogTableVisible = false;
                                this.$message.success('添加成功');
                                this.getDocumentsList();
                            } else {
                                this.$message.error(res.data.code + res.data.msg);
                            }
                        })
                    }

                    if ( this.flag === 2 ) {
                        putJsonRequest('/api/documents/'+ this.dialogFrom.documentId, this.dialogFrom).then( res => {
                            if (res.data.code === 0) {
                                this.dialogTableVisible = false;
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                                this.getDocumentsList();
                            } else {
                                this.$message.error(res.data.code+res.data.msg);
                            }
                        }).catch( err => {
                            console.log(err);
                        })
                    }
                    
                } else {
                    this.$message.error('验证失败');
                    return false;
                }
            })
        },
        // 选择运营商
        selectedOptions(val){
            this.dialogFrom.agentName = val.name;
            this.dialogFrom.agentId = val.agentId;
        },
        // 客户id
        ChildCustomer(val){
            this.dialogFrom.customerId = val.customerId;
            this.dialogFrom.customerName = val.customerName;
        },
        // 每页数据条数
        showSizeChange(val){
            this.getRecordList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getRecordList(val);
        },
    },
}
</script>

<style lang="scss">
    
</style>