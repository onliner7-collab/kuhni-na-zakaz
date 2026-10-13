import type { Layout } from "@/lib/calculator/config";
export function KitchenPlan({ layout, detailed = false }: { layout: Layout; detailed?: boolean }) {
  return <svg viewBox="0 0 240 150" aria-hidden="true" className={detailed ? "calc-plan calc-plan-large" : "calc-plan"}>
    <rect x="38" y="38" width="164" height="90" rx="8" fill="#f4f1eb" />
    <path d={layout === "straight" ? "M48 53H192" : layout === "corner" ? "M48 113V53H192" : "M48 113V53H192V113"} fill="none" stroke="#377367" strokeWidth="23" strokeLinejoin="round" />
    <path d="M38 22H202" stroke="#728079" strokeWidth="1.5" />
    <text x="120" y="15" textAnchor="middle" fill="#254b42" fontSize="14" fontWeight="700">А</text>
    {layout !== "straight" && <><path d="M20 38V125" stroke="#728079" strokeWidth="1.5" /><text x="8" y="86" textAnchor="middle" fill="#254b42" fontSize="14" fontWeight="700">Б</text></>}
    {layout === "u_shape" && <><path d="M221 38V125" stroke="#728079" strokeWidth="1.5" /><text x="232" y="86" textAnchor="middle" fill="#254b42" fontSize="14" fontWeight="700">В</text></>}
    <rect x="109" y="45" width="23" height="16" rx="3" fill="#fff" opacity=".8" />
    <circle cx="172" cy="53" r="6" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" />
  </svg>;
}
