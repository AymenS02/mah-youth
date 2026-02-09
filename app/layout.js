import { Nunito } from "next/font/google";
import "./globals.css";
import QueryProvider from "/lib/providers/QueryProvider";

const nunitoSans = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: "MAH Youth",
  description: "A platform dedicated to educating muslims world-wide.",
  icons: {
    icon: "/logo.png", // can also use .png or .svg
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
