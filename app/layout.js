export const metadata = {
  title: 'Handld Home TuneUp',
  description: 'Home Safety & Wellness Check',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #FBF7F0;
            color: #1a2332;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
