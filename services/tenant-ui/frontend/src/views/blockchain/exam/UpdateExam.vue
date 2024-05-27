<template>
    <h1>Atualizar Exame</h1>
    <form @submit.prevent="submitForm" class="form-container">
        <div class="form-field">
            <label for="examId">ID do Exame *</label>
            <InputText id="examId" v-model="form.examId" placeholder="Digite o ID do exame" disabled />
            <!--<Button label="Carregar Exame" @click="loadExam" />-->
        </div>

        <div class="form-field">
            <label for="patientWallet">Carteira do Paciente</label>
            <InputText id="patientWallet" v-model="form.patientWalletHolderHash" disabled />
        </div>

        <div class="form-field">
            <label for="doctorWallet">Carteira do Médico</label>
            <InputText id="doctorWallet" v-model="form.doctorWalletHolderHash" disabled />
        </div>

        <div class="form-field">
            <label for="name">Nome do Exame *</label>
            <InputText id="name" v-model="form.name" placeholder="Digite o nome do exame" />
        </div>

        <div class="form-field">
            <label for="diagnosisHash">Diagnóstico</label>
            <Dropdown id="diagnosisHash" v-model="form.diagnosisHash" :options="diagnosisOptions" optionLabel="name"
                optionValue="@key" placeholder="Selecione o diagnóstico" />
        </div>

        <div class="form-field">
            <label for="treatmentHash">Tratamento</label>
            <Dropdown id="treatmentHash" v-model="form.treatmentHash" :options="treatmentOptions" optionLabel="name"
                optionValue="@key" placeholder="Selecione o tratamento" />
        </div>

        <Button type="submit" label="Atualizar Exame" class="submit-button" />
    </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import axios from 'axios';

const toast = useToast();
const route = useRoute();

interface Form {
    examId: string;
    patientWalletHolderHash: string;
    doctorWalletHolderHash: string;
    timestamp: string;
    name: string;
    diagnosisHash: string;
    treatmentHash: string;
}

const form = ref<Form>({
    examId: '',
    patientWalletHolderHash: '',
    doctorWalletHolderHash: '',
    timestamp: '',
    name: '',
    diagnosisHash: '',
    treatmentHash: ''
});

const diagnosisOptions = ref<any[]>([]);
const treatmentOptions = ref<any[]>([]);

const loadExam = async () => {
    try {
        const response = await axios.post('http://localhost:80/api/query/readAsset', {
            key: {
                '@assetType': 'exam',
                '@key': form.value.examId
            }
        });
        const exam = response.data;
        form.value.patientWalletHolderHash = exam.patientWalletHolderHash;
        form.value.doctorWalletHolderHash = exam.doctorWalletHolderHash;
        form.value.timestamp = exam.timestamp;
        form.value.name = exam.name;
        form.value.diagnosisHash = exam.diagnosisHash;
        form.value.treatmentHash = exam.treatmentHash;

        // Carregar diagnósticos e tratamentos após carregar o exame
        await loadDiagnosesAndTreatments();
    } catch (error) {
        toast.error('Falha ao carregar o exame');
        console.error(error);
    }
};

const loadDiagnosesAndTreatments = async () => {
    try {
        const diagnosisResponse = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "diagnosis"
                },
                limit: 50, // Ajuste o limite conforme necessário
                bookmark: ""
            },
            resolve: true
        });
        diagnosisOptions.value = diagnosisResponse.data.result;

        const treatmentResponse = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "treatment"
                },
                limit: 50, // Ajuste o limite conforme necessário
                bookmark: ""
            },
            resolve: true
        });
        treatmentOptions.value = treatmentResponse.data.result;
    } catch (error) {
        toast.error('Falha ao carregar diagnósticos e tratamentos');
        console.error(error);
    }
};

const submitForm = async () => {
    try {
        const updateData = {
            "@assetType": "exam",
            "@key": form.value.examId,
            "name": form.value.name,
            "diagnosisHash": form.value.diagnosisHash,
            "treatmentHash": form.value.treatmentHash
        };

        await axios.put('http://localhost:80/api/invoke/updateAsset', { update: updateData }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        toast.success('Exame atualizado com sucesso');
    } catch (error) {
        toast.error('Falha ao atualizar o exame');
        console.error(error);
    }
};

onMounted(() => {
    const examId = route.params.examId as string;
    if (examId) {
        form.value.examId = examId;
        loadExam();
    }
});
</script>

<style scoped>
.form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.form-field {
    margin-bottom: 20px;
}

.submit-button {
    display: block;
    width: 100%;
}
</style>
