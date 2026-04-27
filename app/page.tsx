import type { Metadata } from "next";
import FAQ from "@/components/Faqs";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar"; 
import Features from "@/components/Features"; 
import HowItWorks from "@/components/HowItWorks";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sabiskill - Learn Anything",
  description: "Your personal learning platform for continuous skill development",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
};

export default function Home() {
  return (
   <>
    <Navbar/>
    <Hero/>
    <Features/>
    <HowItWorks/>
    <Testimonial/>
    <FAQ/>
    <Footer/>
   </>
  );
}
