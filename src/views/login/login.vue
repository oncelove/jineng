<template>
    <div class="login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="账号" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            ruleForm:{
                name: '',
                password: ''
            },
            rules:{
                name:[
                    {required: true, message:'请输入账号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message:'请输入密码', trigger: 'blur'},
                    {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        submitForm( formName) {
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    console.log('验证成功');
                    axios.post('/api/sys/login',{
                        'username': this.ruleForm.name,
                        'password': this.ruleForm.password
                    }).then( r=> {
                        console.log(r)
                    }).catch(err=>{
                        console.log(err)
                    });
                    // this.$router.push({path:'/'});
                } else {
                    console.log('验证失败');
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>

