import { CarouselOptions } from "@/types/carousel";

// 2 to demonstrate infinite scroll, should be higher in production
export const INFINITE_SCROLL_PAGINATION_RESULTS =
  process.env.NODE_ENV === "production" ? 10 : 4;

// embla carousel
export const OPTIONS: CarouselOptions = { align: "start", loop: true };
export const SLIDE_COUNT = 5;
export const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

// roles
export const normalRoles = ["STUDENT"];
export const privateRoles = ["ENTERPRISE", "ADMIN"];
export const adminRoles = ["ADMIN"];
