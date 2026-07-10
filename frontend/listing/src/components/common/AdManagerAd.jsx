import { useEffect, useRef } from "react";

const AdManagerAd = ({ adUnitPath, sizes, divId }) => {
  const adRef = useRef(null);
  const slotRef = useRef(null);
  const listenerRef = useRef(null);

  useEffect(() => {
    if (!adUnitPath || !divId || !Array.isArray(sizes) || sizes.length === 0) {
      return undefined;
    }

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      if (!document.getElementById(divId)) {
        return;
      }

      // Cleanup any stale slot using the same container id before redefining.
      const existingSlot = window.googletag
        .pubads()
        .getSlots()
        .find((s) => s.getSlotElementId() === divId);

      if (existingSlot) {
        window.googletag.destroySlots([existingSlot]);
      }

      const slot = window.googletag.defineSlot(adUnitPath, sizes, divId);
      if (!slot) {
        return;
      }

      slot.addService(window.googletag.pubads());
      slotRef.current = slot;

      // Optional: enable single request mode
      window.googletag.pubads().enableSingleRequest();

      // Enable services
      window.googletag.enableServices();

      // Display ad
      window.googletag.display(divId);

      const onSlotRenderEnded = (event) => {
        if (event.slot === slot) {
          console.log("Ad rendered:", event);
        }
      };

      listenerRef.current = onSlotRenderEnded;
      window.googletag.pubads().addEventListener("slotRenderEnded", onSlotRenderEnded);
    });

    return () => {
      if (window.googletag?.cmd) {
        window.googletag.cmd.push(() => {
          if (listenerRef.current) {
            window.googletag.pubads().removeEventListener("slotRenderEnded", listenerRef.current);
            listenerRef.current = null;
          }

          if (slotRef.current) {
            window.googletag.destroySlots([slotRef.current]);
            slotRef.current = null;
          }
        });
      }
    };
  }, [adUnitPath, sizes, divId]);

  return (
    <div
      id={divId}
      ref={adRef}
      style={{ width: sizes[0][0], height: sizes[0][1] }}
    />
  );
};

export default AdManagerAd;