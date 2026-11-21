/**
 * SALON DETAILS
 * ------------
 * These are the only places you need to edit the salon's public information.
 */
export const SALON = {
  name: "Stylevique",
  tagline: "Salon & Beauty Studio",
  description:
    "A calm, considered beauty studio for hair, skin and the small rituals that make you feel like yourself again.",
  phone: "+1 (415) 555-0148",
  email: "hello@stylevique.com",
  address: ["214 Linden Avenue", "Suite 3", "San Francisco, CA 94110"],
  openingHours: [
    { days: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
    { days: "Saturday", hours: "9:00 AM – 6:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Pinterest", href: "https://www.pinterest.com/" },
  ],
} as const;

/**
 * Homepage hero background.
 *
 * It defaults to the bundled salon photograph, but any public image URL can be
 * used instead by setting NEXT_PUBLIC_HERO_IMAGE_URL in the environment.
 */
export const HERO_IMAGE_SRC =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL?.trim() ||
  "/images/banners/hero-section.png";

/** Salon photography used in the customer dashboard banner. */
export const CUSTOMER_HERO_IMAGE = "/images/banners/image10.png";

/**
 * Main navigation links. They are shared by the desktop navbar and the
 * mobile menu so both stay in sync.
 */
export const MAIN_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Editorial categories shown on the homepage. Each one opens the filtered
 * services page. These labels must match the categories saved by the admin. */
export const FEATURED_CATEGORIES = [
  { name: "Haircut & Styling", blurb: "Shape, movement and finish.", number: "01" },
  { name: "Hair Coloring", blurb: "Tone, depth and dimension.", number: "02" },
  { name: "Hair Treatment", blurb: "Repair and lasting softness.", number: "03" },
  { name: "Facial & Skincare", blurb: "A clearer, calmer complexion.", number: "04" },
  { name: "Makeup", blurb: "Considered looks for real moments.", number: "05" },
  { name: "Manicure & Pedicure", blurb: "Precise details, beautifully kept.", number: "06" },
  { name: "Spa & Massage", blurb: "Space to slow down and reset.", number: "07" },
] as const;

/**
 * The backend accepts appointments from 09:00 to 18:30 in 30-minute steps.
 * Keeping this list here lets the booking form and documentation share it.
 */
export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
] as const;

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const TRANSACTION_STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
] as const;
