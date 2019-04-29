<template>
    <div>
        <el-dialog
            title="dialogBox.title"
            :visible.sync="dialogVisible"
            :source="source"
            @close="dialogClose"
        >
            <el-form ref="dialogFrom" :model="dialogBox.dialogFrom" label-width="80px">
                <el-form-item v-for="(dialogTitle, index) in dialogBox.dialogFromTitle" :key="index" :label="dialogTitle.text">
                    <el-input
                        v-model="dialogTitle.moddl"
                        :disabled="dialogDisabled"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="dialogBtn">
                    <el-button type="primary">保存</el-button>
                    <el-button @click="dialogTableVisible = false"
                        >取消</el-button
                    >
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:['dialogTableVisible','dialogBox'],
    computed:{
    },
    data() {
        return {
            source: true, // 默认是新增
            // 显示弹窗
            dialogVisible: false,
            // disabled 表单是否可编辑
            dialogDisabled: true,
            // dialogBtn 表单是否可以提交
            dialogBtn: false,
            // 弹窗显示的数据
            deptArray: [], // 部门列表
            rolesArray: [], // 角色列表
            roleIdList: [], // 用户所属角色
            // dialogFrom: {
            //     username: "", // 用户名
            //     password: "", // 密码
            //     mobile: "", // 手机
            //     email: "", // 邮件
            //     status: null, // 状态
            //     deptId: "", // 所属部门
            //     roleIdList: [], // 用户所属角色
            //     userId: null,
            //     userType: "" // 角色属性状态
            // },
            // 角色属性
            // usersTypeStatus:'',
            usersType: [
                { id: 1, name: "极能管理员" },
                { id: 2, name: "运营商" },
                { id: 3, name: "客户" },
                { id: 4, name: "客户下角色" }
            ]
        };
    },
    watch:{
        dialogTableVisible: function (newVal,oldVal) {
            this.dialogVisible = newVal;
        }
    },
    created(){
        console.log(this.dialogVisible);
    },
    methods:{
        dialogClose(){
            console.log(1111);
            this.dialogVisible = false;
            this.$emit('listenTodialogVisible',this.dialogVisible)
        }
    }
};
</script>
