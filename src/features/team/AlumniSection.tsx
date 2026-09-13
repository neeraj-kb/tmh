"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

interface AlumniMember {
  id: number | string;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

// Group alumni by graduation batch year. Add new years/people here as needed.
const alumniByYear: Record<string, AlumniMember[]> = {
  "2026": [
    {
      id: "aditya-narayan",
      name: "Aditya Narayan",
      role: "Media & Marketing",
      image: "/images/alumni/Aditya Narayan.webp",
      linkedin: "#",
    },
    {
      id: "dhanush",
      name: "Dhanush",
      role: "",
      image: "/images/alumni/Dhanush.webp",
      linkedin: "#",
    },
    {
      id: "fardeen",
      name: "Fardeen",
      role: "Corporate Relationship",
      image: "/images/alumni/Fardeen.webp",
      linkedin: "#",
    },
    {
      id: "gajendra",
      name: "Gajendra",
      role: "Chassis",
      image: "/images/alumni/Gajendra.webp",
      linkedin: "#",
    },
    {
      id: "karthik",
      name: "Karthik",
      role: "Chassis",
      image: "/images/alumni/Karthik.webp",
      linkedin: "#",
    },
    {
      id: "mokshith",
      name: "Mokshith",
      role: "Powerunit",
      image: "/images/alumni/Mokshith.webp",
      linkedin: "#",
    },
    {
      id: "nishitha",
      name: "Nishitha",
      role: "Corporate Relationship",
      image: "/images/alumni/Nishitha.webp",
      linkedin: "#",
    },
    {
      id: "pavan",
      name: "Pavan",
      role: "Chassis",
      image: "/images/alumni/Pavan.webp",
      linkedin: "#",
    },
    {
      id: "raj-surya",
      name: "Raj Surya",
      role: "Finance",
      image: "/images/alumni/Raj Surya.webp",
      linkedin: "#",
    },
    {
      id: "sahil",
      name: "Sahil",
      role: "Telemetry",
      image: "/images/alumni/Sahil.webp",
      linkedin: "#",
    },
    {
      id: "sharath",
      name: "Sharath",
      role: "Telemetry",
      image: "/images/alumni/Sharath.webp",
      linkedin: "#",
    },
    {
      id: "tanish",
      name: "Tanish",
      role: "Telemetry",
      image: "/images/alumni/Tanish.webp",
      linkedin: "#",
    },
    {
      id: "tharun",
      name: "Tharun",
      role: "Telemetry",
      image: "/images/alumni/Tharun.webp",
      linkedin: "#",
    },
    {
      id: "vikas",
      name: "Vikas",
      role: "Telemetry",
      image: "/images/alumni/Vikas.webp",
      linkedin: "#",
    },
    {
      id: "vinay",
      name: "Vinay",
      role: "Brakes",
      image: "/images/alumni/Vinay.webp",
      linkedin: "#",
    },
    {
      id: "ks-ram-kumar",
      name: "K S Ram Kumar",
      role: "",
      image: "/images/alumni/Ram.webp",
      linkedin: "#",
    },
    {
      id: "bhoomika-kb",
      name: "Bhoomika K B",
      role: "",
      image: "/images/alumni/Bhoomika.webp",
      linkedin: "#",
    },
    {
      id: "rohan",
      name: "Rohan",
      role: "Electrical",
      image: "/images/alumni/Rohan.webp",
      linkedin: "#",
    },
    {
      id: "nb-naveen-raj",
      name: "N B Naveen Raj",
      role: "",
      image: "/images/alumni/Naveen.webp",
      linkedin: "#",
    },
    {
      id: "kiran-kumar-n",
      name: "Kiran Kumar N",
      role: "Chassis",
      image: "/images/alumni/Kiran.webp",
      linkedin: "#",
    },
  ],
  "2025": [
    {
      id: "adithya-hiremath",
      name: "Adithya Hiremath",
      role: "Operations Lead",
      image: "/images/alumni/Adithya Hiremath.webp",
      linkedin: "#",
    },
    {
      id: "bharath-vr",
      name: "Bharath V R",
      role: "Chassis",
      image: "/images/alumni/Bharath V R.webp",
      linkedin: "#",
    },
    {
      id: "ganesh",
      name: "Ganesh",
      role: "Manufacturing",
      image: "/images/alumni/Ganesh.webp",
      linkedin: "#",
    },
    {
      id: "karthik-yadav",
      name: "Karthik Yadav",
      role: "Vehicle Dynamics",
      image: "/images/alumni/Karthik Yadav.webp",
      linkedin: "#",
    },
    {
      id: "manish",
      name: "Manish",
      role: "Electronics",
      image: "/images/alumni/Manish.webp",
      linkedin: "#",
    },
    {
      id: "syeeda-aiemen",
      name: "Syeeda Aiemen Dania Saleem",
      role: "Electronics Lead",
      image: "/images/alumni/Syeeda Aiemen Dania Saleem.webp",
      linkedin: "#",
    },
  ],
};

const batchYears = Object.keys(alumniByYear).sort((a, b) => (a < b ? 1 : -1));

export default function AlumniSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(batchYears[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<AlumniMember | null>(null);

  const alumni = alumniByYear[selectedYear] || [];

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = 200 + 16;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setActiveIndex(Math.min(newIndex, alumni.length - 1));
    }
  };

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
  }, [selectedYear]);

  return (
    <section className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full">
      <div className="lg:w-1/3 flex flex-col pt-4">
        <span className="text-primary font-heading text-2xl font-bold mb-2">
          05
        </span>
        <h2 className="text-3xl font-heading font-bold uppercase tracking-wider mb-6">
          Alumni
        </h2>
        <div className="w-12 h-1 bg-white/10 mb-6" />
        <p className="text-muted-foreground mb-8">
          Their legacy. Our inspiration.
          <br />
          Always a part of the journey.
        </p>

        <div className="relative w-full max-w-[240px]">
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
            Select Batch
          </label>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-left hover:border-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span className="font-heading font-bold">{selectedYear}</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 no-scrollbar">
              {batchYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors font-heading text-sm ${selectedYear === year
                    ? "text-primary bg-primary/10"
                    : "text-white"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-2/3 flex flex-col items-center">
        {alumni.length === 0 ? (
          <p className="text-muted-foreground py-12">
            No alumni records for this batch yet.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-4 w-full relative">
              <button
                onClick={scrollLeft}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors absolute -left-5 z-10 bg-background md:static"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-4 pb-4 scroll-smooth"
              >
                {alumni.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => setSelectedPerson(person)}
                    className="snap-start w-[42vw] sm:w-[200px] md:w-[220px] lg:w-[240px] flex-none flex flex-col bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-black/40"
                  >
                    <div className="aspect-square bg-neutral-900 relative">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            person.name,
                          )}&background=202020&color=fff&size=300`;
                        }}
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-heading font-bold text-lg mb-1">
                        {person.name}
                      </h3>

                      <p className="text-muted-foreground text-xs mb-1">
                        {person.role}
                      </p>
                      {person.linkedin && person.linkedin !== "#" && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-white transition-colors text-xs inline-block mt-1"
                          aria-label={`${person.name} LinkedIn`}
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollRight}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors absolute -right-5 z-10 bg-background md:static"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              {alumni.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollRef.current) {
                      const cardWidth = 200 + 16;
                      scrollRef.current.scrollTo({
                        left: index * cardWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${index === activeIndex
                    ? "bg-primary"
                    : "bg-white/20 hover:bg-white/40"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Alumni Profile Popup Modal */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPerson(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full flex flex-col sm:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Photo */}
            <div className="sm:w-1/2 aspect-square sm:aspect-auto bg-neutral-900 relative">
              <img
                src={selectedPerson.image}
                alt={selectedPerson.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedPerson.name,
                  )}&background=202020&color=fff&size=400`;
                }}
              />
            </div>

            {/* Info */}
            <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <span className="inline-block text-primary font-heading text-lg font-bold uppercase tracking-widest mb-4">
                Alumni
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
                {selectedPerson.name}
              </h3>
              {selectedPerson.role && (
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold mb-6">
                  {selectedPerson.role}
                </p>
              )}
              {selectedPerson.linkedin && selectedPerson.linkedin !== "#" && (
                <a
                  href={selectedPerson.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-white transition-colors text-sm underline underline-offset-4"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
