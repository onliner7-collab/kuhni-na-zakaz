"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Kitchen {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  style: string;
  material: string;
  priceFrom: number;
  priceTo?: number | null;
  features: string[];
  images: string[];
  mainImage: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  published: boolean;
}

const CATEGORIES = [
  "Corner",
  "Straight",
  "U-shaped",
  "Island",
  "Small",
  "Floor-to-ceiling",
  "Handleless",
  "Designer",
  "Classic",
];

function toSlug(str: string): string {
  const map: Record<string, string> = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "e",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "i",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ы": "y",
    "ь": "",
    "ъ": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
  };

  return str
    .toLowerCase()
    .split("")
    .map(char => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function KitchenForm({ kitchen }: { kitchen?: Kitchen }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [features, setFeatures] = useState<string[]>(kitchen?.features ?? []);
  const [images, setImages] = useState<string[]>(kitchen?.images ?? []);
  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");
  const [slugVal, setSlugVal] = useState(kitchen?.slug ?? "");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!kitchen) setSlugVal(toSlug(e.target.value));
  }

  function addFeature() {
    const value = newFeature.trim();
    if (value && !features.includes(value)) {
      setFeatures([...features, value]);
      setNewFeature("");
    }
  }

  function addImage() {
    const value = newImage.trim();
    if (value) {
      setImages([...images, value]);
      setNewImage("");
    }
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/kapi/admin/uploads/kitchens", {
      method: "POST",
      body: formData,
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok || typeof payload.url !== "string") {
      throw new Error(payload.error || "Failed to upload image");
    }

    return payload.url as string;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadedUrls = await Promise.all(files.map(uploadImage));
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success(files.length === 1 ? "Image uploaded" : "Images uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploadingImages(false);
      if (e.target) e.target.value = "";
    }
  }

  async function removeImageAt(index: number) {
    const imageToRemove = images[index];
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);

    setImages(nextImages);

    if (!imageToRemove?.startsWith("/uploads/kitchens/")) return;

    const res = await fetch("/kapi/admin/uploads/kitchens", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath: imageToRemove }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setImages(currentImages => {
        const restoredImages = [...currentImages];
        restoredImages.splice(index, 0, imageToRemove);
        return restoredImages;
      });
      toast.error(payload.error || "Failed to delete image");
      return;
    }

    toast.success("Image removed");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      slug: slugVal,
      description: fd.get("description") as string,
      category: fd.get("category") as string,
      style: fd.get("style") as string,
      material: fd.get("material") as string,
      priceFrom: Number(fd.get("priceFrom")) || 0,
      priceTo: fd.get("priceTo") ? Number(fd.get("priceTo")) : null,
      features,
      images,
      mainImage: images[0] ?? "",
      seoTitle: (fd.get("seoTitle") as string) || null,
      seoDescription: (fd.get("seoDescription") as string) || null,
      published: fd.get("published") === "on",
    };

    try {
      const url = kitchen ? `/kapi/admin/kitchens/${kitchen.id}` : "/kapi/admin/kitchens";
      const method = kitchen ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(kitchen ? "Changes saved" : "Kitchen created");
        router.push("/admin/kitchens");
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Save failed");
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-12">
      <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
        <h2 className="font-bold text-base border-b border-border pb-3">Main Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={kitchen?.title}
              required
              className="mt-1.5"
              placeholder="Corner kitchens"
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={slugVal}
              onChange={e => setSlugVal(e.target.value)}
              required
              className="mt-1.5 font-mono text-sm"
              placeholder="corner-kitchens"
            />
            <p className="text-xs text-muted-foreground mt-1">
              /catalog/<span className="text-foreground font-mono">{slugVal || "..."}</span>
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={kitchen?.description}
            className="mt-1.5 min-h-[110px] resize-y"
            placeholder="Describe this kitchen category..."
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={kitchen?.category}
              className="mt-1.5 w-full rounded-lg border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">-- select --</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="style">Style</Label>
            <Input id="style" name="style" defaultValue={kitchen?.style} className="mt-1.5" placeholder="Modern, classic..." />
          </div>
          <div>
            <Label htmlFor="material">Facade Material</Label>
            <Input id="material" name="material" defaultValue={kitchen?.material} className="mt-1.5" placeholder="MDF, plastic, veneer..." />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Price</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priceFrom">Price From (BYN) *</Label>
            <div className="relative mt-1.5">
              <Input id="priceFrom" name="priceFrom" type="number" defaultValue={kitchen?.priceFrom || ""} required min={0} placeholder="1200" className="pr-14" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">BYN</span>
            </div>
          </div>
          <div>
            <Label htmlFor="priceTo">Price To (BYN)</Label>
            <div className="relative mt-1.5">
              <Input id="priceTo" name="priceTo" type="number" defaultValue={kitchen?.priceTo ?? ""} min={0} placeholder="Optional" className="pr-14" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">BYN</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Features</h2>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {features.length === 0 && <p className="text-sm text-muted-foreground italic">No features yet</p>}
          {features.map((feature, index) => (
            <span key={index} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-800 text-sm px-3 py-1.5 rounded-full">
              {feature}
              <button type="button" onClick={() => setFeatures(features.filter((_, itemIndex) => itemIndex !== index))} className="text-violet-400 hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={e => setNewFeature(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="Type feature and press Enter..."
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addFeature} className="shrink-0">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">Images</h2>
        <p className="text-sm text-muted-foreground">
          The first image is the cover. You can still add manual URLs and now also upload files from your device.
        </p>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingImages}>
            {uploadingImages ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
            {uploadingImages ? "Uploading..." : "Upload Photos"}
          </Button>
          <p className="text-xs text-muted-foreground self-center">PNG, JPG, WEBP, GIF up to 8 MB per file</p>
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Add image URLs or upload kitchen photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted">
                <img
                  src={img}
                  alt={`Kitchen image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {index === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-medium">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void removeImageAt(index)}
                  className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 text-xs text-white bg-black/40 px-1.5 py-0.5 rounded">
                  {index + 1}/{images.length}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={e => setNewImage(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
            placeholder="https://example.com/kitchen-photo.jpg"
            className="flex-1 font-mono text-sm"
            type="text"
          />
          <Button type="button" variant="outline" onClick={addImage} className="shrink-0">
            <ImageIcon className="w-4 h-4 mr-1" />
            Add URL
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <h2 className="font-bold text-base border-b border-border pb-3">SEO</h2>
        <div>
          <Label htmlFor="seoTitle">Page Title</Label>
          <Input id="seoTitle" name="seoTitle" defaultValue={kitchen?.seoTitle ?? ""} className="mt-1.5" maxLength={70} />
        </div>
        <div>
          <Label htmlFor="seoDescription">Meta Description</Label>
          <Textarea id="seoDescription" name="seoDescription" defaultValue={kitchen?.seoDescription ?? ""} className="mt-1.5" rows={3} maxLength={160} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Publication</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {kitchen?.published ? "Visible on the site" : "Draft"}
          </p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="text-sm font-medium text-muted-foreground">{kitchen?.published ? "Published" : "Draft"}</span>
          <input type="checkbox" id="published" name="published" defaultChecked={kitchen?.published} className="w-5 h-5 accent-violet-600" />
        </label>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }} className="text-white px-8">
          {loading ? "Saving..." : kitchen ? "Save Changes" : "Create Kitchen"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
