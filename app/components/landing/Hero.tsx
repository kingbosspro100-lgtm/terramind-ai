import Container from "../ui/Container";
import HeroBackgroundSlider from "./HeroBackgroundSlider";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pb-24 pt-28 sm:pt-32">
      <HeroBackgroundSlider />
      {/* Dark overlay to ensure text is readable while keeping images very visible */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-950/60" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl">
          <HeroContent />

        </div>
      </Container>
    </section>
  );
}
