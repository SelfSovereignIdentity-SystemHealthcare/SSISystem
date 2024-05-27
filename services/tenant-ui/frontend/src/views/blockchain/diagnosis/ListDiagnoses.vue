<template>
    <div class="list-diagnoses">
        <h1>Meus Diagnósticos</h1>
        <div v-if="diagnoses.length > 0">
            <div v-for="diagnosis in diagnoses" :key="diagnosis['@key']" class="diagnosis-card">
                <h2>{{ diagnosis.name }}</h2>
                <p><strong>Exame:</strong> {{ getRelatedExam(diagnosis.exam['@key']) }}</p>
                <p><strong>Data do Diagnóstico:</strong> {{ formatTimestamp(diagnosis.timestamp) }}</p>
                <p><strong>Observações:</strong> {{ diagnosis.obs }}</p>
            </div>
        </div>
        <div v-else>
            <p>Nenhum diagnóstico encontrado.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useReservationStore } from '@/store'; // Importe o store global

const diagnoses = ref<any[]>([]);
const exams = ref<any[]>([]);
const reservationStore = useReservationStore();
const walletIdHash = reservationStore.getWalletIdHash();

const loadDiagnoses = async () => {
    try {
        // Buscar exames relacionados ao walletIdHash
        const examResponse = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "exam",
                    "$or": [
                        { "patientWalletHolderHash": walletIdHash },
                        { "doctorWalletHolderHash": walletIdHash }
                    ]
                },
                limit: 11,
                bookmark: ""
            },
            resolve: true
        });

        exams.value = examResponse.data.result;
        const examKeys = exams.value.map((exam: any) => exam['@key']);

        // Buscar diagnósticos relacionados aos exames obtidos
        const diagnosisResponse = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "diagnosis"
                },
                limit: 11,
                bookmark: ""
            },
            resolve: true
        });

        const allDiagnoses = diagnosisResponse.data.result;
        diagnoses.value = allDiagnoses.filter((diagnosis: any) => examKeys.includes(diagnosis.exam['@key']));
    } catch (error) {
        console.error(error);
    }
};

const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
};

const getRelatedExam = (examKey: string): string => {
    const relatedExam = exams.value.find((exam: any) => exam['@key'] === examKey);
    return relatedExam ? relatedExam.name : 'Exame não encontrado';
};

onMounted(() => {
    loadDiagnoses();
});
</script>

<style scoped>
.list-diagnoses {
    padding: 20px;
}

.diagnosis-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.diagnosis-card h2 {
    margin-top: 0;
}
</style>
