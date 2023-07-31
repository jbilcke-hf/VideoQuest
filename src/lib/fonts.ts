import { Inter, Edu_SA_Beginner, Orbitron, Amatic_SC, Macondo_Swash_Caps, IM_Fell_English_SC } from "next/font/google"
import localFont from "next/font/local"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const edu = Edu_SA_Beginner({
  subsets: ["latin"],
  variable: "--font-edu",
})

export const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const amatic = Amatic_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-amatic"
})

export const macondo = Macondo_Swash_Caps({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-macondo"
})

export const imfell = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-imfell"
})

export const lugrasimo = localFont({
  src: "../fonts/Lugrasimo-Regular.woff2",
  variable: "--font-lugrasimo"
})

// https://fonts.google.com/specimen/Amatic+SC
// https://fonts.google.com/specimen/Orbitron
// https://fonts.google.com/specimen/Edu+SA+Beginner
// https://fonts.google.com/specimen/Tektur

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
// If loading a variable font, you don"t need to specify the font weight
export const fontList = [
  inter,
  edu,
  orbitron,
  amatic,
  macondo,
  lugrasimo,
]

export const classNames = fontList.map(font => font.className)

export const className = classNames.join(" ")

export type FontName = "font-inter" | "font-sans" | "font-edu" | "font-orbitron" | "font-amatic" | "font-macondo" | "font-lugrasimo"
