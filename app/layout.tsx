import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorGrid - Content Creator Productivity',
  description: 'Streamline your content creation workflow with brain dumping, project management, and calendar scheduling tools.',
  keywords: ['content creation', 'productivity', 'project management', 'brain dump', 'calendar'],
  authors: [{ name: 'CreatorGrid Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
