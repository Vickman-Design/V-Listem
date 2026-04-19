"use client";

import toast from "react-hot-toast";

export default function NotificationButton() {
  const enablePush = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      toast.success("Notifications enabled 🔔");
    } else {
      toast.error("Permission denied");
    }
  };

  return (
    <button
      onClick={enablePush}
      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
    >
      Enable Notifications
    </button>
  );
}