import type { Metadata } from "next";
import { ExhibitionExperience } from "@/components/exhibition-experience";

export const metadata: Metadata = {
  title: "Exhibition Study",
  description:
    "Experimento de pagina high ticket com fundo continuo em movimento e direcao visual autoral."
};

export default function ExhibitionPage() {
  return <ExhibitionExperience />;
}
