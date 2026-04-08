import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (!deferredPrompt) return null

  return <Button variant="outlined" onClick={install}>Install App</Button>
}

export default InstallPWA