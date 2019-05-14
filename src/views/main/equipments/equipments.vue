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
                <a href="javascript:;" @click="addList">添加</a>
            </li>
        </ul> -->
        <div class="filter-container">
            <el-button @click="addList" size="medium">新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" :stripe="true" class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="设备编号"></el-table-column>
            <el-table-column prop="stationId" label="站点编号"></el-table-column>
            <el-table-column prop="productId" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="设备本地名称"></el-table-column>
            <el-table-column prop="sequence" label="设备序列号"></el-table-column>
            <el-table-column prop="sim" label="SIM卡号"></el-table-column>
            <el-table-column prop="typeCodeName" label="设备类型"></el-table-column>
            <el-table-column prop="location" label="安装位置"></el-table-column>
            <el-table-column prop="installTime" label="安装时间"></el-table-column>
            <el-table-column prop="installPerson" label="安装与调试人员"></el-table-column>
            <el-table-column prop="brand" label="设备品牌"></el-table-column>
            <el-table-column prop="description" label="设备描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="210" align="center">
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
        <el-dialog title="设备管理信息" :visible.sync="dialogTableVisible">
            <el-form ref="dialogFrom" :model="dialogFrom" label-width="120px">
                <!-- <el-form-item label="设备编号">
                    <el-input v-model="dialogFrom.id" :disabled="dialogDisabled"></el-input>
                </el-form-item> -->
                <el-form-item label="站点编号">
                    <stationChange :disabled="dialogDisabled" :stationId="dialogFrom.stationId" v-on:lisenTochildStation="childStation"></stationChange>
                </el-form-item>
                <el-form-item label="产品编号">
                    <productChange :disabled="dialogDisabled" :productId="dialogFrom.productId" v-on:lisenTochildProduct="childProduct" ></productChange>
                </el-form-item>
                <el-form-item label="设备本地名称">
                    <el-input v-model="dialogFrom.name" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <el-input v-model="dialogFrom.sequence" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="SIM卡号">
                    <el-input v-model="dialogFrom.sim" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设备类型">
                    <el-radio-group v-model="dialogFrom.type" :disabled="dialogDisabled">
                        <p>
                            <el-radio :label="11">变压器</el-radio>
                            <el-radio :label="12">高压进线柜</el-radio>
                            <el-radio :label="13">高压出线柜</el-radio>
                            <el-radio :label="14">低压进线总柜</el-radio>
                            <el-radio :label="15">电容补偿柜</el-radio>
                            <el-radio :label="16">低压出线回路</el-radio>
                        </p>
                        <p>
                            <el-radio :label="21">电表</el-radio>
                            <el-radio :label="22">通讯管理机</el-radio>
                            <el-radio :label="23">环境传感器</el-radio>
                            <el-radio :label="24">摄像头</el-radio>
                            <el-radio :label="25">断电报警器</el-radio>
                        </p>
                        
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="安装位置">
                    <el-input v-model="dialogFrom.location" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="安装时间">
                    <el-date-picker
                        :disabled="dialogDisabled"
                        v-model="dialogFrom.installTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="安装与调试人员">
                    <el-input v-model="dialogFrom.installPerson" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设备品牌">
                    <el-input v-model="dialogFrom.brand" :disabled="dialogDisabled"></el-input>
                </el-form-item>
                <el-form-item label="设备描述">
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
import stationChange from '@/components/stationChange'
import productChange from '@/components/productChange'
import searItemsBox from '@/components/searItemsBox'
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
import rules from '@/tool/rules.js'

