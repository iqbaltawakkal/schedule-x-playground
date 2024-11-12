import { createApp } from 'vue'
import './style.css'
import '@fontsource/open-sans'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/500-italic.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/700-italic.css'
import App from './App.vue'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {
  VDialog,
  VBtn,
  VSelect,
  VCard,
  VCardText,
  VCardActions,
  VForm,
  VTextField,
  VCombobox,
  VCheckbox,
  VListItemTitle,
  VListItem,
  VChip,
} from 'vuetify/components'
import { Ripple } from 'vuetify/directives'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components: {
    VDialog,
    VBtn,
    VSelect,
    VCard,
    VCardText,
    VCardActions,
    VForm,
    VTextField,
    VCombobox,
    VListItemTitle,
    VListItem,
    VChip,
    VCheckbox,
  },
  directives: { Ripple },
})

createApp(App).use(vuetify).mount('#app')
