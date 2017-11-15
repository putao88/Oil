<template>
    <el-button type="info" @click="ComBack">返回首页</el-button>
</template>
<script>
    export default{
        methods:{
            ComBack(){
                this.$router.push({ path: '/' })
            }
        }
    }
</script>
