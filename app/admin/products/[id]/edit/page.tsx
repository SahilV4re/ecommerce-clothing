"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { upload } from "@imagekit/next";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import IKProductImage from "@/components/IKProductImage";

const MEN_WOMEN_SIZES = ["S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["22", "24", "26", "28", "30", "32", "34"];

export default function EditProductPage() {
  const { id } = useParams();
  const { user, userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newImages, setNewImages] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    subcategory: "",
    stock: "",
    featured: false,
    image_url: "",
    available_sizes: [] as string[],
    available_colors: [] as string[],
    additional_images: [] as string[],
  });

  // Redirect non-admins
  useEffect(() => {
    if (!user || userRole !== "admin") router.push("/");
  }, [user, userRole, router]);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Product not found");
        router.push("/admin");
        return;
      }

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: String(data.price || ""),
        original_price: String(data.original_price || ""),
        category: data.category || "",
        subcategory: data.subcategory || "",
        stock: String(data.stock || 0),
        featured: data.featured || false,
        image_url: data.image_url || "",
        available_sizes: data.available_sizes || [],
        available_colors: data.available_colors || [],
        additional_images: data.additional_images || [],
      });
      setFetching(false);
    };

    if (id) fetchProduct();
  }, [id, router]);

  /* ---------------- IMAGE UPLOAD (ImageKit) ---------------- */
  const authenticator = async () => {
    const res = await fetch("/api/imagekit-auth");
    if (!res.ok) throw new Error("Failed to get ImageKit auth");
    return res.json();
  };

  const uploadImages = async (files: FileList) => {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const authParams = await authenticator();
      const result = await upload({
        file,
        fileName: `product-${crypto.randomUUID()}`,
        folder: "/products",
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/opc6rkvof',
        ...authParams,
      });

      if (!result?.url) throw new Error("Upload failed");
      urls.push(result.url);
    }

    return urls;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.available_sizes.length === 0) {
        toast.error("Select at least one size");
        return;
      }

      let imageUrl = formData.image_url;
      let additionalImages = formData.additional_images;

      // If new images were selected, upload them
      if (newImages && newImages.length > 0) {
        const imageUrls = await uploadImages(newImages);
        imageUrl = imageUrls[0];
        additionalImages = [
          ...formData.additional_images,
          ...imageUrls.slice(1),
        ];
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          original_price: Number(formData.original_price),
          category: formData.category,
          subcategory: formData.subcategory,
          stock: Number(formData.stock),
          featured: formData.featured,
          image_url: imageUrl,
          additional_images: additionalImages,
          available_sizes: formData.available_sizes,
          available_colors: formData.available_colors,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Product updated successfully");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const getSizesByCategory = () => {
    if (formData.category === "kids") return KIDS_SIZES;
    if (formData.category === "men" || formData.category === "women")
      return MEN_WOMEN_SIZES;
    return [];
  };

  /* ---------------- UI ---------------- */
  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Product Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input
                  type="number"
                  required
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      original_price: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Select
              value={formData.category}
              onValueChange={(v) =>
                setFormData({ ...formData, category: v, available_sizes: [] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Label>Subcategory</Label>
              <Input
                required
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
              />
            </div>

            {/* -------- SIZES -------- */}
            <div>
              <Label>Available Sizes</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {getSizesByCategory().map((size) => (
                  <Button
                    type="button"
                    key={size}
                    variant={
                      formData.available_sizes.includes(size)
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        available_sizes: prev.available_sizes.includes(size)
                          ? prev.available_sizes.filter((s) => s !== size)
                          : [...prev.available_sizes, size],
                      }))
                    }
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* -------- CURRENT IMAGE -------- */}
            <div>
              <Label>Current Main Image</Label>
              {formData.image_url && (
                <div className="mt-2 rounded-lg overflow-hidden border w-40 h-40">
                  <IKProductImage
                    src={formData.image_url}
                    alt="Current product image"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    transformation={[
                      {
                        width: "200",
                        height: "200",
                        quality: "80",
                        f: "auto",
                      },
                    ]}
                  />
                </div>
              )}

              {formData.additional_images.length > 0 && (
                <div className="mt-3">
                  <Label className="text-sm text-muted-foreground">
                    Additional Images ({formData.additional_images.length})
                  </Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {formData.additional_images.map((img, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg overflow-hidden border group"
                      >
                        <IKProductImage
                          src={img}
                          alt={`Additional image ${i + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover"
                          transformation={[
                            {
                              width: "150",
                              height: "150",
                              quality: "75",
                              f: "auto",
                            },
                          ]}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              additional_images:
                                prev.additional_images.filter(
                                  (_, idx) => idx !== i
                                ),
                            }))
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* -------- UPLOAD NEW IMAGES -------- */}
            <div>
              <Label>Replace / Add Images (optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                First image becomes the main image. Additional images are
                appended.
              </p>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImages(e.target.files)}
              />
              {newImages && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {Array.from(newImages).map((file, i) => (
                    <Image
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt=""
                      width={100}
                      height={100}
                      className="h-24 w-full object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.featured}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, featured: Boolean(v) })
                }
              />
              <Label>Featured Product</Label>
            </div>

            <div className="flex gap-3">
              <Button disabled={loading} className="flex-1">
                {loading ? "Updating..." : "Update Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
