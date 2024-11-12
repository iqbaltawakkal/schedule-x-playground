<template>
  <ScheduleXCalendar :calendar-app="calendarApp">
    <template #dateGridEvent="{ calendarEvent }">
      <div :style="getEventStyles(calendarEvent.calendarId)">
        <div class="title">{{ calendarEvent.title }}</div>
      </div>
    </template>

    <template #timeGridEvent="{ calendarEvent }">
      <div :style="getEventStyles(calendarEvent.calendarId)">
        <div class="title">{{ calendarEvent.title }}</div>
        <div class="flex items-center gap-1">
          <Clock :size="12" />
          {{
            `${calendarEvent.start.substring(
              calendarEvent.start.length - 5
            )} - ${calendarEvent.end.substring(calendarEvent.end.length - 5)}`
          }}
        </div>
        <div
          v-if="calendarEvent.participants && calendarEvent.participants.length"
          class="flex items-center gap-1 participants"
        >
          <UsersRound :size="12" /> {{ calendarEvent.participants?.join(', ') }}
        </div>
      </div>
    </template>

    <template #monthGridEvent="{ calendarEvent }">
      <div :style="getEventStyles(calendarEvent.calendarId)">
        <div class="title">{{ calendarEvent.title }}</div>
      </div>
    </template>

    <template #eventModal="{ calendarEvent }">
      <div class="event-modal">
        <div class="flex justify-between items-center">
          <div class="title">{{ calendarEvent.title }}</div>
          <div class="flex items-center gap-3">
            <button @click="onShowModalForm(calendarEvent)">
              <Pencil :size="18" />
            </button>
            <button @click="confirmDelete(calendarEvent)">
              <Trash2 :size="18" />
            </button>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Clock :size="12" />
          {{
            calendarEvent.length > 11
              ? `${calendarEvent.start.substring(
                  calendarEvent.start.length - 5
                )} - ${calendarEvent.end.substring(
                  calendarEvent.end.length - 5
                )}`
              : new Date(calendarEvent.start).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
          }}
        </div>
        <div
          v-if="calendarEvent.participants && calendarEvent.participants.length"
          class="flex items-center gap-1"
        >
          <UsersRound :size="12" /> {{ calendarEvent.participants?.join(', ') }}
        </div>

        <div class="description">{{ calendarEvent.description }}</div>
      </div>
    </template>

    <template #headerContentLeftPrepend>
      <button
        class="event-button sx__ripple"
        @click="onShowModalForm(null)"
        :style="`min-width: 180px;`"
      >
        Add event
      </button>
    </template>
  </ScheduleXCalendar>

  <v-dialog v-model="isModalConfirm" width="auto">
    <v-card
      max-width="400"
      text="Are you sure you want to delete this event? This action cannot be undone."
      title="Delete event"
    >
      <template v-slot:actions>
        <v-btn text="Cancel" @click="isModalConfirm = false"></v-btn>
        <v-btn
          variant="flat"
          text="Delete"
          color="red-darken-3"
          @click="deleteEvent"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isModalForm" width="auto">
    <v-card width="700px" :title="isEdit ? 'Edit event' : 'Create event'">
      <v-card-text>
        <v-form ref="modalForm" @submit.prevent class="flex flex-col gap-2">
          <v-text-field
            density="comfortable"
            label="Event name"
            variant="outlined"
            persistent-placeholder
            required
            :rules="[(v) => !!v || 'This field is required']"
            v-model="selectedEvent.title"
          ></v-text-field>
          <v-text-field
            density="comfortable"
            label="Description"
            variant="outlined"
            persistent-placeholder
            required
            :rules="[(v) => !!v || 'This field is required']"
            v-model="selectedEvent.description"
          ></v-text-field>
          <div class="flex items-center gap-2">
            <v-text-field
              density="comfortable"
              type="date"
              label="Start date"
              variant="outlined"
              required
              v-model="selectedEvent.startDate"
            ></v-text-field>
            <v-text-field
              v-if="!selectedEvent.isFullDay"
              density="comfortable"
              type="time"
              variant="outlined"
              required
              v-model="selectedEvent.startTime"
            ></v-text-field>
            <div class="mb-5">-</div>
            <v-text-field
              density="comfortable"
              type="date"
              label="Start date"
              variant="outlined"
              required
              v-model="selectedEvent.endDate"
            ></v-text-field>
            <v-text-field
              v-if="!selectedEvent.isFullDay"
              density="comfortable"
              type="time"
              variant="outlined"
              required
              v-model="selectedEvent.endTime"
            ></v-text-field>
          </div>
          <v-checkbox
            v-model="selectedEvent.isFullDay"
            density="comfortable"
            label="Full-day event"
          ></v-checkbox>
          <div class="flex gap-2">
            <div class="w-50">
              <v-select
                density="comfortable"
                label="Frequency"
                :items="['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly']"
                variant="outlined"
                v-model="selectedEvent.frequency"
              ></v-select>
            </div>
            <div class="w-50">
              <v-text-field
                density="comfortable"
                type="date"
                label="Until"
                variant="outlined"
                required
                v-model="selectedEvent.until"
              ></v-text-field>
            </div>
          </div>
          <v-select
            density="comfortable"
            label="Type"
            :items="calendarTypes"
            variant="outlined"
            v-model="selectedEvent.calendarId"
          >
            <template v-slot:selection="{ item }">
              <div class="flex items-center gap-2">
                <Square :fill="item.raw.color" :strokeWidth="1" />
                {{ item.title }}
              </div>
            </template>
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props" :title="''">
                <v-list-item-title>
                  <div class="flex items-center gap-2">
                    <Square :fill="item.raw.color" :strokeWidth="1" />
                    {{ item.title }}
                  </div>
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
          <v-combobox
            chips
            density="comfortable"
            multiple
            label="Participants"
            persistent-placeholder
            placeholder="Type and enter to add participant"
            variant="outlined"
            v-model="selectedEvent.participants"
          ></v-combobox>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-4">
        <v-btn
          text="Cancel"
          :style="`min-width: 100px;`"
          rounded="xl"
          @click="isModalForm = false"
        ></v-btn>
        <v-btn
          :style="`min-width: 120px;`"
          rounded="xl"
          variant="flat"
          text="Save"
          class="event-button"
          @click="saveEvent"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
  viewDay,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import {
  createEventRecurrencePlugin,
  createEventsServicePlugin,
} from '@schedule-x/event-recurrence'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { calendars } from './calendars.js'
import { ref, shallowRef } from 'vue'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { Clock, Trash2, Pencil, Square, UsersRound } from 'lucide-vue-next'
import { addHours, format } from 'date-fns'

