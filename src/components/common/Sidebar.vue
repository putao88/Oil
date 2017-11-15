<template>
    <div>
        <div class="sidebar" :class="collapsed?'collapse-sidebar':'sidebar-width'" v-show="!collapsed">
            <div class="logo">
                <img src="../../custom/img/logo-font.png">
            </div>
            <!--导航菜单-->
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" theme="dark"
                     unique-opened router>
                <template v-for="(item,index) in permission_routers" v-if="!item.hidden">
                    <el-submenu :index="index+''" v-if="!item.leaf">
                        <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                        <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
                    </el-submenu>
                    <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
                </template>
            </el-menu>
        </div>
        
        
        <!--菜单折叠后-->
        <div class="sidebar" :class="collapsed?'collapse-sidebar':'sidebar-width'" v-show="collapsed">
            <div class="logo"></div>
            <ul class="el-menu el-menu-vertical-demo collapsed" ref="menuCollapsed">
                <li v-for="(item,index) in permission_routers" v-if="!item.hidden" class="el-submenu item el-menu--dark">
                    <div class="el-submenu__title" style="padding-left: 5px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                    <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                        <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                    </ul>
                </li>
            </ul>
        </div>
        
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        computed: {
            ...mapGetters([
                'permission_routers',
                'collapsed'
            ]),
        },
        methods:{
            showMenu(i,status){
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
            }
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        height: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 1000;
        background: #324157;
    }
    
    .collapse-sidebar {
        width:40px;
    }
    
    .sidebar-width {
        width: 220px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .sidebar-width>ul{
        width: 220px;
    }
    .logo {
        width: 100%;
        height: 80px;
    }
    
    .logo img {
        margin-left: 45px;
        margin-top: 25px;
    }
    .collapsed {
        width: 40px;
    }
    .collapsed .item{
        position: relative;
    }
    .collapsed .item .submenu{
        position:absolute;
        top:0;
        left:42px;
        z-index:99999;
        height:auto;
        display:none;
        background-color:#1F2D3D;
    }
    .collapsed .item .submenu li{
        background-color:#1F2D3D;
    }
    .collapsed .item .submenu li:hover{
        background-color:#48576A;
    }
    
</style>
