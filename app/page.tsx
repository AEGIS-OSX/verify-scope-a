"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProjectImage } from "./components/ProjectImage";

export default function Home() {
  const prefersReduced = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.0, 0.0, 0.2, 1] },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative min-h-screen flex items-end pb-[var(--space-16)] overflow-hidden"
      >
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <ProjectImage
            id="hero"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          {/* Gradient overlay: bottom-heavy so text is legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--color-canvas) 28%, transparent 72%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Content: bottom-left, Raycast-style */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-[var(--space-8)] md:px-[var(--space-16)]">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-[640px]"
          >
            <motion.h1
              variants={fadeUp}
              className="font-[family-name:var(--font-display)] font-bold text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.03em] lowercase text-[var(--color-iron)] mb-[var(--space-8)]"
            >
              iron, poured with intent.
            </motion.h1>

            <motion.div variants={fadeUp}>
              <a
                href="https://shop.kettlecraft.com"
                className="kc-btn-primary inline-flex items-center justify-center px-[var(--space-8)] font-[family-name:var(--font-body)] text-[var(--color-iron)] text-[length:var(--text-label)] tracking-[0.08em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-rust)]"
                aria-label="Shop the KettleCraft collection"
              >
                SHOP THE COLLECTION
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section
        aria-label="The Craft"
        className="bg-[var(--color-canvas)] py-[var(--space-24)] md:py-[var(--space-32)]"
      >
        <div className="max-w-[1440px] mx-auto px-[var(--space-8)] md:px-[var(--space-16)]">
          {/* Section label */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] uppercase text-[var(--color-charcoal)] mb-[var(--space-16)]"
          >
            The Craft
          </motion.p>

          {/* Three features stacked with dividers */}
          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="list-none m-0 p-0"
            aria-label="Product features"
          >
            {[
              {
                id: "feature_1",
                label: "HAND-POURED IRON",
                body: "Every bell is cast in a single sand mold. No seams. No shortcuts. Just raw, industrial weight.",
              },
              {
                id: "feature_2",
                label: "LIFETIME WARRANTY",
                body: `Iron is permanent. Our warranty matches. If you manage to break it, we replace it. No conditions.`,
              },
              {
                id: "feature_3",
                label: "FREE RE-COATING",
                body: "Iron deserves maintenance. Send your bell back to the forge anytime. We strip, clean, and re-coat it at no cost.",
              },
            ].map((feature, i) => (
              <motion.li
                key={feature.id}
                variants={fadeUp}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-[var(--space-8)] md:gap-[var(--space-16)] py-[var(--space-12)] border-t border-[var(--color-divider)] last:border-b"
              >
                {/* Image */}
                <div className="aspect-[16/9] md:aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
                  <ProjectImage
                    id={feature.id}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center gap-[var(--space-4)]">
                  <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-mono)] text-[var(--color-rust)] tracking-[0.08em] uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] uppercase text-[var(--color-iron)]">
                    {feature.label}
                  </h2>
                  <p className="font-[family-name:var(--font-body)] font-light text-[length:var(--text-body)] leading-[1.53] text-[var(--color-charcoal)] max-w-[480px]">
                    {feature.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────── */}
      <section
        aria-label="The Proof"
        className="relative py-[var(--space-24)] md:py-[var(--space-32)] overflow-hidden"
      >
        {/* Background texture */}
        <div className="absolute inset-0 z-0">
          <ProjectImage
            id="social_proof"
            className="w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0 bg-[var(--color-canvas)]/80"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-[var(--space-8)] md:px-[var(--space-16)]">
          <motion.figure
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-[800px]"
          >
            <blockquote>
              <p className="font-[family-name:var(--font-display)] font-bold text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.0] tracking-[-0.02em] text-[var(--color-iron)] mb-[var(--space-8)]">
                &ldquo;It is not gym equipment. It is a monument to the work
                you haven&rsquo;t done yet.&rdquo;
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-[var(--space-4)]">
              <span
                className="block w-[var(--space-8)] h-px bg-[var(--color-rust)]"
                aria-hidden="true"
              />
              <cite className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] uppercase text-[var(--color-charcoal)] not-italic">
                Elias Thorne, Lead Smith
              </cite>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        className="border-t border-[var(--color-divider)] py-[var(--space-8)] bg-[var(--color-canvas)]"
        aria-label="Site footer"
      >
        <div className="max-w-[1440px] mx-auto px-[var(--space-8)] md:px-[var(--space-16)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[var(--space-4)]">
          {/* Wordmark */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-[var(--space-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-rust)]"
            aria-label="Scroll to top"
          >
            <ProjectImage
              id="logo"
              className="h-8 w-auto"
            />
            <span className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] uppercase text-[var(--color-iron)]">
              KETTLECRAFT
            </span>
          </button>

          {/* Legal links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-[var(--space-6)] list-none m-0 p-0">
              <li>
                <a
                  href="/privacy"
                  className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-iron)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-rust)]"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@kettlecraft.com"
                  className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-iron)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-rust)]"
                >
                  Contact
                </a>
              </li>
              <li>
                <span className="font-[family-name:var(--font-body)] text-[length:var(--text-label)] tracking-[0.08em] text-[var(--color-charcoal)]">
                  &copy; 2026 KettleCraft. All rights reserved.
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </main>
  );
}
