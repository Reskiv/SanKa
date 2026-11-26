import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Squiggle, StarBurst } from "@/components/brand/Doodles";

const DETAILS = [
  { icon: Mail, label: "Email", value: "Email to be added" },
  { icon: Phone, label: "Phone", value: "Phone to be added" },
  { icon: MapPin, label: "Studio", value: "Address to be added" },
  { icon: Clock, label: "Reply time", value: "Within two days, usually" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 pb-16 pt-4 md:pb-24 md:pt-6">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[40px] border border-cocoa/20 bg-cocoa px-6 py-10 text-oat md:px-12 md:py-14">
          <StarBurst className="animate-spin-slow pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-lagoon/10" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
            <div>
              <p className="eyebrow !text-lagoon">05 / Contact us</p>
              <h2 className="mt-4 text-[clamp(2.2rem,5.2vw,3.8rem)] font-extrabold leading-[0.95] text-oat">
                Say hello.
                <br />
                <span className="hand text-[clamp(2.4rem,5.6vw,4rem)] leading-[0.8] text-lagoon">We read everything.</span>
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-oat/70">
                Café suggestions, a spot we should visit, or a partnership idea. This is the place. Every
                message lands with a real person, usually between two cups of coffee.
              </p>
              <Squiggle className="mt-6 w-40 opacity-40 [&_path]:stroke-oat" />

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {DETAILS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-oat/15 bg-oat/[0.06] p-4 transition-colors duration-300 hover:bg-oat/[0.1]"
                  >
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-lagoon">
                      <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.label}
                    </p>
                    <p className="mt-2 text-[15px] font-semibold text-oat/90">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-[28px] border border-oat/15 bg-oat/[0.06] p-6 md:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lagoon">Follow along</p>
                <ul className="mt-4 space-y-3 text-[15px] text-oat/85">
                  <li className="flex items-center justify-between border-b border-oat/10 pb-3">
                    Instagram <span className="text-oat/45">@handle to be added</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-oat/10 pb-3">
                    TikTok <span className="text-oat/45">@handle to be added</span>
                  </li>
                  <li className="flex items-center justify-between">
                    Newsletter <span className="text-oat/45">coming later</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[13px] leading-relaxed text-oat/55">
                  These contact details are placeholders for now. The layout is ready for your real email,
                  phone, address and handles.
                </p>
                <Link to="/map" className="btn btn-lagoon mt-5 w-full">
                  Find a café near you
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}