import localFont from "next/font/local";

export const gladiator = localFont({
  src: [
    {
      path: "../../public/fonts/GladiatorArenaDemoRegular.ttf",
      weight: "400",
      style: "normal",
    },
    
  ],
  variable: "--font-gladiator",
  display: "swap",
});