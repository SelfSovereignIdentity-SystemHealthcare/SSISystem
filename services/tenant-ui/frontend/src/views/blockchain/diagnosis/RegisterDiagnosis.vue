<template>
    <h1>Registrar Diagnóstico</h1>
    <form @submit.prevent="submitForm" class="form-container">
        <Message severity="info">O Exame deverá ser cadastrado em Dashboard->Exame->Registrar exame</Message>
        <div class="form-field">
            <label for="examKey">Exame *</label>
            <Dropdown id="examKey" v-model="selectedExam" :options="examOptions" optionLabel="name" optionValue="@key"
                placeholder="Selecione o exame" />
        </div>
        <div class="form-field">
            <label for="diagnosisName">Nome do Diagnóstico *</label>
            <InputText id="diagnosisName" v-model="form.name" placeholder="Digite o nome do diagnóstico" />
        </div>
        <div class="form-field">
            <label for="diagnosisObs">Observações</label>
            <Textarea id="diagnosisObs" v-model="form.obs" placeholder="Digite observações (opcional)" />
        </div>
        <Button type="submit" label="Registrar Diagnóstico" class="submit-button" />
    </form>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import axios from 'axios';
import Message from 'primevue/message';

const toast = useToast();

interface Exam {
    '@assetType': string;
    '@key': string;
    name: string;
}

interface DiagnosisForm {
    examKey: string;
    name: string;
    obs: string;
}

const form = ref<DiagnosisForm>({
    examKey: '',
    name: '',
    obs: ''
});

const selectedExam = ref<string>(''); // To store the selected exam key
const examOptions = ref<Exam[]>([]); // To store the list of exams

const loadExams = async () => {
    try {
        const response = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    '@assetType': 'exam'
                },
                limit: 11,
                bookmark: ''
            },
            resolve: true
        });
        examOptions.value = response.data.result;
    } catch (error) {
        toast.error('Falha ao carregar os exames');
        console.error(error);
    }
};

const submitForm = async () => {
    try {
        const diagnosisData = {
            asset: [{
                '@assetType': 'diagnosis',
                exam: {
                    '@assetType': 'exam',
                    '@key': selectedExam.value
                },
                timestamp: new Date().toISOString(),
                name: form.value.name,
                obs: form.value.obs
            }]
        };

        await axios.post('http://localhost/api/invoke/createAsset', diagnosisData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        toast.success('Diagnóstico registrado com sucesso');
    } catch (error) {
        toast.error('Falha ao registrar o diagnóstico');
        console.error(error);
    }
};

onMounted(() => {
    loadExams();
});
</script>
  
<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field label {
    font-weight: bold;
}

.submit-button {
    align-self: flex-end;
    margin-top: 1rem;
}
</style>
