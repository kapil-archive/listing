import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import React from 'react'
import AdManagerAd from './AdManagerAd'

const PROD_AD_UNIT_PATH = import.meta.env.VITE_GAM_AD_UNIT_PATH
const DEV_TEST_AD_UNIT_PATH = import.meta.env.VITE_GAM_TEST_AD_UNIT_PATH || '/6355419/Travel/Europe'
const AD_UNIT_PATH = import.meta.env.PROD ? PROD_AD_UNIT_PATH : (PROD_AD_UNIT_PATH || DEV_TEST_AD_UNIT_PATH)

function AdDialog({ openAd, setOpenAd }) {
    if (!AD_UNIT_PATH) {
        console.error('Missing VITE_GAM_AD_UNIT_PATH. Configure a live Google Ad Manager ad unit path for production builds.')
        return null
    }

    return (
        <Dialog open={openAd.active} onClose={(event, reason) => {
            if (reason === "backdropClick") {
                setOpenAd({ imageId: null, active: false }); // close ad
            }
        }}>
            <DialogContent>
                <AdManagerAd
                    adUnitPath={AD_UNIT_PATH}
                    sizes={[[300, 250]]}
                    divId="download-ad-slot"
                />
            </DialogContent>
        </Dialog>
    )
}

export default AdDialog
