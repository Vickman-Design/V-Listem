"use client";

export default function PushButton() {
  const subscribe = async () => {
    if (!("serviceWorker" in navigator)) return;

    const reg = await navigator.serviceWorker.ready;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });

    alert("Push Enabled!");
  };

  const sendTestPush = async () => {
    await fetch("/api/push", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Vi~Lister Test 🔔",
        message: "Push is working!",
      }),
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={subscribe}
        className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg"
      >
        Enable Push
      </button>

      <button
        onClick={sendTestPush}
        className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg"
      >
        Test Push
      </button>
    </div>
  );
}

// helper
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}