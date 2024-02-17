import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster"
import MetaMaskProviderWrapper from "@/components/MetaMaskProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className="bg-[#F4F4F5]">
          <div className="px-3 py-2 md:py-3 lg:px-0 lg:max-w-screen-xl mx-auto">
              <MetaMaskProviderWrapper>
                <NavBar />
                <div className='mt-[5rem]'>{" "}</div>
                {children}
                <Toaster />
              </MetaMaskProviderWrapper>
          </div>
        </body>
    </html>
  );
}
