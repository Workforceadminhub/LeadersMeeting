import { useEffect, useState } from "react";

const OfflineBanner = () => {
  const [online, setOnline] = useState<boolean>(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-white text-center text-sm py-2 px-4 shadow"
    >
      You&rsquo;re offline — submissions will retry automatically when
      connection returns.
    </div>
  );
};

export default OfflineBanner;
