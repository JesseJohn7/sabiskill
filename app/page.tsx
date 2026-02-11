import FAQ from "@/components/Faqs";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar"; 
import Features from "@/components/Features"; 
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
   <>
    <Navbar/>
    <Hero/>
    <Features/>
    <HowItWorks/>
    <FAQ/>
   </>
  );
}
