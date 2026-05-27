import type { Metadata } from "next"
import { Anton, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "MemeForge — Crea meme per ogni social, in un click",
  description:
    "Editor drag-and-drop, esportazione simultanea per Instagram, TikTok, LinkedIn, X e Facebook. Costruito con Cursor + Pencil.dev.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  )
}
