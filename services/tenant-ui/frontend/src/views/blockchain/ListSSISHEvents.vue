<template>
    <div class="list-ssish-events">
        <h1>Eventos SSISH</h1>
        <div v-if="events.length > 0">
            <div v-for="event in events" :key="event['@key']" class="event-card">
                <h2>{{ event.eventType }}</h2>
                <p><strong>Detalhes do Evento:</strong> {{ event.eventDetails }}</p>
                <p><strong>Data:</strong> {{ formatTimestamp(event.timestamp) }}</p>
                <p><strong>Atualizado por:</strong> {{ event['@lastTouchBy'] }}</p>
                <p><strong>Última Transação:</strong> {{ event['@lastTx'] }}</p>
                <p><strong>Última Atualização:</strong> {{ formatTimestamp(event['@lastUpdated']) }}</p>
                <p><strong>Hash da Carteira:</strong> {{ event.walletHash }}</p>
            </div>
            <Paginator :first="first" :rows="rows" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]"
                @page="onPageChange" />
        </div>
        <div v-else>
            <p>Nenhum evento encontrado.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios, { AxiosResponse } from 'axios';
import Paginator from 'primevue/paginator';

const events = ref<any[]>([]);
const totalRecords = ref<number>(0);
const first = ref<number>(0);
const rows = ref<number>(10);
const bookmark = ref<string>('');

const loadEvents = async (bookmark: { value: string }, rows = 10) => {
    try {
        const response: AxiosResponse<any> = await axios.post('http://localhost:80/api/query/search', {
            query: {
                selector: {
                    "@assetType": "ssishEvent"
                },
                limit: rows + 1,
                bookmark: bookmark.value
            },
            resolve: true
        });

        const eventsData = response.data.result;
        totalRecords.value = response.data.metadata.fetched_records_count;
        events.value = eventsData.slice(0, rows); // Limitar ao número de linhas por página
        bookmark.value = response.data.metadata.bookmark;
    } catch (error) {
        console.error(error);
    }
};

const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
};

const onPageChange = (event: any) => {
    first.value = event.page * event.rows;
    rows.value = event.rows;
    loadEvents(bookmark, rows.value);
};

onMounted(() => {
    loadEvents(bookmark);
});
</script>

<style scoped>
.list-ssish-events {
    padding: 20px;
}

.event-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.event-card h2 {
    margin-top: 0;
}
</style>
