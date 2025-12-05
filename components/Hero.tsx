import React from "react";

interface HeroProps {
  onStart: () => void;
}

const SHOPMY_COLLECTION_URL =
  "https://shopmy.us/shop/tarafust?Section_id=1311209&tab=collections";

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative isolate px-6 lg:px-8 flex items-start justify-center text-center pt-8 pb-16">
      <div className="mx-auto max-w-2xl py-4 sm:py-6">
        {/* Badge */}
        <div className="mb-6 flex justify-center fade-in">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-stone-600 ring-1 ring-stone-900/10 hover:ring-stone-900/20">
            Tara Fust Design Gift Finder
          </div>
        </div>

        {/* Hero Content */}
        <div
          className="text-center fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-4xl font-serif font-bold tracking-tight text-stone-900 sm:text-6xl">
            The Art of Gifting, Simplified
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-600">
            Struggling to find the right gift? The TFD Gift Concierge analyzes
            your needs to recommend curated products from our exclusive
            collection of hand-curated finds.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={onStart}
              className="rounded-md bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 transition-all duration-300"
            >
              Start Gift Finder
            </button>

            <a
              href={SHOPMY_COLLECTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-stone-900 hover:text-gold-600 transition-colors"
            >
              Browse All Products <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
