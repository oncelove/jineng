<template>
    <div>
        <el-row :gutter="20" class="searBox">
            <el-col :span="6">
                <el-input v-model="devicesName" placeholder="请获取设备" disabled class="bagFFF">
                    <el-button slot="append" type="success" @click="getDevices">获取设备</el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-select v-model="selectOperation" placeholder="请选择操作" @change="changeSelect">
                    <el-option label="上传固件信息" value="DESCRIBE"></el-option>
                    <el-option label="同步数据" value="SYNC_DATA"></el-option>
                    <el-option label="同步阈值" value="SYNC_THRESHOLD"></el-option>
                    <el-option label="报警延时" value="MUTE"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6" v-if="showSelectTime">
                <el-date-picker
                    v-model="selectTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-col>
            <el-col :span="8">
                <el-button @click="queryMsg">查询</el-button>
            </el-col>
        </el-row>
        <el-row class="showMsgBox" :gutter="20">
            <el-col :span="24">{{ msg }}</el-col>
        </el-row>
        <devicesDisLog 
            :isShowDevices="isShowDevices" 
            v-on:listToChildDevices="listenChild"
            v-on:listToChildClose="listenClose"
        ></devicesDisLog>
    </div>
</template>

<script>
import devicesDisLog from '@/components/devicesChange'
import { postJsonRequest } from '../../../axios';
export default {
    components:{devicesDisLog},
    data(){
        return{
            msg: null,
            devicesName: null,
            devicesId: null,
            selectOperation: null,
            selectTime:null,
            showSelectTime: false,
            isShowDevices: false,
            socketUrl:'ws://192.168.0.112:8085/rpc/websocket',
        }
    },
    methods:{
        changeSelect(val){
            if ( val == "MUTE") {
                this.showSelectTime = true;
            } else {
                this.showSelectTime = false;
            }
        },

        getDevices(){
            this.isShowDevices = true;
        },

        queryMsg(){
            let postData = {
                iotId: this.devicesId,
                delayed:this.selectTime,
                identifier: this.selectOperation
            }
            if (this.selectOperation == "MUTE") {
                if ( !this.selectTime) {
                    this.$alert('请选时间');
                    return;
                }
            }

            console.log(postData);

            postJsonRequest('/catch/rpc/send', postData).then((res) => {
                if ( res.data.code === 0) {
                    console.log(res.data.data);
                    this.socket.onclose();
                    this.getWebsocket(res.data.data.messageId);
                } else {
                    this.$message.error(res.data.code + res.data.msg);
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        getWebsocket(messageId){
            if ( typeof(WebSocket)  == "undefined" ) {
                this.$message.error('您的浏览器不支持websocket');
                return;
            }
            this.socket = new WebSocket(this.socketUrl+'/rpc-'+messageId);
            this.socket.onopen = () => { console.log('socket已链接')};
            this.socket.onclose = () => { console.log('socket已关闭')};
            this.socket.onerror = () => { console.log('socket链接错误')};
            this.socket.onmessage = msg => { 
                console.log(msg); 
                this.changeOnMsg(msg.data);
            };
        },

        changeOnMsg(data){
            this.msg = data;
        },

        listenChild(val){
            console.log(val);
            this.devicesName =val.name;
            this.devicesId = val.id;
        },

        listenClose(val){
            this.isShowDevices =false;
        }
    }
}
</script>

<style lang="scss" scoped>
.el-input-group__append button.el-button{
    background: #35c99c;
    color: #fff;
}
</style>
