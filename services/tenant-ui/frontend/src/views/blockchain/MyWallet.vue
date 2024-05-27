<template>
    <div class="my-wallet">
        <h1>Minha Carteira</h1>
        <div class="wallet-details">
            <p><strong>Email:</strong> {{ wallet.email }}</p>
            <p><strong>Holder Hash:</strong> {{ wallet.holderHash }}</p>
            <p><strong>Última Atualização:</strong> {{ formatTimestamp(wallet['@lastUpdated']) }}</p>
        </div>
        <div class="buttons">
            <Button label="Ver minhas Credenciais Verificáveis" @click="viewVerifiableCredentials" />
            <Button label="Ver minhas verificações de Credenciais Verificáveis" @click="viewVerificationChecks" />
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const wallet = ref<any>({});
const router = useRouter();

const loadWallet = async () => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost/api/query/readAsset', {
            key: {
                "@assetType": "wallet",
                "holderHash": "1909199430630d39b97941f994902e566350b9b1ac8df7c2a8875fa147b9c4a9"
            },
            resolve: true
        });

        wallet.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
};

const viewVerifiableCredentials = () => {
    router.push({ name: 'MyVerifiableCredentials' });
};

const viewVerificationChecks = () => {
    router.push({ name: 'MyCredentialVerifications' });
};

onMounted(() => {
    loadWallet();
});
</script>
  
<style scoped>
.my-wallet {
    padding: 20px;
}

.wallet-details {
    margin-bottom: 20px;
}

.buttons {
    display: flex;
    gap: 10px;
}
</style>
  