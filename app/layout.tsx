import {Providers} from "./components/providers";
import "./styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
export const metadata = {
  title: "CrowdfundMe",
  description: "A crowdfunding platform for web3 projects",
};
