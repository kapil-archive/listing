import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import React from 'react'
import AdManagerAd from './AdManagerAd'

function AdDialog({ openAd, setOpenAd }) {
    return (
        <Dialog open={openAd.active} onClose={(event, reason) => {
            if (reason === "backdropClick") {
                setOpenAd({ imageId: null, active: false }); // close ad
            }
        }}>
            <DialogContent>
                <AdManagerAd
                    adUnitPath="/6355419/Travel/Europe"
                    sizes={[[300, 250]]}
                    divId="download-ad-slot"
                />
            </DialogContent>
        </Dialog>
    )
}

export default AdDialog
