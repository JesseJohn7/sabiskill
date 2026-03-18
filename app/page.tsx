import FAQ from "@/components/Faqs";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar"; 
import Features from "@/components/Features"; 
import HowItWorks from "@/components/HowItWorks";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";
import WorldMapSection from "@/components/WorldMapSection";

export default function Home() {
  return (
   <>
    <Navbar/>
    <Hero/>
    <Features/>
    <HowItWorks/>
    <Testimonial/>
    <WorldMapSection/>
    <FAQ/>
    <Footer/>
   </>
  );
}
