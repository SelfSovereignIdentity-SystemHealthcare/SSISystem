<template>
  <Toolbar class="traction-header">
    <template #start>
      <div class="hamburger" :title="$t('layout.header.toggleSideMenu')" @click="toggleSidebar">
        <i class="pi pi-bars p-toolbar-separator mr-2" />
      </div>

      <div style="display: flex; align-items: center; color: rgb(1, 122, 167); font-family: Poppins, sans-serif;">
        <img src="../../IconeBlockchainSSI.png" alt="SSI Icon" style="padding-right: 10px;height: 50px; margin-bottom: 1px;" />
        <span>Self Sovereign Identity System for Healthcare</span>
        <br/>
        <p style="padding-left: 10px; font-size: 75%; color: black;">TCC Matheus Lázaro - Ciência da Computação - INF UFG</p>
      </div>
    </template>

    <template #end>
      
      <ProfileButton />
      <SessionTimer />
    </template>
  </Toolbar>
</template>

<style>
/* Adicione a fonte Poppins aqui */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

/* Aplicar a fonte Poppins */
.traction-header {
  font-family: 'Poppins', sans-serif;
}
</style>




<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import ProfileButton from '@/components/profile/ProfileButton.vue';
import LocaleSwitcher from '../common/LocaleSwitcher.vue';
import SessionTimer from '../common/SessionTimer.vue';

// State
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/store/commonStore';

// Whether the sidebar is open or not
const { sidebarOpen } = storeToRefs(useCommonStore());

/**
 * Toggle the sidebar open or closed
 */
const toggleSidebar = () => {
  if (sidebarOpen.value === null) {
    /* This is the first click so check current page size */
    if (window.innerWidth > 1000) {
      sidebarOpen.value = false;
    } else {
      sidebarOpen.value = true;
    }
  } else if (sidebarOpen.value) {
    /* If the sidebar is open, close it */
    sidebarOpen.value = false;
  } else {
    /* If the sidebar is closed, open it */
    sidebarOpen.value = true;
  }
};
</script>

<style scoped>
/* Make the hamburger button slightly reactive */
.hamburger {
  cursor: pointer;
  padding: 0.75rem;
  opacity: 0.5;
}

.hamburger:hover {
  transform: scale(1.2) translate(0, 0.1rem);
  transition: 0.2s ease-in-out;
  opacity: 1;
}
</style>
