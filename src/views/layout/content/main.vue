<template>
    <el-row>
        <el-col :span="20">
            <div class="left-content">
                <ul class="top-search-box">
                    <li class="active" v-for="(serchItem, index) in searchTextItem" :key="index">
                        <em>{{serchItem.codeText}}</em>
                        <div class="list-boxs">
                            <code>{{serchItem.selectText}}</code>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                            <searItemsBox class="item-box" v-if="searItemShow"></searItemsBox>
                        </div>
                    </li>
                    <li><a href="javascript:;">查询</a></li>
                </ul>
                <tableBox class="table-box"></tableBox>
                <page></page>
            </div>
        </el-col>
        <el-col :span="4">
            <realdata class="right-content"></realdata>
        </el-col>
    </el-row>    
</template>

<script>
import searItemsBox from '@/components/searItemsBox'
import tableBox from './tableBox'
import page from './page'
import realdata from './realdata'
export default {
    components: { searItemsBox, tableBox, page, realdata },
    data() {
        return {
            searItemShow: false,
            searchTextItem:[
                {id:1,codeText:'状态',selectText:'在线'},
                {id:2,codeText:'告警',selectText:'正常'},
                {id:3,codeText:'监测类型',selectText:'环境监测'},
                {id:4,codeText:'用户类型',selectText:'医院'},
                {id:5,codeText:'用户星级',selectText:'一星'}
            ]
        }
    },
}
</script>

<style lang="scss" scoped>


// .el-icon-arrow-down {
//     font-size: 12px;
// }
</style>
