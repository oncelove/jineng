<template>
    <div class="login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="账号" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
                <el-input v-model="ruleForm.captcha" prop="captcha"></el-input>
                <img :src="ruleForm.src" alt="如果看不清楚，请单击图片刷新！" @click="refreshCode">
            </el-form-item>
            <el-form-item>
                <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import axios from 'axios';
import qs from 'qs'
export default {
    data(){
        return{
            ruleForm:{
                name: '',
                password: '',
                captcha: '',
                time: '',
                src: ''
            },
            rules:{
                name:[
                    {required: true, message:'请输入账号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message:'请输入密码', trigger: 'blur'},
                    {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
                ],
                captcha:[
                    {required: true, message:'请输入验证码', trigger: 'blur'}
                ]
            }
        }
    },
    created:function(){
        this.ruleForm.time = (new Date()).valueOf();
        this.ruleForm.src = 'http://192.168.0.112:8080/commonservice-system/captcha.jpg?time='+ this.ruleForm.time;
    },
    methods:{
        refreshCode(){
            this.ruleForm.time = (new Date()).valueOf();
            this.ruleForm.src = "http://192.168.0.112:8080/commonservice-system/captcha.jpg?time=" + this.ruleForm.time;
        },
        submitForm( formName) {
            this.$refs[formName].validate( (valid) => {
                if (valid) {
                    console.log('验证成功');
                    var postData = {
                        'username': this.ruleForm.name,
                        'password': this.ruleForm.password,
                        'captcha': this.ruleForm.captcha,
                        'time': this.ruleForm.time
                    }
                    this.$http.post('/api/sys/login',qs.stringify(postData)).then( r=> {
                        console.log(r);
                        console.log(postData);
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
.login{
    width: 25vw;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
        position: absolute;
        max-width: 14vw;
        right: 0;
        height: 40px;
    }
}
</style>

