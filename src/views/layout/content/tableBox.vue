<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="name" label="项目名称" width="150">
            </el-table-column>
            <el-table-column prop="date" label="接入时间">
            </el-table-column>
            <el-table-column prop="city" label="城市">
            </el-table-column>
            <el-table-column prop="area" label="区/街道">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.row)"
                        type="text"
                        size="small"
                        >查看</el-button
                    >
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script>
export default {
    methods: {
        handleClick(row) {
            console.log(row);
        }
    },

    data() {
        return {
            tableData: [
                {
                    date: "2016-05-02",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1518 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-04",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1517 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-01",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1519 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                },
                {
                    date: "2016-05-03",
                    name: "兴达电器",
                    city: "杭州",
                    area: "余杭",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333
                }
            ],
        };
    }
};
</script>