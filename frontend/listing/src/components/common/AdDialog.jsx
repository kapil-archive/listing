import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import React from 'react'
import AdManagerAd from './AdManagerAd'

const AD_UNIT_PATH = import.meta.env.VITE_GAM_AD_UNIT_PATH || '/6355419/Travel/Europe'

function AdDialog({ openAd, setOpenAd }) {
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
