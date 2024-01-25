<script setup lang="ts">
import { appName } from '~/constants'
import { UInput } from '#components'

const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'ip',
  label: 'IP',
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
const route = useRoute()
const router = useRouter()
const search = ref(route.query?.search as string || '')
const { copy, copied } = useClipboard()
const { data, refresh, pending } = useFetch('/api/client', { query: { search }, watch: false })
const inputInstance = ref<InstanceType<typeof UInput>>()

function onSearch() {
  !search.value ? router.push('/') : router.push(`/?search=${search.value}`)
  const el = inputInstance.value?.input
  el && el.blur()
  refresh()
}
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
        <UButton
          icon="i-mdi-github"
          color="gray"
          variant="ghost"
          aria-label="Theme"
          class="ml-6px"
          @click="navigateTo('https://github.com/zhazhazhu/airnc', {
            external: true,
            open: {
              target: '_blank',
            },
          })"
        />
      </div>
    </div>

    <div class="mt-20px md:mx-100px sm:mx-20px md:mt-80px">
      <UInput
        ref="inputInstance"
        v-model="search"
        name="search"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        size="xl"
        @change="onSearch"
      >
        <template #trailing>
          <UButton
            v-show="search !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="() => {
              search = ''
              onSearch()
            }"
          />
        </template>
      </UInput>

      <UTable :columns="columns" :rows="data || []" class="mt-30px" :loading="pending">
        <template #quantity-data="{ row }">
          {{ row.quantity.value }}
        </template>
        <template #link-data="{ row }">
          <div class="group flex items-center">
            <ULink
              :to="row.link"
              target="_blank"
              active-class="text-primary"
              inactive-class="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-200"
              download
            >
              {{ row.link }}
            </ULink>

            <div :class="!copied ? 'i-mingcute-copy-2-fill' : 'i-lucide-copy-check'" class="ml-6px w-14px cursor-pointer opacity-0 transition-opacity duration-500 hover:color-gray group-hover:opacity-100 hover:dark:color-white" @click="copy(row.link)" />
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
