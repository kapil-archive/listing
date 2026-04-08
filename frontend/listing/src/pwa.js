import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New update available')
  },
  onOfflineReady() {
    console.log('App is ready offline')
  }
})