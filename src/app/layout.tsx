import LayoutProvider from "@/components/LayoutProvider";
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Car Rental" ,
  description: "ss",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {" "}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet"></link>
      </head>
      <body>
        <LayoutProvider>{children} </LayoutProvider>
      </body>
    </html>
  );
}
