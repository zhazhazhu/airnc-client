<script setup lang="ts">
import { appName } from '~/constants'

interface Data {
  id: string
  ip: string
  link: string
  websocket_key: string
}

const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'ip',
  label: 'IP',
}, {
  key: 'websocket_key',
  label: 'WebsocketKey',
}, {
  key: 'link',
  label: 'Link',
}]

useHead({
  title: appName,
})

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
const search = ref('')
const tableData = ref<Data[]>([])
const runtimeConfig = useRuntimeConfig()
const { copy, copied } = useClipboard()

async function onSearch() {
  const data = await $fetch('/api/client', { method: 'GET', baseURL: runtimeConfig.public.remote_host, query: { search: search.value } }) as Data[]
  tableData.value = data
}

onMounted(() => {
  onSearch()
})
</script>

<template>
  <UContainer>
    <div class="h-60px flex items-center">
      <div flex-1>
        <div class="flex items-end">
          <div i-material-symbols-bigtop-updates-rounded class="text-xl font-bold" />
          <span class="ml-2 text-1.6rem lh-30px tracking-wide">Airnc</span>
        </div>
      </div>
      <div class="float-end">
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />

          <template #fallback>
            <div class="h-8 w-8" />
          </template>
        </ClientOnly>
      </div>
    </div>

    <div class="md:mx-100px sm:mx-20px md:mt-100px sm:mt-20px">
      <UInput
        v-model="search"
        name="search"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        size="xl"
        @blur="() => onSearch()"
        @keydown.enter="() => onSearch()"
      >
        <template #trailing>
          <UButton
            v-show="search !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="search = ''"
          />
        </template>
      </UInput>

      <UTable :columns="columns" :rows="tableData" class="mt-30px">
        <template #link-data="{ row }">
          <div class="flex items-center">
            <ULink
              :to="row.link"
              target="_blank"
              active-class="text-primary"
              inactive-class="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-200"
            >
              {{ row.link }}
            </ULink>
            <div :class="!copied ? 'i-mingcute-copy-2-fill' : 'i-lucide-copy-check'" class="ml-6px w-14px cursor-pointer hover:color-gray hover:dark:color-white" @click="copy(row.link)" />
          </div>
        </template>
      </UTable>
    </div>
  </UContainer>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #111;
  color: white;
}
</style>