export default {
    components:{page, searItemsBox, stationChange, productChange},
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

            // 总条数
            totalCount:null,

            // 校验规则
            rules:{},

            // dialog需要的
            dialogTableVisible: false,
            dialogDisabled:false,
            dialogBtn:true,
            flag:'',
            dialogFrom:{
                id: null,
                stationId: null,
                productId: null,
                name: null,
                sequence: null,
                sim: null,
                type: null,
                typeCodeName:null,
                location: null,
                installTime: null,
                installPerson: null,
                brand: null,
                description: null,
            },

            // 站点
            stationId:null,

            typeName:[
                {id:11,name:'变压器'},
                {id:12,name:'高压进线柜'},
                {id:13,name:'高压出线柜'},
                {id:14,name:'低压进线总柜'},
                {id:15,name:'电容补偿柜'},
                {id:16,name:'低压出线回路'},
                {id:21,name:'电表'},
                {id:22,name:'通讯管理机'},
                {id:23,name:'环境传感器'},
                {id:24,name:'摄像头'},
                {id:25,name:'断电报警器'}
            ]
            
        }
    },
    created() {
        this.getEqusList();
        this.rules = rules;
    },
    methods: {

        getEqusList(current,size){
            let limit = size || 10;
            let cursor = current || 1;
            let getData = {
                limit:limit,
                cursor:cursor,
            };
            getRequest('/test/devices',getData).then( res => {
                // console.log(res);
                if ( res.data.code === 0) {
                    this.tableData = res.data.data.records;
                    this.totalCount = res.data.data.total;
                    this.getTypeName();
                } else {
                    this.$message.error(res.data.code + res.data.msg)
                }
            }).catch( err => {
                console.log(err);
            })
        },

        getTypeName() {
            this.tableData.map( (val,i) => {
                this.typeName.map((value, index) => {
                    if (val.type == value.id) {
                        this.tableData[i].typeCodeName = value.name;
                    }
                })
            })
        },

        getEqusMsg(roleId){
            getRequest('/test/devices/'+roleId).then( res => {
                // console.log(res);
                if (res.data.code === 0) {
                    this.dialogFrom.id = res.data.data.id;
                    this.dialogFrom.productId = res.data.data.productId;
                    this.dialogFrom.stationId = res.data.data.stationId;
                    this.dialogFrom.name =res.data.data.name;
                    this.dialogFrom.sequence = res.data.data.sequence;
                    this.dialogFrom.sim = res.data.data.sim;
                    this.dialogFrom.type = parseInt(res.data.data.type);
                    this.dialogFrom.location = res.data.data.location;
                    this.dialogFrom.installTime = res.data.data.installTime;
                    this.dialogFrom.installPerson = res.data.data.installPerson;
                    this.dialogFrom.brand = res.data.data.brand;
                    this.dialogFrom.description = res.data.data.description;
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch( err => {
                console.log(err);
            })
        },

        addDialogShow(index,row,flag){
            this.dialogTableVisible = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.flag = flag;
            if ( flag === 0 ) {
                this.dialogDisabled = true;
                this.dialogBtn = false;
                this.dialogMenusBtn = false;
            }

            if ( flag === 2 ) {
                this.dialogDisabled = false;
                this.dialogBtn = true;
                this.dialogMenusBtn = true;
            }
            this.getEqusMsg(row.id);
        },

        // 删除
        remove(index,row){
            deleteRequest('/test/devices/'+row.id).then( res => {
                if ( res.data.code === 0) {
                    this.$notify.success({
                        message:'删除成功',
                        duration: 2000
                    });
                    this.getEqusList();
                } else {
                    this.$message.error(this.data.code+this.data.msg)
                }
            }).catch( err => {
                this.$message.error(err);
            })
        },

        // 新增
        addList(){
            this.dialogTableVisible = true;
            Object.keys(this.dialogFrom).map(key => this.dialogFrom[key] = '');
            this.dialogMenusBtn = true;
            this.dialogBtn = true;
            this.flag = 1;
            this.dialogDisabled = false;
        },

        departmentChange(selVal){
            this.dialogFrom.departmentId = selVal;
        },

        // 提交
        onSubmit(formName){
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    this.dialogTableVisible = false;
                    if ( this.flag === 1) {
                        postJsonRequest('/test/devices',this.dialogFrom).then( res => {
                            // console.log(res);
                            if ( res.data.code === 0) {
                                this.$notify.success({
                                    message:'添加成功',
                                    duration: 2000
                                });
                                this.getEqusList();
                            } else {
                                this.$message.error(this.data.code+this.data.msg)
                            }
                        }).catch( err => {
                            console.log(err)
                        })
                        return;
                    }
                    putJsonRequest('/test/devices/'+this.dialogFrom.id,this.dialogFrom).then( res => {
                        if ( res.data.code === 0) {
                            this.$notify.success({
                                message:'更新成功',
                                duration: 2000
                            });
                            this.getEqusList();
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
            this.getEqusList('',val);
        },
        // 当前页数
        showCurrentChange(val){
            this.getEqusList(val);
        },

        childStation(val){
            this.dialogFrom.stationId = val.id;
        },

        childProduct(val){
            this.dialogFrom.productId = val.id;
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