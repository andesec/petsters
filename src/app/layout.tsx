import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MainContent from "@/components/MainContent";

export const metadata: Metadata = {
  title: "Petsters",
  description: "Petsters Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" rel="stylesheet" />
      </head>
      <body>
        <div id="app">
          <Header />
          <div className="layout">
            <LeftSidebar />
            <MainContent>{children}</MainContent>
            <RightSidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
