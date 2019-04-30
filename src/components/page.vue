<template>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
    </el-pagination>
</template>

<script>
export default {
    props:['totalCount'],
    data() {
        return {
            currentPage: 1,
            // totalCount:'',
        }
    },
    created(){
        // this.totalCount = totalCount;
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.$emit('listenToSizeChange',val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.$emit('listenToCurrentChange',val);
        }
    },
}
</script>

<style lang="scss" scoped>
.el-pagination{
    text-align: right;
}

</style>


