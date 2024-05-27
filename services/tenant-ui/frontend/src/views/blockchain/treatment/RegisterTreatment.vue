<template>
    <h1>Registrar Tratamento</h1>
    <form @submit.prevent="submitForm" class="form-container">
        <Message severity="info">O Diagnóstico deverá ser cadastrado em Dashboard->Diagnóstico->Registrar diagnóstico</Message>
        <div class="form-field">
            <label for="diagnosisKey">Diagnóstico *</label>
            <Dropdown id="diagnosisKey" v-model="selectedDiagnosis" :options="diagnosisOptions" optionLabel="name"
                optionValue="@key" placeholder="Selecione o diagnóstico" />
        </div>
        <div class="form-field">
            <label for="treatmentName">Nome do Tratamento *</label>
            <InputText id="treatmentName" v-model="form.name" placeholder="Digite o nome do tratamento" />
        </div>
        <div class="form-field">
            <label for="treatmentObs">Observações</label>
            <Textarea id="treatmentObs" v-model="form.obs" placeholder="Digite observações (opcional)" />
        </div>
        <Button type="submit" label="Registrar Tratamento" class="submit-button" />
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

interface Diagnosis {
    '@assetType': string;
    '@key': string;
    name: string;
    exam: {
        '@assetType': string;
        '@key': string;
    };
    timestamp: string;
    obs: string;
}

interface TreatmentForm {
    diagnosisKey: string;
    name: string;
    obs: string;
}

const form = ref<TreatmentForm>({
    diagnosisKey: '',
    name: '',
    obs: ''
});

const selectedDiagnosis = ref<string>(''); // To store the selected diagnosis key
const diagnosisOptions = ref<Diagnosis[]>([]); // To store the list of diagnoses

const loadDiagnoses = async () => {
    try {
        const response = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    '@assetType': 'diagnosis'
                },
                limit: 11,
                bookmark: ''
            },
            resolve: true
        });
        diagnosisOptions.value = response.data.result;
    } catch (error) {
        toast.error('Falha ao carregar os diagnósticos');
        console.error(error);
    }
};

const submitForm = async () => {
    try {
        const treatmentData = {
            asset: [{
                '@assetType': 'treatment',
                diagnosis: {
                    '@assetType': 'diagnosis',
                    '@key': selectedDiagnosis.value
                },
                timestamp: new Date().toISOString(),
                name: form.value.name,
                obs: form.value.obs
            }]
        };

        await axios.post('http://localhost:80/api/invoke/createAsset', treatmentData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        toast.success('Tratamento registrado com sucesso');
    } catch (error) {
        toast.error('Falha ao registrar o tratamento');
        console.error(error);
    }
};

onMounted(() => {
    loadDiagnoses();
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
