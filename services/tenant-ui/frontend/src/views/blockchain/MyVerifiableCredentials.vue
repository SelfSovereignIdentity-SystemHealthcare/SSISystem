<template>
    <div class="list-verifiable-credentials">
      <h1>Minhas Credenciais Verificáveis</h1>
      <div v-if="credentials.length > 0">
        <div v-for="credential in credentials" :key="credential['@key']" class="credential-card">
          <h2>Tipo de Credencial: {{ credential.credentialType }}</h2>
          <p><strong>Emissor:</strong> {{ credential.issuerHash }}</p>
          <p><strong>Receptor:</strong> {{ credential.receiverHash }}</p>
          <p><strong>Status:</strong> {{ credential.status }}</p>
          <p><strong>Última Atualização:</strong> {{ formatTimestamp(credential['@lastUpdated']) }}</p>
          <p><strong>Dados da Credencial:</strong> {{ credential.credentialData }}</p>
        </div>
        <Paginator :first="first" :rows="rows" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]"
                   @page="onPageChange" />
      </div>
      <div v-else>
        <p>Nenhuma credencial encontrada.</p>
      </div>
    </div>
  </template>
    
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios, { AxiosResponse } from 'axios';
  import Paginator from 'primevue/paginator';
  import { useReservationStore } from '@/store'; // Importe o store global
  
  const credentials = ref<any[]>([]);
  const totalRecords = ref<number>(0);
  const first = ref<number>(0);
  const rows = ref<number>(10);
  const reservationStore = useReservationStore();
  const walletIdHash = reservationStore.getWalletIdHash();
  
  const loadCredentials = async (bookmark = '', rows = 10) => {
    try {
      const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/search', {
        query: {
          selector: {
            "@assetType": "verifiableCredential",
            "$or": [
              { "issuerHash": walletIdHash },
              { "receiverHash": walletIdHash }
            ]
          },
          limit: rows + 1,
          bookmark: bookmark
        },
        resolve: true
      });
  
      const credentialsData = response.data.result;
      totalRecords.value = response.data.metadata.fetched_records_count;
      credentials.value = credentialsData.slice(0, rows);
    } catch (error) {
      console.error(error);
    }
  };
  
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };
  
  const onPageChange = (event: any) => {
    first.value = event.first;
    rows.value = event.rows;
    loadCredentials(event.bookmark, event.rows);
  };
  
  onMounted(() => {
    loadCredentials();
  });
  </script>
    
  <style scoped>
  .list-verifiable-credentials {
    padding: 20px;
  }
  
  .credential-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .credential-card h2 {
    margin-top: 0;
  }
  </style>
  