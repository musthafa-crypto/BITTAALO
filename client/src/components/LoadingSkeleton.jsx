import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-zinc-200 p-3 animate-pulse">
    <div className="aspect-square bg-zinc-200 rounded-lg mb-3" />
    <div className="h-3 bg-zinc-200 rounded w-1/3 mb-2" />
    <div className="h-4 bg-zinc-200 rounded w-3/4 mb-3" />
    <div className="h-4 bg-zinc-200 rounded w-1/2" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="aspect-[4/5] bg-zinc-200 rounded-xl animate-pulse" />
);

export const CategoryGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);
