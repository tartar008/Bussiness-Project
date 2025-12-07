import "./globals.css";
import { PluginProvider } from "@/plugins/plugin-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PluginProvider>{children}</PluginProvider>
      </body>
    </html>
  );
}
