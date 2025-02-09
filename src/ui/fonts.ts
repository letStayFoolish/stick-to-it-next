import { Inter, Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["100", "300", "400", "500"], // 700 | 900
  subsets: ["latin"],
});

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({ subsets: ["latin"] });
