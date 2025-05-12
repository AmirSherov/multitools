import type { Metadata } from "next";
import "./styles/globals.scss";

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
      <body>
        {children}
      </body>
    </html>
  );
}
