<template>
  <div class="min-h-screen bg-[#0f0f1a]">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>
