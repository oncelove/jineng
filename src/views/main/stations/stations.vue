<template>
    <div class="stations">
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
            v-if="pageShow"
        ></page>
        <el-dialog title="站点信息" :visible.sync="dialogTableVisible" :source="source">
            <el-form ref="dialogFrom" :model="dialogFrom" :rules="rules" label-width="80px">
                <el-form-item label="站点编号" prop="id">
                    <el-input v-model="dialogFrom.id" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="客户编号" prop="customer_id">
                    <el-input v-model="dialogFrom.customerId" :disabled="dialogDisabled"></el-input>
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
export default {
    components:{page,searItemsBox},
    data(){
        return{
            tableData:[],
            
            customer_id:null,
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
            dialogFrom:{},
            dialogTableVisible:false,
            dialogDisabled: false,
            dialogBtn: false,
            source:true,

            // 总条数
            totalCount:null,
            pages:1,
            limit:10,
            pageShow:false,
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
                customerId: this.customerId
            }

            if(this.tableData <= 0) {
                this.pageShow = false;
            } else {
                this.pageShow = true;
            }
            getRequest('/test/stations',getData).then( res => {
                console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                } else {
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },
        seeList(id){
            getRequest('/stations/'+id).then( res => {
                console.log(res);
            }).catch( err => {
                console.log(err);
            })
        },
        added(){
            this.dialogFrom = {};
            this.dialogTableVisible = true;
            this.dialogBtn = true;
        },
        deleteClick(index, row){
            console.log(row);
        },
        editClick(index, row){
            console.log(row);
            this.seeList(row.id)
        },
        handleClick(row) {
            console.log(row);
            this.seeList(row.id)
        },
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    postJsonRequest('/test/stations',this.dialogFrom).then( res => {
                        console.log(res);
                    }).catch( err => {
                        console.log(err);
                    })
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
