import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PM Tracker — Project health at a glance",
    template: "%s · PM Tracker",
  },
  description:
    "A fast, clear view of project status for project managers — tasks, deliverables, risks, and issues with AI-scored insights and summaries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
