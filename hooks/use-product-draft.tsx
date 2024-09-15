import { ProductFormValues } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/components/product-form";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UseProductDraftStore {
  product: ProductFormValues | null;
  onDraft: (value: ProductFormValues) => void;
  onClear: () => void;
}

export const useProductDraft = create(
  persist<UseProductDraftStore>(
    (set, get) => {
      return {
        product: null,
        onDraft: (value: ProductFormValues) => set({ product: value }),
        onClear: () => set({ product: null }),
      };
    },
    {
      name: "product-draft",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
