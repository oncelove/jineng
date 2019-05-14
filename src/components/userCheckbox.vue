<template>
    <!-- 角色选择 -->
    <el-checkbox-group v-model="roleIdList" :disabled="dialogDisabled">
        <el-checkbox 
            :label="roles.roleId" 
            v-for="(roles,index) in rolesArray" 
            :key="index" 
            @change="chageCheckBox"
        >
            {{roles.roleName}}
        </el-checkbox>
    </el-checkbox-group>
</template>


<script>
export default {
    props:['userchecked','disabled'],
    data(){
        return{
            roleIdList:[],
            rolesArray:[], // 角色列表
            dialogDisabled: false,
        }
    },
    watch:{
        disabled(val){
            this.dialogDisabled = val;
        },
        userchecked(val){
            // console.log(val);
            this.roleIdList = val;
        }
    },
    created(){
        this.getRolesArray();
        if (!this.userchecked) {
            this.roleIdList = this.userchecked;
        }
        this.dialogDisabled = this.disabled;
    },
    methods:{
        getRolesArray(){
            if ( this.$store.state.roleNames ) {
                this.rolesArray = this.$store.state.roleNames;
            } else {
                getRequest('/api/roles/select').then( res => {
                    // console.log(res);
                    if (res.data.code === 0) {
                        let rolesArray = [];
                        res.data.list.map( (val, index) => {
                            rolesArray.push({
                                roleId: val.roleId,
                                roleName: val.roleName
                            })
                        })
                        this.$store.commit('changeroleNames',rolesArray);
                        this.rolesArray = rolesArray;
                    } else {
                        this.$message.error(res.data.code,res.data.msg);
                    }
                }).catch( err => {
                    console.log(err);
                    this.$message.error(err + 'url:/roles/select');
                })
            }
        },
        chageCheckBox(val){
            this.$emit('listenToUserChange',this.roleIdList);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
