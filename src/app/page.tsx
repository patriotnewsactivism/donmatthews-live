"use client";

import React from "react";
import Nav from "@/components/Nav";
import BreakingUpdate from "@/components/BreakingUpdate";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import VideoSpotlight from "@/components/VideoSpotlight";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Talents from "@/components/Talents";
import Music from "@/components/Music";
import SingleReleasePromo from "@/components/SingleReleasePromo";
import Testimonials from "@/components/Testimonials";
import Book from "@/components/Book";
import BookExcerpt from "@/components/BookExcerpt";
import Timeline from "@/components/Timeline";
import Support from "@/components/Support";
import Bundle from "@/components/Bundle";
import FAQ from "@/components/FAQ";
import Press from "@/components/Press";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <BreakingUpdate />
      <main className="relative min-h-screen">
        <Hero />
        <SingleReleasePromo />
        <StatsBar />
        <VideoSpotlight />
        <Projects />
        <TechStack />
        <Talents />
        <Music />
        <Testimonials />
        <Book />
        <BookExcerpt />
        <Timeline />
        <Support />
        <Bundle />
        <FAQ />
        <Press />
      </main>
      <Footer />
    </>
  );
}
