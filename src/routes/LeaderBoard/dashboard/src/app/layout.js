;
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster, toast } from "sonner";
import NextAuthSessionProvider from "./provider/sessionProvider";
import { NavigationEvents } from "./useNProgress";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Driverse  Admin-dashboard",
  description: "Driverse app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >  
        <NavigationEvents/>
        <NextAuthSessionProvider>
        {children}
        <Toaster richColors position="top-right" />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
