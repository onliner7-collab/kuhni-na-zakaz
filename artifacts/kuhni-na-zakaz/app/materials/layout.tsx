import { MaterialsSelectionProvider } from "@/components/materials/MaterialsSelection";
export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MaterialsSelectionProvider>{children}</MaterialsSelectionProvider>;
}
