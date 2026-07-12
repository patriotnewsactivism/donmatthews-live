"use client";

import React from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Talents from "@/components/Talents";
import Music from "@/components/Music";
import Book from "@/components/Book";
import Bundle from "@/components/Bundle";
import Press from "@/components/Press";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen">
        <Hero />
        <Projects />
        <Talents />
        <Music />
        <Book />
        <Bundle />
        <Press />
      </main>
      <Footer />
    </>
  );
}
