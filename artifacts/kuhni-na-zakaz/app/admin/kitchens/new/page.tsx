import type { Metadata } from "next";
import { KitchenForm } from "@/components/admin/KitchenForm";

export const metadata: Metadata = { title: "Новая кухня" };

export default function NewKitchenPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Добавить кухню</h1>
      <KitchenForm />
    </div>
  );
}
