import type { Metadata } from "next";
import "./styles/globals.scss";
import { GlobalContextProvider } from "./context/GlobalContext";

export const metadata: Metadata = {
  title: "MultiTools - Мощные инструменты для обработки данных",
  description: "Платформа MultiTools предлагает набор инструментов для обработки изображений, конвертации файлов и AI-сервисы для упрощения вашей работы",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <link rel="icon" href="./logo.png" />
      <body>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  );
}
