import About from "@/components/about/About";
import BestSellers from "@/components/home/BestSellers";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <About />
    </main>
  );
}
