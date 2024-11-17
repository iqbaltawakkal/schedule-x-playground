<template>
  <Calendar
    v-if="activated"
    :eventData="eventData"
    @create="console.log"
    @update="console.log"
    @delete="console.log"
  />
  <Alert componentName="Synergy calendar" v-else />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Calendar from './components/Calendar.vue'
import Alert from './components/Alert.vue'
const eventData = [
  {
    id: 1,
    start: '2024-09-28',
    end: '2024-10-28',
    title: 'this is title',
    description: 'this is description',
    calendarId: 'work',
    participants: ['Andre', 'Tony', 'Iqbal'],
  },
  {
    id: 2,
    start: '2024-10-29 08:00',
    end: '2024-10-29 10:00',
    title: 'hi again',
    description: 'this is description again',
    calendarId: 'school',
    participants: ['Andre', 'Tony', 'Iqbal'],
  },
  {
    id: 3,
    start: '2024-10-30 08:00',
    end: '2024-10-30 10:00',
    title: 'this is title 2',
    description: 'this is description 2',
    calendarId: 'leisure',
  },
  {
    id: 4,
    start: '2024-10-31 08:00',
    end: '2024-10-31 10:00',
    title: 'this is title again 2',
    description: 'this is description again 2',
    calendarId: 'personal',
  },
]
const activated = ref(false)
const licenseKey = ref('key')

watch(licenseKey, () => checkLicense(), { deep: true, immediate: true })

function checkLicense() {
  if (licenseKey.value) activated.value = true
  else activated.value = false
}
</script>
