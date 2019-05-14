<template>
    <el-cascader
        :options="options"
        :props="optionProps"
        v-model="selectedOptions"
        :disabled="dialogDisabled"
        @change="handleChange">
    </el-cascader>
</template>
<script>
import {getRequest, putJsonRequest, postJsonRequest, deleteRequest} from '@/axios.js'
export default {
    props:['disabled','agentId'],
    watch:{
        disabled(val){
            this.dialogDisabled =  val;
        },
        agentId(val){
            this.selectedOptions[0] = val;
        }
    },
    data(){
        return {
            options:[],
            selectedOptions:[],
            dialogDisabled:true,
            optionProps:{
                value: 'agentId',
                label: 'name',
                children: 'children'
            },
        }
    },
    methods:{
        handleChange(val){
            this.$emit('lintenToChildSelected',this.selectedOptions);
        }
    },
    mounted(){
        this.dialogDisabled = this.disabled;
        setTimeout(() => {
            this.selectedOptions[0] = this.agentId; 
        }, 500);
        getRequest('/api/agent/select').then( res => {
            if ( res.data.code === 0) {
                this.options = res.data.agentList;
            } else {
                this.$message.error(res.data.code + res.data.msg)
            }
        }).catch( err => {
            console.log(err);
        })
    }
}
</script>

<style lang="scss" scoped>

</style>
