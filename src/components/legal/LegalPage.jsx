import { Link } from "@tanstack/react-router";
import { AlertTriangle, FileText } from "lucide-react";

const POLICIES = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Use" },
  { to: "/data-declaration", label: "Data declaration" },
];

export function LegalSection({ id, title, children }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-heading text-[17px] font-bold text-cocoa sm:text-[18px]">
        {title}
      </h2>
      <div className="mt-1.5 space-y-2 text-[14px] leading-relaxed text-cocoa/70">{children}</div>
    </section>
  );
}

export function LegalList({ items }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={typeof item === "string" ? item : item.key}>{typeof item === "string" ? item : item.content}</li>
      ))}
    </ul>
  );
}

export default function LegalPage({ eyebrow, title, intro, current, children }) {
  return (
    <div className="pb-10">
      <div className="wrap pt-5 sm:pt-6">
        <div className="card relative overflow-hidden p-5 sm:p-7">
          <div className="pointer-events-none absolute inset-0 paper-dots opacity-25" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow">
              <FileText className="h-3 w-3" aria-hidden="true" /> {eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-[clamp(1.8rem,4.4vw,2.5rem)] font-extrabold leading-[1.03] text-cocoa">
              {title}
            </h1>
            <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-cocoa/70">{intro}</p>
            <p className="mt-2 text-[12px] font-semibold text-cocoa/45">
              Written from how this app actually behaves today. Effective date to be set by the operator.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_290px] lg:items-start">
          <article className="card space-y-5 p-5 sm:p-6">{children}</article>

          <aside className="space-y-3 lg:sticky lg:top-20">
            <div className="rounded-[22px] border border-caramel/40 bg-butter/40 p-4">
              <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-cocoa/60">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Operator details to complete
              </p>
              <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-cocoa/65">
                <li>Operator name and contact address</li>
                <li>Country and jurisdiction</li>
                <li>Effective date of these policies</li>
                <li>Hosting provider and its request-log retention</li>
                <li>Whether the hosting platform adds its own analytics or cookies</li>
              </ul>
              <p className="mt-2 text-[11.5px] leading-relaxed text-cocoa/50">
                SanKa is a personal project. These pages must be reviewed and completed before they are treated as a
                final legal notice.
              </p>
            </div>

            <div className="card-flat p-4">
              <p className="eyebrow">Policies</p>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {POLICIES.map((policy) => (
                  <li key={policy.to}>
                    {policy.to === current ? (
                      <span className="font-bold text-cocoa" aria-current="page">
                        {policy.label}
                      </span>
                    ) : (
                      <Link to={policy.to} className="font-semibold text-cocoa/65 transition-colors hover:text-cocoa">
                        {policy.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}