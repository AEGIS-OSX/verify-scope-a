"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProjectImage } from "./components/ProjectImage";

const EASE_OUT: [number, number, number, number] = [0.0, 0.0, 0.2, 1];

const fadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: EASE_OUT, delay },
});

interface FeatureItem {
  id: "feature_1" | "feature_2" | "feature_3";
  label: string;
  title: string;
  body: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "feature_1",
    label: "CRAFT",
    title: "HAND-POURED IRON",
    body: "Every bell is cast in a single sand mold. No seams. No shortcuts. Just raw, industrial weight.",
  },
  {
    id: "feature_2",
    label: "PERMANENCE",
    title: "LIFETIME WARRANTY",
    body: `Iron is permanent. Our warranty matches. If you manage to break it, we replace it. No conditions.`,
  },
  {
    id: "feature_3",
    label: "SERVICE",
    title: "FREE RE-COATING",
    body: `Iron deserves maintenance. Send your bell back to the forge anytime. We strip, clean, and re-coat it at no cost.`,
  },
];

export default function Home() {
  const prefersReduced = useReducedMotion();

  const motionProps = (delay: number = 0) =>
    prefersReduced ? {} : fadeUp(delay);

  return (
    <main id="top" className="bg-[var(--color-canvas)] min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <ProjectImage
            id="hero"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay: bottom-to-top dark scrim */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--color-canvas) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Hero content: bottom-left aligned */}
        <div className="relative z-10 px-6 pb-16 md:px-16 md:pb-24 lg:px-24 lg:pb-32 max-w-4xl">
          <motion.h1
            {...motionProps(0)}
            className="font-[family-name:var(--font-display)] font-bold text-[var(--color-iron)] text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] lowercase mb-8"
          >
            iron, poured with intent.
          </motion.h1>
          <motion.div {...motionProps(0.12)}>
            <a
              href="https://shop.kettlecraft.com"
              className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-rust)] text-[var(--color-iron)] font-[family-name:var(--font-body)] text-sm tracking-[0.08em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-iron)] transition-colors duration-200 hover:bg-[var(--color-rust-dark)]"
              aria-label="Shop the KettleCraft collection"
            >
              SHOP THE COLLECTION
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section
        aria-label="The Craft"
        className="w-full bg-[var(--color-canvas)] border-t border-[var(--color-divider)] py-24 md:py-32 lg:py-40"
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 lg:px-24">
          <motion.p
            {...motionProps(0)}
            className="font-[family-name:var(--font-body)] text-[var(--color-charcoal)] text-xs tracking-[0.08em] uppercase mb-16"
          >
            THE CRAFT
          </motion.p>

          <div className="flex flex-col gap-0">
            {FEATURES.map((feature, i) => (
              <motion.article
                key={feature.id}
                {...motionProps(i * 0.08)}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 py-12 border-t border-[var(--color-divider)] first:border-t-0"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
                  <ProjectImage
                    id={feature.id}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center gap-4">
                  <p className="font-[family-name:var(--font-mono)] text-[var(--color-charcoal)] text-xs tracking-[0.08em] uppercase">
                    {feature.label}
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] font-bold text-[var(--color-iron)] text-3xl md:text-4xl leading-[1.0] tracking-[-0.02em]">
                    {feature.title}
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[var(--color-charcoal)] text-base leading-[1.53]">
                    {feature.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────────── */}
      <section
        aria-label="The Proof"
        className="relative w-full overflow-hidden py-32 md:py-48"
      >
        {/* Background texture */}
        <div className="absolute inset-0 z-0">
          <ProjectImage
            id="social_proof"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div
            className="absolute inset-0 bg-[var(--color-canvas)]"
            style={{ opacity: 0.7 }}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-16 lg:px-24">
          <motion.figure
            {...motionProps(0)}
            className="max-w-3xl"
          >
            <blockquote>
              <p className="font-[family-name:var(--font-display)] font-bold text-[var(--color-iron)] text-2xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] mb-8">
                &ldquo;It is not gym equipment. It is a monument to the work you
                haven&rsquo;t done yet.&rdquo;
              </p>
            </blockquote>
            <figcaption className="font-[family-name:var(--font-mono)] text-[var(--color-charcoal)] text-xs tracking-[0.08em] uppercase">
              Elias Thorne, Lead Smith
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer
        className="w-full border-t border-[var(--color-divider)] bg-[var(--color-canvas)] py-12 md:py-16"
        aria-label="Site footer"
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Wordmark */}
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("top")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-iron)]"
            aria-label="Scroll to top"
          >
            <ProjectImage
              id="logo"
              className="h-8 w-auto"
            />
            <span className="font-[family-name:var(--font-body)] text-[var(--color-iron)] text-xs tracking-[0.08em] uppercase">
              KETTLECRAFT
            </span>
          </button>

          {/* Legal */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <p className="font-[family-name:var(--font-body)] text-[var(--color-charcoal)] text-xs tracking-[0.08em]">
              &copy; 2026 KettleCraft. All rights reserved.
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-6 list-none p-0 m-0">
                <li>
                  <a
                    href="/privacy"
                    className="font-[family-name:var(--font-body)] text-[var(--color-charcoal)] text-xs tracking-[0.08em] uppercase hover:text-[var(--color-iron)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-iron)]"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="font-[family-name:var(--font-body)] text-[var(--color-charcoal)] text-xs tracking-[0.08em] uppercase hover:text-[var(--color-iron)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-iron)]"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:forge@kettlecraft.com"
                    className="font-[family-name:var(--font-body)] text-[var(--color-charcoal)] text-xs tracking-[0.08em] uppercase hover:text-[var(--color-iron)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-iron)]"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
