<template>
  <div v-if="showDidRegister">
    <Button
      title="Registrar DID Público"
      icon="pi pi-file-export"
      class="p-button-rounded p-button-icon-only p-button-text"
      @click="registerPublicDid()"
    />
  </div>

  <div v-if="showRegistered">
    <i
      v-tooltip="'DID Público foi registrado. Veja os detalhes abaixo.'"
      class="pi pi-check-circle text-green-600"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import { useToast } from 'vue-toastification';
import { useTenantStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useReservationStore } from '@/store'; // Importe o store global

const props = defineProps<{
  ledgerInfo: any;
}>();

const toast = useToast();
const tenantStore = useTenantStore();
const { endorserConnection, publicDid, writeLedger } = storeToRefs(tenantStore);

const registerPublicDid = async () => {
  try {
    await tenantStore.registerPublicDid();
    toast.success('Registro de DID Público enviado');

    const publicKey = publicDid.value?.did; // Supondo que publicDid.value.did contenha a publicKey

    // Supondo que você esteja importando o store corretamente
    var reservationStore = useReservationStore();
    var reservationId = reservationStore.getReservationId();
    await updateDidAsset({
      "@assetType": "did",
      "walletHash": reservationId, // Ajuste conforme necessário
      "publicKey": publicKey
    });

    await registerBlockchainEvent({
      asset: [
        {
          "@assetType": "ssishEvent",
          "walletHash": reservationId,
          "eventType": "DID registrado como emissor",
          "timestamp": new Date().toISOString(),
          "eventDetails": "DID Público foi registrado como emissor."
        }
      ]
    });
  } catch (error) {
    toast.error(`Falha ao registrar: ${error}`);
  }
};

const updateDidAsset = async (data: any) => {
  try {
    await axios.put('http://localhost:80/api/invoke/updateAsset', { update: data }, {
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
      }
    });
    toast.success('Ativo DID atualizado com sucesso');
  } catch (error) {
    toast.error(`Falha ao atualizar o ativo DID: ${error}`);
  }
};

const registerBlockchainEvent = async (data: any) => {
  try {
    await axios.post('http://localhost:80/api/invoke/createAsset', data, {
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache'
      }
    });
    toast.success('Evento registrado na blockchain');
  } catch (error) {
    toast.error(`Falha ao registrar evento na blockchain: ${error}`);
  }
};

const currWriteLedger = computed(() => writeLedger?.value?.ledger_id ?? null);

const showDidRegister = computed(
  () =>
    props.ledgerInfo.ledger_id === currWriteLedger.value &&
    !hasPublicDid.value &&
    endorserConnection.value?.state === 'active'
);

const hasPublicDid = computed(() => !!publicDid.value && !!publicDid.value.did);
const showRegistered = computed(
  () =>
    props.ledgerInfo.ledger_id === currWriteLedger.value && hasPublicDid.value
);
</script>
