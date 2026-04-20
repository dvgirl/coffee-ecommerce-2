import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { getProductById } from "@/lib/product-api";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
