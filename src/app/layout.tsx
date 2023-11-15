import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "./clientLayout";
import classNames from "classnames";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Fall in Life",
  description: "Wz's website",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={classNames(inter.className, "flex flex-col min-h-screen")}
      >
        <ClientLayout>{children}</ClientLayout>
        <footer className="ml-auto mt-auto text-[16px] leading-none pr-2">
          © fallinlife.com {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
