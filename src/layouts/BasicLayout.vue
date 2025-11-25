<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">

      <a-layout-header class="header">
        <GlobalHeader></GlobalHeader>
      </a-layout-header>
      <a-layout>
        <GlobalSider class="sider"></GlobalSider>
        <a-layout-content class="content">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        <a href="https://github.com/lumiere3" target="_blank"> made by lumine </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
</script>


<style scoped>
#basicLayout .header{
  background: white;
  color: unset;
  margin-bottom: 1px;
}
#basicLayout .sider{
  background: white;
  padding-top: 20px;
}


#basicLayout .content{
  padding: 24px;
  background: linear-gradient(to right, rgb(220, 226, 234), rgba(223, 213, 228, 0.7));
  margin-bottom: 26px;
}

#basicLayout .footer{
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
