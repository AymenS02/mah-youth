import { Nunito } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: "Ar Ribat Foundation",
  description: "A platform dedicated to educating muslims world-wide.",
  icons: {
    icon: "/favicon.png", // can also use .png or .svg
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
