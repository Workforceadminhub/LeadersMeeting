import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

const UpdatePrompt = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<(reload?: boolean) => Promise<void>>(
    () => async () => {}
  );

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {},
    });
    setUpdateSW(() => update);
  }, []);

  if (!needRefresh) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 md:left-auto md:w-96 z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex items-center gap-3"
    >
      <div className="flex-1 text-sm text-gray-800">
        A new version is available.
      </div>
      <button
        onClick={() => updateSW(true)}
        className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Update
      </button>
    </div>
  );
};

export default UpdatePrompt;
