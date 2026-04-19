import "./globals.css";
import { Toaster } from "react-hot-toast";

import PwaRegister from "./components/PwaRegister";
import InstallButton from "./components/InstallButton";
import PushButton from "./components/PushButton";

export const metadata = {
  title: "Vi~Lister",
  description: "Simple and fast to-do app",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">

        {/* ✅ PWA SERVICE WORKER */}
        <PwaRegister />

        {/* NAVBAR */}
        <nav className="bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-between">

          <h1 className="text-lg sm:text-xl font-bold text-blue-600">
            Vi~Lister
          </h1>

          <div className="flex items-center gap-2">

            {/* optional description */}
            <p className="hidden sm:block text-sm text-gray-600">
              Accomplish Your Goals in one Place
            </p>

            {/* ✅ INSTALL BUTTON */}
            <InstallButton />

            {/* 🔔 PUSH NOTIFICATION BUTTON */}
            <PushButton />

          </div>
        </nav>

        {/* MAIN APP */}
        <main className="flex-1">
          {children}
        </main>

        {/* TOAST */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white text-center py-4 mt-6">
          <p className="text-sm">
            © {new Date().getFullYear()} Vicotech. All rights reserved.
          </p>
        </footer>

      </body>
    </html>
  );
}