const props = defineProps({
  eventData: {
    type: [Array, String],
    default: () => [],
  },
})

const emit = defineEmits(['update', 'create', 'delete'])

/* calendar script */
const eventsService = createEventsServicePlugin()
const calendarControls = createCalendarControlsPlugin()
const eventModal = createEventModalPlugin()

const calendarApp = shallowRef(
  createCalendar({
    locale: 'en-US',
    views: [viewMonthAgenda, viewMonthGrid, viewWeek, viewDay],
    defaultView: viewWeek.name,
    calendars: calendars,
    plugins: [
      eventModal,
      createDragAndDropPlugin(),
      createScrollControllerPlugin({
        initialScroll: '07:00',
      }),
      createEventRecurrencePlugin(),
      eventsService,
      calendarControls,
    ],
    events: props.eventData,
    monthGridOptions: {
      nEventsPerDay: 3,
    },
    callbacks: {
      onClickDate(date) {
        calendarControls.setView(viewWeek.name)
        calendarControls.setDate(date)
      },
    },
  })
)

const closeModalEvent = () => {
  eventModal.close()
}

function getEventStyles(id) {
  return {
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    padding: '0 4px',
    backgroundColor: `var(--sx-color-${id}-container)`,
    color: `var(--sx-color-on-${id}-container)`,
    borderTop: `0px`,
    borderRight: `0px`,
    borderBottom: `0px`,
    borderLeft: `4px solid var(--sx-color-${id})`,
  }
}
/* end of calendar script */

const calendarTypes = [
  { title: 'Work', value: 'work', color: '#ffd2dc' },
  { title: 'School', value: 'school', color: '#dafff0' },
  { title: 'Leisure', value: 'leisure', color: '#d2e7ff' },
  { title: 'Personal', value: 'personal', color: '#fff5de' },
]

const isModalConfirm = ref(false)
const selectedEvent = ref()
function confirmDelete(calendarEvent) {
  selectedEvent.value = calendarEvent
  isModalConfirm.value = true
}

function deleteEvent() {
  eventsService.remove(selectedEvent.value.id)
  emit('delete', selectedEvent.value)
  isModalConfirm.value = false
  closeModalEvent()
}

