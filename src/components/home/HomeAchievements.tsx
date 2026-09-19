import React from "react";

const achievements = [
  {
    number: "15+",
    label: "COMPETITIONS",
  },
  {
    number: "10+",
    label: "PODIUM FINISHES",
  },
  {
    number: "5",
    label: "INTERNATIONAL EVENTS",
  },
  {
    number: "25+",
    label: "AWARDS WON",
  },
];

export default function HomeAchievements() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 relative z-10 mt-20 md:mt-28 mb-16 md:mb-24">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#D71920] font-bold text-lg leading-none font-mono">{"//"}</span>
          <span className="text-[#D71920] font-mono text-[11px] tracking-[0.3em] uppercase font-bold">
            TRACK RECORD
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase tracking-tight text-white">
          ACHIEVEMENTS
        </h2>
      </div>

      {/* Stats row with vertical dividers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/10 py-10 md:py-14 bg-[#0a0a0a]/50 backdrop-blur-sm">
        {achievements.map((item, index) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center px-4 md:px-8 py-6 ${
              index % 2 === 0 ? "border-r border-white/10" : ""
            } ${
              index < 2 ? "border-b lg:border-b-0 border-white/10" : ""
            } ${
              index < 3 ? "lg:border-r border-white/10" : "lg:border-r-0"
            }`}
          >
            <span className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-3">
              {item.number}
            </span>
            <span className="text-zinc-400 font-heading text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-center max-w-[150px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
