"use client";

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export function AppToaster() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <Toaster
      richColors
      position={isDesktop ? "bottom-right" : "top-center"}
      offset={isDesktop ? 12 : 8}
      className="z-[9999] pointer-events-none [&>div]:pointer-events-auto !top-2 sm:!top-4 lg:!top-auto lg:!bottom-4 lg:!right-4"
      toastOptions={{
        classNames: {
          toast: "rounded-lg px-3 py-2 sm:px-3.5 sm:py-2.5 text-sm sm:text-base",
          title: "text-sm sm:text-base font-medium",
          description: "text-xs sm:text-sm opacity-90",
          actionButton: "text-xs sm:text-sm px-2.5 py-1.5",
          cancelButton: "text-xs sm:text-sm px-2.5 py-1.5",
        },
      }}
    />
  );
}


