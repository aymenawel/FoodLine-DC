import Link from 'next/link';
import QrCard from '@/components/QrCard';
import ThemeToggle from '@/components/ThemeToggle';
import { STATS, type Stat } from '@/lib/stats';

const POP_URL = 'https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf';

function StatBlock({ s }: { s: Stat }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="num text-4xl font-medium leading-none">{s.value}</p>
      <p className="mt-2 text-[1.0625rem] leading-snug">{s.label}</p>
      <a href={s.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[0.9375rem] text-faint underline decoration-line underline-offset-2 hover:text-muted">{s.source}</a>
    </div>
  );
}

export default function Home() {
  return (
    <>
    <ThemeToggle className="fixed right-4 top-4 z-10" />
    <main className="mx-auto grid min-h-dvh w-full max-w-[1400px] items-center gap-12 px-6 py-10 lg:grid-cols-[1fr_380px] lg:px-14">
      <section>
        <p className="kicker">STEAM4U · Food deserts · Washington, DC</p>
        <h1 className="mt-5 font-serif text-[3.25rem] leading-[0.98] tracking-[-0.015em] sm:text-[5.25rem]">
          Five grocery stores.<br /><em className="text-cta">150,000 neighbors.</em>
        </h1>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted sm:text-xl">
          East of the Anacostia River, in Wards 7 and 8, families live miles from a full-service grocery store.
          <span className="text-ink"> FoodLine</span> is a text line: send a ZIP code, neighborhood or cross street, get the three closest places to find food, in English or Spanish, on any phone.
        </p>
        <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-muted sm:text-xl">
          Every text also drops an anonymous dot on a live map. Food-desert maps are built from census data that is years old. This one updates every time a neighbor asks for help.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/map" className="inline-flex min-h-12 items-center rounded-full bg-cta px-6 font-semibold text-cta-ink transition active:scale-[.98]">Open the live map</Link>
          <Link href="/demo" className="inline-flex min-h-12 items-center rounded-full border-[length:var(--btn-bw)] border-[color:var(--btn-border)] px-6 font-semibold transition hover:border-cta">Side-by-side demo</Link>
          <Link href="/chat" className="inline-flex min-h-12 items-center rounded-full border-[length:var(--btn-bw)] border-[color:var(--btn-border)] px-6 font-semibold transition hover:border-cta">Try the text line</Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <StatBlock s={STATS.eastStores} />
          <StatBlock s={STATS.income} />
          <StatBlock s={STATS.dcInsecure} />
        </div>
        <p className="mt-4 text-[0.9375rem] text-faint">
          “More than 150,000 people” east of the river: <a className="underline decoration-line underline-offset-2" href={POP_URL} target="_blank" rel="noreferrer">DC Food Policy Council, Food System Assessment (2023)</a>.
        </p>
      </section>
      <aside className="mx-auto w-full max-w-[380px]"><QrCard /></aside>
    </main>
    </>
  );
}
