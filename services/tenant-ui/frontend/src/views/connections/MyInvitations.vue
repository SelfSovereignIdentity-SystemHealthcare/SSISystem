<template>
  <Invitations :ledgerInfo="ledgerInfoData" />
</template>

<script setup lang="ts">
import Invitations from '@/components/connections/Invitations.vue';
import { defineProps } from 'vue';

const props = defineProps<{
  ledgerInfo: any;
}>();

// Suponha que você tenha seus dados do ledgerInfo aqui
const ledgerInfoData = {
  ledgerId: 'ledger123',
  endorserAlias: 'endorserABC',
  otherInfo: 'other data here'
};

</script>