const isModalForm = ref(false)
const isEdit = ref(false)
function onShowModalForm(calendarEvent = null) {
  console.log(calendarEvent)
  isEdit.value = !!calendarEvent
  selectedEvent.value = calendarEvent
    ? preProcessBeforeEdit(calendarEvent)
    : getDefaultCalendarEventData()
  isModalForm.value = true
}

function getDefaultCalendarEventData() {
  const startDate = format(new Date(), 'yyyy-MM-dd')
  const startTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const endDate = format(addHours(new Date(), 1), 'yyyy-MM-dd')
  const endTime = addHours(new Date(), 1).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return {
    id: null,
    start: '',
    end: '',
    startDate,
    endDate,
    startTime,
    endTime,
    title: '',
    description: '',
    calendarId: 'personal',
    participants: [],
    isFullDay: false,
    frequency: 'Once',
    until: endDate,
  }
}

function preProcessBeforeEdit(calendarEvent) {
  const ruleParts = calendarEvent.rrule
    ? calendarEvent.rrule.split(';').reduce((acc, part) => {
        const [key, value] = part.split('=')
        acc[key] = value
        return acc
      }, {})
    : {}
  const isFullDay = calendarEvent.start.length < 11
  const startDate = calendarEvent.start.split(' ')[0]
  const startTime = isFullDay ? null : calendarEvent.start.split(' ')[1]
  const endDate = calendarEvent.end.split(' ')[0]
  const endTime = isFullDay ? null : calendarEvent.end.split(' ')[1]
  const frequency = ruleParts['FREQ']
    ? ruleParts['FREQ'].charAt(0) + ruleParts['FREQ'].slice(1).toLowerCase()
    : 'Once'
  const until = ruleParts['UNTIL']
    ? ruleParts['UNTIL']
        .split('T')[0]
        .replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    : endDate
  return {
    ...calendarEvent,
    isFullDay,
    startDate,
    startTime,
    endDate,
    endTime,
    frequency,
    until,
  }
}

function preProcessBeforeSubmit() {
  return {
    ...selectedEvent.value,
    start: selectedEvent.value.isFullDay
      ? selectedEvent.value.startDate
      : `${selectedEvent.value.startDate} ${selectedEvent.value.startTime}`,
    end: selectedEvent.value.isFullDay
      ? selectedEvent.value.endDate
      : `${selectedEvent.value.endDate} ${selectedEvent.value.endTime}`,
    rrule: generateRrule(selectedEvent.value),
  }
}

function generateRrule({ frequency, until }) {
  if (frequency === 'Once') return undefined
  return `FREQ=${frequency.toUpperCase()};UNTIL=${format(
    until,
    'yyyyMMdd'
  )}T235959`
}

const modalForm = ref(null)
async function saveEvent() {
  const { valid } = await modalForm.value.validate()
  if (!valid) return
  const data = preProcessBeforeSubmit()
  if (isEdit) {
    eventsService.update(data)
    emit('update', data)
  } else {
    eventsService.add(data)
    emit('create', data)
  }
  isModalForm.value = false
}
</script>

<style lang="scss">
.event-modal {
  position: relative;
  background-color: white;
  border-radius: 6px;
  padding: 16px;
  box-shadow:
    0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12),
    0 11px 15px -7px rgba(0, 0, 0, 0.2);
  max-height: 250px;
  overflow-y: scroll;
  font-size: 14px;
  color: #333333;
}

.title {
  font-weight: 600;
}

.description {
  margin-top: 20px;
}

.event-button {
  padding: var(--sx-spacing-padding3) var(--sx-spacing-padding4);
  border-radius: var(--sx-rounding-extra-large);
  font-size: var(--sx-calendar-header-input-font-size);
  color: var(--sx-color-on-primary) !important;
  border: var(--sx-border) !important;
  border-color: var(--sx-color-primary) !important;
  background-color: var(--sx-color-primary) !important;
  margin-right: 20px;
  font-weight: 600;
  display: flex;
  justify-content: center;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 9999px;
}

// vuetify override start here

.v-card-title {
  font-weight: 600 !important;
}

.v-btn {
  text-transform: capitalize !important;
}

.v-selection-control__input {
  color: var(--sx-color-primary) !important;
}

input[type='date'].v-field__input {
  display: block;
  line-height: normal;
}
</style>
