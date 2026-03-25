import "./globals.css";

export const metadata = {
  title: "URL Shortener",
  description: "Create and manage short links locally",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
