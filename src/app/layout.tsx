import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Roboto, Bebas_Neue } from "next/font/google";
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto",
});
const bebasNeue = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas",
});
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};
export const metadata: Metadata = {
    title: "VITMUN'26 | Model United Nations",
    description: `Charting peace on a steady course. Through every voice, a path refined, Where silence speaks, and fears are shed. A handshake seals what hearts convey, Uniting minds where tensions lay.`,
    keywords: [
        "VITMUN",
        "Model United Nations",
        "VIT",
        "Debate",
        "Networking",
        "MUN",
        "Vellore Institute of Technology",
    ],
    metadataBase: new URL("https://vitmun.vit.ac.in"),
    authors: [{ name: "VITMUN Team", url: "https://vitmun.vit.ac.in" }],
    openGraph: {
        title: "VITMUN'26 | Model United Nations",
        description:
            "Charting peace on a steady course. Through every voice, a path refined, Where silence speaks, and fears are shed. A handshake seals what hearts convey, Uniting minds where tensions lay.",
        url: "https://vitmun.vit.ac.in",
        siteName: "VITMUN'26",
        images: [
            {
                url: "https://vitmun.vit.ac.in/poster.png",
                width: 600,
                height: 600,
                alt: "VITMUN'26 Team Poster",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "VITMUN'26 | Model United Nations",
        description: "Where your voice matters. Join the debate!",
        images: ["/team.png"],
    },
};
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`${roboto.variable} ${bebasNeue.variable}`}>
            <body>
                {children}
                <Toaster />
            </body>
        </html>
    );
}