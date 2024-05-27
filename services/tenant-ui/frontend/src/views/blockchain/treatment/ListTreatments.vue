<template>
    <div class="list-treatments">
        <h1>Meus Tratamentos</h1>
        <div v-if="treatments.length > 0">
            <div v-for="treatment in treatments" :key="treatment['@key']" class="treatment-card">
                <h2>{{ treatment.name }}</h2>
                
                <p><strong>Diagnóstico:</strong> {{ getRelatedDiagnosis(treatment.diagnosis['@key']) }}</p>
                <p><strong>Data do Tratamento:</strong> {{ formatTimestamp(treatment.timestamp) }}</p>
                <p><strong>Observações:</strong> {{ treatment.obs }}</p>
            </div>
        </div>
        <div v-else>
            <p>Nenhum tratamento encontrado.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useReservationStore } from '@/store'; // Importe o store global

const treatments = ref<any[]>([]);
const diagnoses = ref<any[]>([]);
const exams = ref<any[]>([]);
const reservationStore = useReservationStore();
const walletIdHash = reservationStore.getWalletIdHash();
import Message from 'primevue/message';


const loadTreatments = async () => {
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
                    "@assetType": "diagnosis",
                    "exam.@key": { "$in": examKeys }
                },
                limit: 11,
                bookmark: ""
            },
            resolve: true
        });

        diagnoses.value = diagnosisResponse.data.result;
        const diagnosisKeys = diagnoses.value.map((diagnosis: any) => diagnosis['@key']);

        // Buscar tratamentos relacionados aos diagnósticos obtidos
        const treatmentResponse = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "treatment",
                    "diagnosis.@key": { "$in": diagnosisKeys }
                },
                limit: 11,
                bookmark: ""
            },
            resolve: true
        });

        treatments.value = treatmentResponse.data.result;
    } catch (error) {
        console.error(error);
    }
};

const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
};

const getRelatedDiagnosis = (diagnosisKey: string): string => {
    const relatedDiagnosis = diagnoses.value.find((diagnosis: any) => diagnosis['@key'] === diagnosisKey);
    return relatedDiagnosis ? relatedDiagnosis.name : 'Diagnóstico não encontrado';
};

onMounted(() => {
    loadTreatments();
});
</script>

<style scoped>
.list-treatments {
    padding: 20px;
}

.treatment-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.treatment-card h2 {
    margin-top: 0;
}
</style>
