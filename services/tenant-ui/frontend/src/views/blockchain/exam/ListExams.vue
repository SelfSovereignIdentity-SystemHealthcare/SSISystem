<template>
    <div class="list-exams">
        <h1>Meus Exames</h1>
        <div v-if="exams.length > 0">
            <div v-for="exam in exams" :key="exam['@key']" class="exam-card">
                <h2>{{ exam.name }}</h2>
                <p><strong>Email do Paciente:</strong> {{ exam.patientName }}</p>
                <p><strong>Email do Médico:</strong> {{ exam.doctorName }}</p>
                <p><strong>Data:</strong> {{ formatTimestamp(exam.timestamp) }}</p>
                <p v-if="exam.diagnosis">
                    <strong>Diagnóstico:</strong> {{ exam.diagnosis.name }}
                </p>
                <p v-else>
                    <strong>Diagnóstico:</strong> Não disponível
                </p>
                <p v-if="exam.treatment">
                    <strong>Tratamento:</strong> {{ exam.treatment.name }}
                </p>
                <p v-else>
                    <strong>Tratamento:</strong> Não disponível
                </p>
                <p><strong>Documento do Exame:</strong> {{ exam.urlExamDocument }} <a
                        :href="getExamDocumentUrl(exam.urlExamDocument)" target="_blank">Abrir servidor de arquivos</a></p>
                <Button label="Editar" @click="editExam(exam['@key'])"></Button>
            </div>
        </div>
        <div v-else>
            <p>Nenhum exame encontrado.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import { useReservationStore } from '@/store'; // Importe o store global
import Button from 'primevue/button';

const reservationStore = useReservationStore();
const walletIdHash = reservationStore.getWalletIdHash();
const exams = ref<any[]>([]);
const router = useRouter();

const getExamDocumentUrl = (documentPath: string): string => {
    return `http://localhost:9001`;
};

const loadExams = async () => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/search', {
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

        const examsData = response.data.result;

        for (const exam of examsData) {
            exam.patientName = await getPatientName(exam.patientWalletHolderHash);
            exam.doctorName = await getDoctorName(exam.doctorWalletHolderHash);

            if (exam.diagnosisHash) {
                exam.diagnosis = await getDiagnosis(exam.diagnosisHash);
            }
            if (exam.treatmentHash) {
                exam.treatment = await getTreatment(exam.treatmentHash);
            }
        }

        exams.value = examsData;
    } catch (error) {
        console.error(error);
    }
};

const getPatientName = async (patientWalletHolderHash: string): Promise<string> => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/readAsset', {
            key: {
                "@assetType": "wallet",
                "holderHash": patientWalletHolderHash
            }
        });
        return response.data.email;
    } catch (error) {
        console.error(error);
        return "Paciente Desconhecido";
    }
};

const getDoctorName = async (doctorWalletHolderHash: string): Promise<string> => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/readAsset', {
            key: {
                "@assetType": "wallet",
                "holderHash": doctorWalletHolderHash
            }
        });
        return response.data.email;
    } catch (error) {
        console.error(error);
        return "Médico Desconhecido";
    }
};

const getDiagnosis = async (diagnosisHash: string): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/readAsset', {
            key: {
                "@assetType": "diagnosis",
                "@key": diagnosisHash
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getTreatment = async (treatmentHash: string): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/readAsset', {
            key: {
                "@assetType": "treatment",
                "@key": treatmentHash
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
};

const editExam = (examId: string) => {
    router.push({ name: 'UpdateExam', params: { examId } });
};

onMounted(() => {
    loadExams();
});
</script>

<style scoped>
.list-exams {
    padding: 20px;
}

.exam-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.exam-card h2 {
    margin-top: 0;
}
</style>
