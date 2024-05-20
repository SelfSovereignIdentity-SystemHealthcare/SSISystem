<template>
  <div v-if="showEndorserConnect">
    <Button title="Conectar ao endossante" icon="pi pi-user-plus" class="p-button-rounded p-button-icon-only p-button-text"
      @click="connectToLedger()" />
  </div>

  <div v-if="showLedgerSwitch">
    <Button label="Trocar Ledger" icon="pi pi-arrow-right-arrow-left" text @click="switchLedger($event)" />
  </div>

  <div v-if="endorserConnection && props.ledgerInfo.ledger_id === currWriteLedger" class="flex">
    <div class="flex align-items-center mr-2">{{ $t('common.status') }}</div>
    <div class="flex align-items-center mr-1">
      <StatusChip :status="endorserConnection.state" />
    </div>
    <div v-if="canDeleteConnection" class="flex align-items-center">
      <Button title="Excluir Conexão" icon="pi pi-trash" class="p-button-rounded p-button-icon-only p-button-text"
        @click="deleteConnection($event, endorserConnection.connection_id)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import { useToast } from 'vue-toastification';
import { useConfirm } from 'primevue/useconfirm';
import { useConfigStore, useConnectionStore, useTenantStore } from '@/store';
import { storeToRefs } from 'pinia';
import StatusChip from '@/components/common/StatusChip.vue';
import { useReservationStore } from '@/store'; // Importe o store global

// Supondo que você esteja importando o store corretamente
const reservationStore = useReservationStore();
const reservationId = reservationStore.getReservationId();

const confirm = useConfirm();
const toast = useToast();

const configStore = useConfigStore();
const connectionStore = useConnectionStore();
const tenantStore = useTenantStore();
const { config } = storeToRefs(configStore);
const { endorserConnection, publicDid, tenantConfig, writeLedger } =
  storeToRefs(tenantStore);

const props = defineProps<{
  ledgerInfo: any;
}>();

const registerBlockchainEvent = async (data: any) => {
  try {
    // Corrigindo o walletHash para usar o da carteira atual
    const walletHash = reservationId ?? "unknown";
    data.asset.forEach((asset: any) => {
      asset.walletHash = reservationId ?? "unknown";
    });

    await axios.post('http://localhost:80/api/invoke/createAsset', data, {
      headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      },
    });
    toast.success('Evento registrado na Blockchain!');
  } catch (error) {
    toast.error(`Falha ao registrar o evento na Blockchain!: ${error}`);
  }
};

const connectToLedger = async (switchLeger = false) => {
  const prevLedgerId = writeLedger?.value?.ledger_id;
  try {
    const quickConnect =
      config.value.frontend.quickConnectEndorserName ===
      props.ledgerInfo.endorser_alias;
    await tenantStore.setWriteLedger(props.ledgerInfo.ledger_id);
    await connectToEndorser(quickConnect);
    if (quickConnect) {
      await registerPublicDid();
    }
    const event = {
      asset: [
        {
          "@assetType": "ssishEvent",
          // Corrigindo para usar o walletHash da carteira atual
          "walletHash": reservationId ?? "unknown",
          "eventType": "connect",
          "timestamp": new Date().toISOString(),
          "eventDetails": "Tentativa de conexão com o endossante",
        },
      ],
    };
    await registerBlockchainEvent(event);
  } catch (error) {
    if (prevLedgerId && switchLeger) {
      try {
        await tenantStore.setWriteLedger(prevLedgerId);
        await connectToEndorser();
      } catch (endorserError) {
        toast.error(`${endorserError}`);
      }
      toast.error(
        `${error}, revertendo para o ledger previamente configurado ${prevLedgerId}`
      );
    } else {
      toast.error(`${error}`);
    }
  }
};

const connectToEndorser = async (quickConnect = false) => {
  try {
    await tenantStore.connectToEndorser(quickConnect);
    toast.success('Solicitação de conexão ao endossante enviada');
  } catch (error) {
    throw Error(`Falha durante a conexão: ${error}`);
  }
};

const registerPublicDid = async () => {
  try {
    await tenantStore.registerPublicDid();
    toast.success('DID público - registro enviado');
  } catch (error) {
    throw Error(`Falha durante o registro: ${error}`);
  }
};

const currWriteLedger = computed(() => writeLedger?.value?.ledger_id ?? null);

const showEndorserConnect = computed(() => {
  if (!currWriteLedger.value || !endorserConnection.value) {
    return true;
  }
  if (
    !endorserConnection.value &&
    props.ledgerInfo.ledger_id === currWriteLedger.value
  ) {
    return true;
  }
  return false;
});

const showLedgerSwitch = computed(() => {
  if (
    tenantConfig.value.enable_ledger_switch &&
    props.ledgerInfo.ledger_id !== currWriteLedger.value
  ) {
    return true;
  }
  return false;
});

const switchLedger = (event: any) => {
  confirm.require({
    target: event.currentTarget,
    message:
      'Trocar pode ter consequências se você tiver emissões anteriores. \r\n Neste momento, funcionará apenas se o endossante para o qual você está trocando estiver configurado para autoaceitar e auto-endossar.',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      connectToLedger(true);
    },
  });
};

const hasPublicDid = computed(() => !!publicDid.value && !!publicDid.value.did);
const canDeleteConnection = computed(
  () => endorserConnection.value?.state !== 'active' || !hasPublicDid.value
);

const deleteConnection = (event: any, id: string) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Você tem certeza que deseja desconectar deste endossante?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      doDelete(id);
    },
  });
};
const doDelete = (id: string) => {
  connectionStore
    .deleteConnection(id)
    .then(() => {
      tenantStore.getEndorserConnection();
      toast.success(`Conexão com o endossante removida`);
    })
    .catch((err) => {
      console.error(err);
      toast.error(`Falha: ${err}`);
    });
};
</script>
