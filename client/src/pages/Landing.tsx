import AetherFlowHero from "../components/ui/aether-flow-hero";
import { PageTransition } from "../components/layout/PageTransition";

export function LandingPage() {
  return (
    <PageTransition>
      <main className="App min-h-screen bg-black">
        <AetherFlowHero />
      </main>
    </PageTransition>
  );
}

