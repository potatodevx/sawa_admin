import type { Metadata } from "next";
import "./globals.css";
import { AdminDataProvider } from "./providers/AdminDataProvider";
import { ToastProvider } from "./components/Toast";

export const metadata: Metadata = {
  title: "SAWA Admin Console",
  description:
    "Premium administrative portal for SAWA. Manage chat prompts, user communities, reports, and connections with complete security and ease.",
  metadataBase: new URL("https://sawa-app-admin.vercel.app"),
  openGraph: {
    title: "SAWA Admin Console",
    description: "Secure management portal for the SAWA mobile ecosystem.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SAWA Admin Interface",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAWA Admin Console",
    description: "Secure management portal for the SAWA mobile ecosystem.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" />
      </head>
      <body>
        <ToastProvider>
          <AdminDataProvider>{children}</AdminDataProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
