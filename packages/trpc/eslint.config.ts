import { defineConfig, getConfig } from '@freshmen68/eslint-config'

const config = getConfig(import.meta.url)

export default defineConfig([...config])
