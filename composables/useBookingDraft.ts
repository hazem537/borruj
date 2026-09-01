import { useState } from "#imports";

export interface BookingDraftItem {
  priceItemId?: string;
  name: string;
  nameEn?: string;
  permitNumber: string;
  priceSar?: number;
  unit?: string;
  unitEn?: string;
  city?: string;
  cityEn?: string;
}

export const useBookingDraft = () => {
  const draft = useState<BookingDraftItem | null>("booking_draft_item", () => null);
  const isDraftActive = useState<boolean>("booking_draft_active", () => false);

  const setDraft = (item: BookingDraftItem, options?: { scroll?: boolean }) => {
    draft.value = { ...item };
    isDraftActive.value = true;

    if (options?.scroll === false || typeof window === "undefined") return;

    const el = document.getElementById("contactUs");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigateTo("/#contactUs");
    }
  };

  const selectForBooking = (item: BookingDraftItem) => {
    setDraft(item, { scroll: true });
  };

  const clearDraft = () => {
    draft.value = null;
    isDraftActive.value = false;
  };

  return {
    draft,
    isDraftActive,
    setDraft,
    selectForBooking,
    clearDraft,
  };
};
