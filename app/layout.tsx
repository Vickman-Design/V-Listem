import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Vicotech To Do List",
  description: "My first Next.js app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">

        <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold text-blue-600 cursor-pointer transition duration-300 hover:text-blue-800 hover:scale-105">
           V~Listem
          </h1>

          <p className="text-blue-600 font-medium">
           Accomplish your Goal in one place
          </p>

        </nav>

        <main className="flex-1">
          {children}
        </main>

        <Toaster position="top-right" reverseOrder={false} />

        <footer className="bg-gray-900 text-white text-center py-4 mt-6">
          <p className="text-sm">
            © {new Date().getFullYear()} Vicotech. All rights reserved.
          </p>
        </footer>

      </body>
    </html>
  );
}