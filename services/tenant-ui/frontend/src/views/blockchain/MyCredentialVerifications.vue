<template>
    <div class="list-verifiable-credentials">
        <h1>Minhas Verificações de Credenciais Verificáveis</h1>
        <div v-if="verifications.length > 0">
            <div v-for="verification in verifications" :key="verification['@key']" class="verification-card">
                <h2>Verificação: {{ verification.verification }}</h2>
                <p><strong>Hash do Verificador:</strong> {{ verification.verifierHash }}</p>
                <p><strong>Resultado:</strong> {{ verification.result }}</p>
                <p><strong>Última Atualização:</strong> {{ formatTimestamp(verification['@lastUpdated']) }}</p>
            </div>
            <Paginator :first="first" :rows="rows" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]"
                @page="onPageChange" />
        </div>
        <div v-else>
            <p>Nenhuma verificação de credencial encontrada.</p>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios, { AxiosResponse } from 'axios';
import Paginator from 'primevue/paginator';

const verifications = ref<any[]>([]);
const totalRecords = ref<number>(0);
const first = ref<number>(0);
const rows = ref<number>(10);
import { useReservationStore } from '@/store'; // Importe o store global
const reservationStore = useReservationStore();
const walletIdHash = reservationStore.getWalletIdHash();
const loadVerifications = async (bookmark = '', rows = 10) => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "credentialVerification",
                    "$or": [
                        { "verifierHash": walletIdHash },
                        { "receiverHash": walletIdHash }
                    ]
                },
                limit: rows + 1,
                bookmark: bookmark
            },
            resolve: true
        });

        const verificationsData = response.data.result;
        totalRecords.value = response.data.metadata.fetched_records_count;
        verifications.value = verificationsData.slice(0, rows);
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
    loadVerifications(event.bookmark, event.rows);
};

onMounted(() => {
    loadVerifications();
});
</script>
  
<style scoped>
.list-verifiable-credentials {
    padding: 20px;
}

.verification-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.verification-card h2 {
    margin-top: 0;
}
</style>
  