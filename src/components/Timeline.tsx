"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

// Dates/events sourced from the American Injustice manuscript outline
// (full-rewrite/OUTLINE.md) and the Aug 7 2026 sentencing hearing transcript
// (sentencing-2026/README.md). Keep this list in sync with those source
// documents if the manuscript timeline is revised -- don't invent dates here.
const events = [
  {
    year: "2016",
    title: "The Flag Petition",
    body: "A Change.org petition asking Mississippi cities to lose state funding for refusing to fly the state flag draws 4,486 signatures. No law degree, no press credential, no record.",
  },
  {
    year: "2017",
    title: "Twelve Days Before It Existed",
    body: "May 20: a rifle is purchased, receipt in hand. May 26: four senior Lafayette County officers arrest him for allegedly threatening a couple with that same rifle \u2014 twelve days before it existed.",
  },
  {
    year: "2018\u20132021",
    title: "The Crowder Years",
    body: "A false accusation, a conviction, a multi-year fight over missing evidence, a judge swapped twice on the same case, and a November 2021 trial split across nine charges.",
  },
  {
    year: "2022",
    title: "A Second Case, A Son Born in Confinement",
    body: "A second psychiatric commitment. A federal civil rights suit. A June arrest on the 2017 order. A guilty plea, a revocation hearing, and roughly a year in Mississippi custody.",
  },
  {
    year: "2023\u20132025",
    title: "Vindication",
    body: "Release in August 2023. A years-long fight for vacatur ends January 21, 2025: full vacatur. February 2026: Reardon v. State is reversed on appeal.",
  },
  {
    year: "Aug 2025",
    title: "The BOLO, and Lafayette",
    body: "Two months before any charge, U.S. Marshals circulate a district alert bulletin naming him a \u201cFirst Amendment Auditor.\u201d August 25: the Lafayette courthouse incident that leads to the federal case.",
  },
  {
    year: "2025\u20132026",
    title: "Trial, the Records Fight, Retaliation",
    body: "Trial and verdict on the Lafayette obstruction charge. A records cover-up fight over lost courthouse footage. A retaliatory arrest during an ice storm. The government later admits, on the record, it failed to preserve the lobby surveillance video.",
  },
  {
    year: "Aug 7, 2026",
    title: "Sentencing",
    body: "Time served (~13 days) plus two years unsupervised probation \u2014 no fine. Barred from Louisiana federal courthouses without 2 days' notice for \u201clegitimate business,\u201d an objection the defense placed on the record. A federal magistrate had already recused herself months earlier, citing the appearance of bias from the Marshals' pre-charge communications. Reardon published the full hearing on Zoom himself \u2014 win or lose, the record is public.",
  },
  {
    year: "Aug 10, 2026",
    title: "Galveston Dismissed \u2014 Without a Judgment",
    body: "Reardon v. Osteen, the federal civil rights case over the fabricated Galveston DWI arrest, is dismissed in its entirety over his written objections to the magistrate's recommendation. As of publication, the court still hasn't served him the district judge's actual order explaining the ruling on any of his nine objections.",
  },
  {
    year: "Now",
    title: "The Appeal",
    body: "The 14-day appeal window in the federal courthouse case is running. The fight isn't over \u2014 it's moving to the next court, on two fronts at once.",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute left-1/3 bottom-0 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <Scale className="w-4 h-4" />
            <span>The Record</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            A Decade in the System
          </h2>
          <p className="text-gray-400 font-light mt-4 max-w-2xl mx-auto">
            Nine years, five state cases, three commitments, and one federal case &mdash;
            anchored to bills of sale, dockets, and sworn transcripts. The full account
            is in American Injustice.
          </p>
        </motion.div>

        <div className="relative pl-8 sm:pl-10">
          {/* Vertical line */}
          <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" />

          <div className="space-y-10">
            {events.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative"
              >
                <div className="absolute -left-8 sm:-left-10 top-1.5 w-4 h-4 rounded-full bg-gold border-4 border-[#0a0a0a] shadow-[0_0_0_1px_rgba(201,168,76,0.3)]" />
                <p className="text-gold-light font-mono text-xs uppercase tracking-widest mb-1">
                  {e.year}
                </p>
                <h3 className="text-xl font-bold text-white mb-2">{e.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base">
                  {e.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
