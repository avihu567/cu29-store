import Link from "next/link";
import BrandMark from "../BrandMark";

/** Closing banner: jumps back to the buy box (#buy) or straight to the cart. */
export default function FinalCta() {
  return (
    <section className="px-3 pb-6 sm:px-5">
     <div className="relative overflow-hidden rounded-[2rem] bg-copper-deep text-ivory sm:rounded-[2.75rem]">
      <div className="pointer-events-none absolute -bottom-24 -start-16 opacity-15">
        <BrandMark logo="seal" decorative className="h-[26rem] animate-slow-spin" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <BrandMark logo="mark" decorative className="h-9 text-ivory/85" />
        <h2 className="mt-8 max-w-2xl font-serif text-4xl font-light leading-tight sm:text-6xl">
          מוכן להתחיל את הטקס שלך?
        </h2>
        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href="#buy"
            className="rounded-full bg-ivory px-10 py-4 text-sm tracking-wide text-tobacco-deep transition-colors hover:bg-paper"
          >
            קנה עכשיו
          </a>
          <Link
            href="/cart"
            className="rounded-full border border-ivory/40 px-10 py-4 text-sm tracking-wide text-ivory transition-colors hover:bg-ivory/10"
          >
            מעבר לסל ולתשלום
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
