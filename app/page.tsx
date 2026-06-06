import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import HowItWorks from "@/components/HowItWorks";
import Products from "@/components/Products";
import FarmerSection from "@/components/FarmerSection";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

import { getSessionUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getSessionUser();

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1">
        <Hero user={user} />
        <Marquee />
        <HowItWorks />
        <Products />
        <FarmerSection />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
