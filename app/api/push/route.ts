import webpush from "web-push";

let subscriptions: any[] = [];

// ✅ helper to safely initialize VAPID (runtime only)
function initWebPush() {
  if (
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
  ) {
    throw new Error("Missing VAPID keys");
  }

  webpush.setVapidDetails(
    "mailto:test@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(req: Request) {
  const sub = await req.json();

  // prevent duplicates
  const exists = subscriptions.find(
    (s) => JSON.stringify(s) === JSON.stringify(sub)
  );

  if (!exists) {
    subscriptions.push(sub);
  }

  return Response.json({ success: true });
}

export async function PUT(req: Request) {
  const { title, message } = await req.json();

  // ✅ initialize here (NOT at top level)
  initWebPush();

  const payload = JSON.stringify({ title, message });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload)
    )
  );

  return Response.json({ success: true, results });
}