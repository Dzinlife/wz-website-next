import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import classNames from "classnames";
import { Inter } from "next/font/google";
import Link from "next/link";

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
        <div className="opacity-0 h-0 overflow-hidden">
          <Link href="/" prefetch={true}>
            About
          </Link>
          <Link href="/works" prefetch={true}>
            Works
          </Link>
          <Link href="/contact" prefetch={true}>
            Contact
          </Link>
        </div>
        <ClientLayout>{children}</ClientLayout>
        <footer className="ml-auto mt-auto text-[15px] leading-none pr-3 pb-1">
          © {new Date().getFullYear()} fallinlife.com
        </footer>
      </body>
    </html>
  );
}
