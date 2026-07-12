"use client";

import React from "react";
import { Leaf, Github, Music2, Disc } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side: Brand info and Advocacy */}
        <div className="text-center md:text-left space-y-3">
          <p className="text-sm font-semibold text-white">
            Don Matthews
          </p>
          <p className="text-xs text-gray-500 max-w-sm">
            © 2026 Don Matthews. All rights reserved.
          </p>
          {/* Legal / Cannabis disclaimer */}
          <div className="inline-flex items-center gap-1.5 text-xs text-gold/80 bg-gold/5 px-2.5 py-1 rounded">
            <Leaf className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span className="font-medium">Smoke weed every day. Advocate for cannabis freedom.</span>
          </div>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-400">
          <a href="https://wtpnews.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
            WTPNews.org
          </a>
          <a href="https://buildmybot.app" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
            BuildMyBot.App
          </a>
          <a href="https://civilrightshub.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
            CivilRightsHub.org
          </a>
          <a href="https://badactors.online" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
            badactors.online
          </a>
        </div>

        {/* Right: Social icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/patriotnewsactivism"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="p-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-full text-gray-400 hover:text-gold transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.bandlab.com/badactors/albums/8ea7105d-acc1-f011-8195-6045bd30a4b0"
            target="_blank"
            rel="noopener noreferrer"
            title="BandLab"
            className="p-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-full text-gray-400 hover:text-gold transition-all"
          >
            <Music2 className="w-4 h-4" />
          </a>
          <a
            href="https://suno.com/@badactors"
            target="_blank"
            rel="noopener noreferrer"
            title="Suno AI"
            className="p-2 border border-white/10 hover:border-gold/30 bg-white/5 rounded-full text-gray-400 hover:text-gold transition-all"
          >
            <Disc className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
