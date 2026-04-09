import { useEffect, useRef } from "react";

const AdManagerAd = ({ adUnitPath, sizes, divId }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!window.googletag) return;

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      const slot = window.googletag
        .defineSlot(adUnitPath, sizes, divId)
        .addService(window.googletag.pubads());

      // Optional: enable single request mode
      window.googletag.pubads().enableSingleRequest();

      // Enable services
      window.googletag.enableServices();

      // Display ad
      window.googletag.display(divId);

      // 🔥 Example callback
      window.googletag.pubads().addEventListener("slotRenderEnded", (event) => {
        if (event.slot === slot) {
          console.log("Ad rendered:", event);
        }
      });
    });

    return () => {
      // 🧹 Cleanup (VERY IMPORTANT in React)
      if (window.googletag && window.googletag.destroySlots) {
        window.googletag.destroySlots();
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