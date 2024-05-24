<template>
  <Card class="info-card mt-4 mb-6">
    <template #title>
      <i class="pi pi-check-circle info-card-icon"></i> <br />
      {{ $t('reservations.validated!') }}
    </template>
    <template #content>
      <!-- If the user has just completed their password validation, to show the wallet details -->
      <p>
        {{ $t('reservations.reservationValidated') }} <br />
        {{ $t('reservations.walletIdAndWalletKey') }}
      </p>

      <div class="field mt-5 w-full">
        <label for="wallet-id">{{ $t('common.walletId') }}</label>
        <div class="p-inputgroup">
          <InputText
            id="wallet-id"
            readonly
            :value="walletId"
            name="wallet-id"
            class="w-full"
          />
          <Button
            icon="pi pi-copy"
            title="Copy to clipboard"
            class="p-button-secondary"
            @click="copyWalletId"
          />
        </div>
      </div>

      <div class="field">
        <label for="wallet-key">{{ $t('reservations.walletKey') }}</label>
        <div class="p-inputgroup">
          <Password
            id="wallet-key"
            v-model="walletKey"
            readonly
            class="w-full"
            input-class="w-full"
            toggle-mask
            :feedback="false"
            placeholder="Password"
          />
          <Button
            icon="pi pi-copy"
            title="Copy to clipboard"
            class="p-button-secondary"
            @click="copyWalletKey"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <hr />
      {{ $t('reservations.saveWalletIdAndWalletKey') }}
    </template>
  </Card>
</template>

<script setup lang="ts">
// PrimeVue/Validation/etc
import Card from 'primevue/card';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
// State
import { useReservationStore } from '@/store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

// Notifications
import { useToast } from 'vue-toastification';
const toast = useToast();

const { walletId, walletKey } = storeToRefs(useReservationStore());

/**
 * Copy wallet ID to clipboard
 */
const copyWalletId = () => {
  navigator.clipboard.writeText(walletId.value);
  toast.info('Copied wallet ID to clipboard!');
};
/**
 * Copy wallet key to clipboard
 */
const copyWalletKey = () => {
  navigator.clipboard.writeText(walletKey.value);
  toast.info('Copied Wallet Key to clipboard!');
};

import axios from 'axios';
import CryptoJS from 'crypto-js';

const globalReservationId = useReservationStore(); // Obtenha a instância do store global

/**
 * Gerar hash SHA256
 */
function gerarHashSHA256(email: string) {
  return CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
}

/**
 * Register the reservation data on the blockchain
 * @param reservationIdHash
 * @param walletId
 */
const registerOnBlockchain = async (walletIdHash: string, walletId: string) => {
  const timestamp = new Date().toISOString();
  const blockchainData = [
    {
      "@assetType": "ssishEvent",
      "walletHash": walletIdHash,
      "eventType": "reservation",
      "timestamp": timestamp,
      "eventDetails": "Cadastro realizado com sucesso!"
    },
    {
      "@assetType": "wallet",
      "holderHash": walletIdHash
    },
    {
      "@assetType": "did",
      "walletHash": walletIdHash,
      "userController": walletId,
      "publicKey": "somePublicKey", // replace with actual public key if available
      "authenticationMethods": "someAuthMethods", // replace with actual methods if available
      "services": "someServices", // replace with actual services if available
      "timestamp": timestamp,
      "status": "active"
    }
  ];

  for (const asset of blockchainData) {
    try {
      await axios.post('http://localhost:80/api/invoke/createAsset', { asset: [asset] }, {
        headers: {
          'Content-Type': 'application/json',
          'cache-control': 'no-cache'
        }
      });
      toast.success(`O Ativo ${asset["@assetType"]} foi registrado com sucesso na Blockchain!`);
    } catch (error) {
      console.error(`Falha ao registrar o ativo ${asset["@assetType"]}`, error);
      toast.error(`Falha ao registrar o ativo ${asset["@assetType"]}`);
    }
  }
};

// Use onMounted to call the function when the component is loaded
onMounted(async () => {
  try {
    
    const walletIdHash = gerarHashSHA256(walletId.value);

    await registerOnBlockchain(walletIdHash, walletId.value);
  } catch (error) {
    console.error("Erro ao enviar os dados para a blockchain:", error);
    toast.error("Erro ao enviar os dados para a blockchain");
  }
});
</script>
