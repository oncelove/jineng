<template>
    <div>
        站点设计图
        <div class="filter-container">
            <el-button @click="addNews" size="medium">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="stationId" label="站点编号" width="80"></el-table-column>
            <el-table-column prop="name" label="设计图名称"></el-table-column>
            <el-table-column prop="type" label="设计图类型"></el-table-column>
            <el-table-column prop="ossUrl" label="图片URL"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="260">
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
        <el-dialog title="站点设计图信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="80px">
                <el-form-item label="站点编号">
                    <el-input v-model="dialogFrom.stationId" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设计图名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设计图类型">
                    <el-input v-model="dialogFrom.type" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="图片URL">
                    <el-input v-model="dialogFrom.ossUrl" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="描述">
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
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest, uploadPostRequest} from '@/axios.js'
import page from '@/components/page'
import stationChange from '@/components/stationChange'
export default {
    components:{page, stationChange},
    data(){
        return{
            tableData:[],
            totalCount:null,
            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn:false,
            dialogFrom:{
                stationId:null,
                name: null,
                type:null,
                ossUrl:null,
                description:null,
            },
            flag:null,
        }
    },
    methods:{
        getList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };
            getRequest('/test/diagrams/').then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.list;
                    this.totalCount = res.data.data.totalCount;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })

        },
        getListMsg(id){
            getRequest(`/test/diagrams/${id}`).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.stationId = res.data.data.stationId;
                    this.dialogFrom.stationName = res.data.data.stationName;
                    this.dialogFrom.type = res.data.data.type;
                    this.dialogFrom.ossUrl = res.data.data.ossUrl;
                    this.dialogFrom.description = res.data.data.description;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        addNews(){
            this.flag = 1;
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
        },
        handleClick(index, row){
            this.dialogTableVisible = true;
            this.dialogDisabled = true;
            this.dialogBtn = false;
            this.getListMsg(row.id);
        },
        editClick(index,row){
            this.dialogTableVisible = true;
            this.dialogDisabled = false;
            this.dialogBtn = true;
            this.getListMsg(row.id);
            this.flag = 2;
        },
        deleteClick(index,row){
            deleteRequest(`/test/diagrams/${row.id}`).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.$message.success('删除成功！！！');
                    this.getList();
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },
        onSubmit(){
            if ( this.flag === 1) {
                postJsonRequest('/test/diagrams/',this.dialogFrom).then( res => {
                    if ( res.data.code === 0) {
                        this.dialogTableVisible = false;
                        this.$message.success('添加成功！！！')
                        this.getList();
                    } else {
                        this.$message.error(res.data.code + res.data.msg);
                    }
                }).catch( err => {
                    console.log(err);
                })
            }

            if ( this.flag === 2 ) {
                putJsonRequest(`/test/diagrams/${this.dialogFrom.id}`,this.dialogFrom).then( res => {
                    if ( res.data.code === 0) {
                        this.dialogTableVisible = false;
                        this.$message.success('修改成功！！！');
                        this.getList();
                    } else {
                        this.$message.error(res.data.code + res.data.msg);
                    }
                }).catch( err => {
                    console.log(err);
                })
            }
        },
        // 每页数据条数
        showSizeChange(val){
            this.getList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getList(val);
        },
    },
    created(){
        this.getList();
    }
}
</script>

<style lang="scss" scoped>

</style>
