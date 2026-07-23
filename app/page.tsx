import { ActCards } from "@/components/act-cards";
import { EngineBand } from "@/components/engine-band";
import { KineticHero } from "@/components/kinetic-hero";
import { MotionManifesto } from "@/components/motion-manifesto";
import { SignalWall } from "@/components/signal-wall";
import { StoryRail } from "@/components/story-rail";

export default function HomePage() {
  return (
    <main className="experience-shell">
      <KineticHero />
      <EngineBand />
      <MotionManifesto />
      <ActCards />
      <StoryRail />
      <SignalWall />
    </main>
  );
}
