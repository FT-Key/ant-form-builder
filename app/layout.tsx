// layout.tsx
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ant Form Builder",
  description: "Generate beautiful forms from natural language prompts",
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
        <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
