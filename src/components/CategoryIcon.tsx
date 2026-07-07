import React from "react";
import {
  Apple,
  Baby,
  Beef,
  Boxes,
  Candy,
  Coffee,
  CupSoda,
  Croissant,
  Carrot,
  Droplet,
  Fish,
  HeartPulse,
  type LucideIcon,
  Milk,
  Package,
  PawPrint,
  Popcorn,
  Snowflake,
  Soup,
  SprayCan,
  UtensilsCrossed,
  Wheat,
  Wine,
} from "lucide-react";
import type { CategoriesType } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIconMap: Record<CategoriesType, LucideIcon> = {
  bakery: Croissant,
  vegetables: Carrot,
  fruits: Apple,
  meat: Beef,
  "milk-eggs-cheese": Milk,
  "water-juice": CupSoda,
  fish: Fish,
  drinks: Wine,
  "chips-snacks": Popcorn,
  sweets: Candy,
  frozen: Snowflake,
  "pasta-cereals-flour": Wheat,
  "oil-sauces-spices": Droplet,
  "tea-coffee-cocoa": Coffee,
  cleaning: SprayCan,
  "house-kitchen": UtensilsCrossed,
  "canned-food": Soup,
  "health-beauty": HeartPulse,
  "kids-parents": Baby,
  animals: PawPrint,
  else: Boxes,
};

const sizeClasses = {
  sm: "size-8 [&>svg]:size-4",
  lg: "size-20 [&>svg]:size-10",
} as const;

type Props = {
  category: string;
  size?: keyof typeof sizeClasses;
  className?: string;
};

const CategoryIcon: React.FC<Props> = ({
  category,
  size = "sm",
  className,
}) => {
  const Icon = categoryIconMap[category as CategoriesType] ?? Package;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl bg-primary text-accent-ink",
        sizeClasses[size],
        className,
      )}
    >
      <Icon aria-hidden="true" />
    </span>
  );
};

export default CategoryIcon;
