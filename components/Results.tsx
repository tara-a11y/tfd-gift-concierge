import React, { useState, useEffect } from 'react';
import { Recommendation, Product } from '../types';

interface ResultsProps {
  recommendations: Recommendation[];
  onReset: () => void;
}

const IMAGE_FETCH_BLOCKLIST = [
  '1stdibs.com',
  'chairish.com',
  'target.com',
  'neimanmarcus.com',
  'bergdorfgoodman.com',
  'shopbop.com',
  'bloomingdales.com',
  'amazon.com',
  'www.amazon.com'
];

const ProductImage: React.FC<{ product: Product }> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isBlockedDomain = IMAGE_FETCH_BLOCKLIST.some(domain => 
    product.affiliateLink.toLowerCase().includes(domain)
  );

  const dynamicImageUrl = !isBlockedDomain
    ? `https://api.microlink.io/?url=${encodeURIComponent(product.affiliateLink)}&embed=image.url`
    : null;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const source = (!isBlockedDomain && dynamicImageUrl && !hasError) 
    ? dynamicImageUrl 
    : product.imageUrl;

  useEffect(() => {
    if (isBlockedDomain) {
      setIsLoading(false);
    }
  }, [isBlockedDomain]);

  return (
    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-stone-100 xl:aspect-h-8 xl:aspect-w-7 relative">
      {isLoading && !isBlockedDomain && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse z-10" />
      )}
      <img
        src={source}
        alt={product.name}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover object-center transition-all duration-500 ${
          isLoading && !isBlockedDomain ? 'opacity-0' : 'opacity-100'
        } group-hover:opacity-75`}
      />
    </div>
  );
};

const Results: React.FC<ResultsProps> = ({ recommendations, onReset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-stone-900 sm:text-4xl">
          Your Curated Selection
        </h2>
        <p className="mt-4 text-lg text-stone-600">
          Based on your answers, we believe these items will make the perfect gift.
        </p>
        <p className="mt-2 text-sm text-stone-400 italic">
          *Note: If an item image is not displayed, please click "View Product" to see full details on the retailer's site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {recommendations.map((product, idx) => (
          <div key={product.id} className="group relative flex flex-col fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <ProductImage product={product} />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-stone-900 shadow-sm z-20">
              {product.matchScore}% Match
            </div>
            
            <div className="mt-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-serif font-medium text-stone-900 leading-tight">
                  <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-stone-500">{product.category}</p>
              </div>
              <p className="text-sm font-medium text-stone-900 whitespace-nowrap ml-2">
                {product.price > 0 ? `$${product.price}` : 'Check Price'}
              </p>
            </div>
            
            <div className="mt-3 p-4 bg-stone-50 rounded-md border border-stone-100 flex-grow">
              <p className="text-sm text-stone-600 italic">
                "{product.reasoning}"
              </p>
            </div>

            <div className="mt-4 pt-2">
              <a 
                href={product.affiliateLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center rounded-md bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 transition-colors duration-200"
              >
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-8 py-3 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default Results;
