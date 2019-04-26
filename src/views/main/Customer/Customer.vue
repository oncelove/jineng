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
                <a href="javascript:;">删除</a>
            </li>
        </ul>
        <el-table :data="tableData" style="width: 100%"  class="table-box">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="address" label="address">
            </el-table-column>
            <el-table-column fixed prop="agentId" label="agentId">
            </el-table-column>
            <el-table-column prop="agentName" label="agentName">
            </el-table-column>
            <el-table-column prop="assistant" label="assistant">
            </el-table-column>
            <el-table-column prop="contacts" label="contacts">
            </el-table-column>
            <el-table-column prop="createTime" label="createTime">
            </el-table-column>
            <el-table-column prop="customerId" label="customerId">
            </el-table-column>
            <el-table-column prop="customerName" label="customerName">
            </el-table-column>
            <el-table-column prop="customerType" label="customerType">
            </el-table-column>
            <el-table-column prop="deletionState" label="deletionState">
            </el-table-column>
            <el-table-column prop="description" label="description">
            </el-table-column>
            <el-table-column prop="latitude" label="latitude">
            </el-table-column>
            <el-table-column prop="longitude" label="longitude">
            </el-table-column>
            <el-table-column prop="phone" label="phone">
            </el-table-column>
            <el-table-column prop="updateTime" label="updateTime">
            </el-table-column>
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
            <el-table :data="dialogData">
                <el-table-column property="agentName" label="agentName" width="150"></el-table-column>
                <el-table-column property="customerName" label="customerName" width="200"></el-table-column>
                <el-table-column property="phone" label="phone"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import page from '@/components/page'
import searItemsBox from '@/components/searItemsBox'
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
            ]
        }
    },
    created() {
        this.$http.get('/customers').then( res => {
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
        }
    },
}
</script>

<style lang="scss">
    
</style>