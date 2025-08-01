// layout.tsx
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdVersionProvider } from "../context/AntdVersionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ant Form Builder",
  description: "Generate beautiful forms from natural language prompts",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdVersionProvider>
          <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
            {children}
          </ConfigProvider>
        </AntdVersionProvider>
      </body>
    </html>
  );
}
