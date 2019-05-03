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
            <el-table-column prop="documentName" label="文档名称"></el-table-column>
            <el-table-column prop="ossUrl" label="文档地址"></el-table-column>
            <el-table-column prop="customerName" label="上传者"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
        <el-dialog title="档案管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="文档名称">
                    <el-input v-model="dialogFrom.documentName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="文档属性">
                    <el-input v-model="dialogFrom.documentName" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="文档地址">
                    <el-input v-model="dialogFrom.ossUrl" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="文档" v-if="uploadShow">
                    <input type="file" id="pic">
                    <el-upload :action="uploadActionUrl">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
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
            },
            fileType:[
                {id:1,name:'合同'},
                {id:2,name:'附件'},
                {id:3,name:'报告'},
                {id:4,name:'其它'},
            ],
            uploadShow:false,// 文件上传是否可见
            uploadActionUrl:'http://192.168.0.112:8080/commonservice-system/sys/oss/upload'
        }
    },
    created() {
        this.getDocumentsList();
    },
    methods: {
        getDocumentsList(){
            getRequest('/api/documents').then( res => {
                console.log(res);
                if (res.data.code === 0) {
                    this.tableData = res.data.page.list;
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
            this.getDetails(row);
            console.log(index,row);
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
            console.log(index,row)
            this.uploadShow = true;
            this.getDetails(row);
        },
        deleteClick(index,row){
            this.dialogTableVisible = true;
            console.log(index,row)
        },
        added(){
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.dialogTableVisible = true;
            this.uploadShow = true;
        },
        // 保存修改内容
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
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
                } else {
                    this.$message.error('验证失败');
                    return false;
                }
            })
        }
    },
}
</script>

<style lang="scss">
    
</style>