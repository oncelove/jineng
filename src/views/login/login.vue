<template>
    <div class="login-box">
        
        <div class="login-content">
            <div class="login-logo">
                <img src="./../../assets/logo.png" alt="">
            </div>
            <div class="left-content">
                <!-- <img src="./../../assets/login-bg.png" alt=""> -->
            </div>
            <!-- <div class="login">
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
            </div>  -->
            <div class="login">
                <ul class="come-in">
                    <li>
                        <i class="iconfont icon-user"></i>
                        <input type="text" placeholder="请输入用户名">
                    </li>
                    <li>
                        <i class="iconfont icon-password"></i>
                        <input type="password" placeholder="请输入密码">
                    </li>
                    <li class="Verification">
                        <i class="iconfont iconyanzhengma"></i>
                        <input type="text" placeholder="请输入验证码">
                        <!-- <img :src="ruleForm.src" alt="如果看不清楚，请单击图片刷新！" @click="refreshCode"> -->
                        <img src="./../../assets/logo.png" alt="">
                    </li>
                    <li class="submit">
                        <a href="javascript:;">登陆</a>
                    </li>
                </ul>
                <p>致力于更好的能源管理服务</p>
            </div>
        </div>
        <p class="tips">欢迎登录IXMS系统<br><span>Welcome to the IXMS world</span></p>
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
        // this.ruleForm.src = 'http://192.168.0.112:8080/commonservice-system/captcha.jpg?time='+ this.ruleForm.time;
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
.login-box{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f6f7fb;
    .login-logo{
        position: absolute;
        left: 0;
        right: 0;
        top: -100px;
        text-align: center;
    }
    .login-content{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        transform: translate(-50%,-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 340px;
        .left-content{
            flex: 1;
            max-width: 1000px;
            height: 340px;
            background: url('./../../assets/login-bg.png') center no-repeat;
            img{
                max-width: 1000px;
                height: 340px;
            }
        }
    }
    .tips{
        position: absolute;
        bottom: 10%;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 24px;
        color: #e1e5e1;
        span{
            font-size: 16px;
        }
    }
    .login{
        position: relative;
        p{
            position: absolute;
            bottom: -52px;
            left: 0;
            width: 100%;
            height: 52px;
            line-height: 52px;
            font-size: 18px;
            text-align: center;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
    }
    .come-in{
        width: 400px;
        height: 340px;
        padding-top: 10px;
        box-shadow: 0 0 5px rgba(50, 51, 50, 0.1);
        background: #fff;
        border-radius: 6px;
    }
    li{
        position: relative;
        width: 300px;
        margin: 20px 50px;
        height: 46px;
        input{
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            padding-left: 40px;
            border:none;
            border-bottom: 2px solid  #e2e4e2;
        }
        .iconfont{
            position: absolute;
            left: 0;
            bottom: 8px;
            font-size: 26px;
            z-index: 2;
        }
    }
    .Verification{
        input{
            width: 190px;
            border-bottom: 1px solid  #e2e4e2;
        }
        img{
            position: absolute;
            right: 0;
            bottom: 1px;
            width: 90px;
            height: 35px;
            border-radius: 12px;
        }
    }
    .submit{
        margin-top: 40px;
        a{
            display: flex;
            margin: 0 auto;
            width: 100px;
            height: 30px;
            justify-content: center;
            align-items: center;
            color: #fff;
            opacity: 0.5;
            letter-spacing: 8px;
            background: #35c99c;
            border-radius: 10px;
        }
    }
}
// .login{
//     width: 25vw;
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     img{
//         position: absolute;
//         max-width: 14vw;
//         right: 0;
//         height: 40px;
//     }
// }
@media screen and (max-width: 1440px){
    .login-box{
        .login-content{
            width: 90%;
        }
    }
}
</style>

