import { dev } from '$app/environment'
import { FeatureFlags } from "@freshmen68/flags"

export const flags = new FeatureFlags({
  enabledAll: dev,
})