"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Coffee, Heart, MapPin, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/CartContext";
import { VARIANTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ProductRecord } from "@/lib/product-api";

type ProductDetailClientProps = {
  product: ProductRecord;
};

type ProductVariantOption = {
  label: string;
  price: number;
  discountPrice?: number | null;
  stock?: number;
};

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { addToCart, toggleFavorite, isFavorite } = useAppContext();
  const productVariants: ProductVariantOption[] =
    product.variants && product.variants.length > 0
      ? product.variants
      : VARIANTS.map((variant) => ({
          label: variant.weight,
          price: product.basePrice * variant.multiplier,
        }));
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantOption>(
    productVariants[0] ?? { label: "Default", price: product.basePrice },
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];
  const currentImage = images[selectedImageIndex] || images[0] || null;

  useEffect(() => {
    if (images.length < 2) return;

    const interval = window.setInterval(() => {
      setSelectedImageIndex((current) => (current + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [images.length]);

  const displayPrice = selectedVariant.discountPrice && selectedVariant.discountPrice > 0
    ? selectedVariant.discountPrice
    : selectedVariant.price;
  const variantInStock = selectedVariant.stock === undefined
    ? product.inStock
    : selectedVariant.stock > 0;
  const favorite = isFavorite(product.id);

  return (
    <div className="container mx-auto min-h-screen px-6 pb-24 pt-32 md:px-12">
      <Link
        href="/shop"
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <section className="space-y-6">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-black/6 bg-[linear-gradient(180deg,_rgba(245,235,225,0.6)_0%,_rgba(255,255,255,0.9)_100%)] p-10 shadow-[0_24px_60px_rgba(42,28,22,0.08)]">
            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              className="absolute right-5 top-5 z-10 rounded-full border border-black/6 bg-white/80 p-3 shadow-sm transition-colors hover:bg-white"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  favorite ? "fill-red-500 text-red-500" : "text-foreground",
                )}
              />
            </button>

            <AnimatePresence mode="wait">
              {currentImage ? (
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentImage}
                    alt={`${product.name} image`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-full border border-primary/20 bg-white shadow-[0_20px_50px_rgba(178,124,78,0.12)]">
                  <Coffee className="h-24 w-24 text-primary/80" />
                </div>
              )}
            </AnimatePresence>
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "overflow-hidden rounded-[1.75rem] border transition",
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-black/10",
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard label="Origin" value={product.origin} />
            <InfoCard label="Process" value={product.process} />
            <InfoCard label="Altitude" value={product.altitude} />
            <InfoCard label="Best brew" value={product.serve.vessel} />
          </div>
        </section>

        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <MapPin className="h-3.5 w-3.5" />
            {product.origin}
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-[-0.05em] text-foreground md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-muted">{product.notes}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {product.rating.toFixed(1)} rating
            </div>
            <div className="text-3xl font-bold text-primary">
              ${displayPrice.toFixed(2)}
            </div>
            {selectedVariant.discountPrice && selectedVariant.discountPrice > 0 ? (
              <div className="text-sm font-semibold text-muted line-through">
                ${selectedVariant.price.toFixed(2)}
              </div>
            ) : product.originalPrice ? (
              <div className="text-sm font-semibold text-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            ) : null}
          </div>

          <p className="text-base leading-8 text-muted">{product.description}</p>

          <div className="space-y-4 rounded-[2rem] border border-black/6 bg-white/85 p-6 shadow-[0_18px_50px_rgba(42,28,22,0.05)]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Choose {product.variantAttribute ?? "variant"}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {productVariants.map((variant) => (
                  <button
                    key={variant.label}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-xl border px-5 py-3 text-sm font-bold transition-all",
                      selectedVariant.label === variant.label
                        ? "border-primary bg-primary text-white"
                        : "border-black/8 bg-background text-foreground hover:border-primary/30",
                    )}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Quantity
              </p>
              <div className="mt-4 inline-flex items-center rounded-xl border border-black/8 bg-background p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="h-10 w-10 rounded-lg text-xl font-semibold text-muted transition-colors hover:bg-white hover:text-foreground"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="h-10 w-10 rounded-lg text-xl font-semibold text-muted transition-colors hover:bg-white hover:text-foreground"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  basePrice: product.basePrice,
                  price: displayPrice,
                  quantity,
                  variant: selectedVariant.label,
                  image: currentImage || "",
                })
              }
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-black/20"
              disabled={!variantInStock}
            >
              <ShoppingBag className="h-5 w-5" />
              {variantInStock
                ? `Add to cart • $${(displayPrice * quantity).toFixed(2)}`
                : "Out of stock"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <BrewCard label="Grind" value={product.serve.grind} />
            <BrewCard label="Water temp" value={product.serve.temp} />
            <BrewCard label="Brew time" value={product.serve.time} />
            <BrewCard label="Body / sweetness" value={`${product.stats.body}/5 • ${product.stats.sweetness}/5`} />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-black/6 bg-white/85 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function BrewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-black/6 bg-background p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
