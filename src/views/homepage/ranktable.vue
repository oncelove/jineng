<template>
    <el-table
        :data="tableData"
        style="width: 100%"
        max-height="240"
        :row-class-name="tableRowClassName"
    >
        <el-table-column
            fixed
            prop="index"
            label="序号"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="date"
            label="时间"
        >
        </el-table-column>
        <el-table-column
            prop="address"
            label="地点"
        >
        </el-table-column>
        <el-table-column
            prop="name"
            label="处理人员"
        >
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    methods: {
        tableRowClassName({row,column,rowIndex,columnIndex}){
            // console.log(row)
            if (row.iserror) {
                return 'errorColor'
            }
            // console.log(column)
            // console.log(rowIndex)
            // console.log(columnIndex)
        }
    },
    data() {
        return {
            tableData: [
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    index: 200333,
                    iserror: true,
                },
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    index: 200333
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    index: 200333
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    index: 200333
                },
                {
                    date: "2016-05-08",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                    index: 200333
                },
            ],
            iserror: true
        };
    }
};
</script>