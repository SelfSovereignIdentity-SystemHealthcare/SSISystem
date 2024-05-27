<template>
    <h1>Registrar Exame</h1>
    <form @submit.prevent="submitForm" class="form-container">
        <div class="form-field">
            <label for="patientWallet">Carteira do Paciente *</label>
            <Dropdown id="patientWallet" v-model="form.patientWalletHolderHash" :options="walletOptions" optionLabel="email"
                optionValue="holderHash" placeholder="Selecione a carteira do paciente" />
        </div>

        <div class="form-field">
            <label for="doctorWallet">Carteira do Médico *</label>
            <Dropdown id="doctorWallet" v-model="form.doctorWalletHolderHash" :options="walletOptions" optionLabel="email"
                optionValue="holderHash" placeholder="Selecione a carteira do médico" />
        </div>

        <div class="form-field">
            <label for="name">Nome do Exame *</label>
            <InputText id="name" v-model="form.name" placeholder="Digite o nome do exame" />
        </div>
        <div class="form-field">
            <label for="urlExamDocument">Documento do Exame *</label>
            <FileUpload name="urlExamDocument" chooseLabel="Escolher Arquivo" @select="handleFileSelect" />
        </div>

        <Message severity="info">Tratamento e Diagnóstico deverão ser cadastrados em Dashboard->Exame->Listar Exames->Editar</Message>
        <!--
        <div class="form-field">
            <label for="diagnosisHash">Hash do Diagnóstico</label>
            <InputText id="diagnosisHash" v-model="form.diagnosisHash" placeholder="Digite o hash do diagnóstico" />
        </div>

        <div class="form-field">
            <label for="treatmentHash">Hash do Tratamento</label>
            <InputText id="treatmentHash" v-model="form.treatmentHash" placeholder="Digite o hash do tratamento" />
        </div>
        -->
        <Button type="submit" label="Registrar Exame" class="submit-button" />
    </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import axios from 'axios';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';

const toast = useToast();

interface Form {
    patientWalletHolderHash: string;
    doctorWalletHolderHash: string;
    timestamp: string;
    name: string;
    urlExamDocument: File | null;
    diagnosisHash: string;
    treatmentHash: string;
}

const form = ref<Form>({
    patientWalletHolderHash: '',
    doctorWalletHolderHash: '',
    timestamp: new Date().toISOString(),
    name: '',
    urlExamDocument: null,
    diagnosisHash: '',
    treatmentHash: ''
});

const handleFileSelect = (event: any) => {
    const file = event.files[0] || null;
    form.value.urlExamDocument = file;
};

const walletOptions = ref([]);

const loadWallets = async () => {
    try {
        const response = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    '@assetType': 'wallet'
                },
                limit: 11,
                bookmark: ''
            },
            resolve: true
        });
        walletOptions.value = response.data.result;
    } catch (error) {
        toast.error('Falha ao carregar as carteiras');
        console.error(error);
    }
};

const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    form.value.urlExamDocument = file;
};

const submitForm = async () => {
    try {
        const formData = new FormData();
        formData.append('patientWalletHolderHash', form.value.patientWalletHolderHash);
        formData.append('doctorWalletHolderHash', form.value.doctorWalletHolderHash);
        formData.append('timestamp', form.value.timestamp);
        formData.append('name', form.value.name);
        if (form.value.urlExamDocument) {
            formData.append('urlExamDocument', form.value.urlExamDocument);
        }
        formData.append('diagnosisHash', form.value.diagnosisHash);
        formData.append('treatmentHash', form.value.treatmentHash);

        await axios.post('http://localhost:80/api/invoke/handlerCreateExam', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.success('Exame registrado com sucesso');
    } catch (error) {
        toast.error('Falha ao registrar o exame');
        console.error(error);
    }
};

onMounted(() => {
    loadWallets();
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
