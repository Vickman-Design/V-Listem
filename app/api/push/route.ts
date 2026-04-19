import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:test@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscriptions: any[] = [];

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

  const payload = JSON.stringify({ title, message });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload)
    )
  );

  return Response.json({ success: true, results });
}