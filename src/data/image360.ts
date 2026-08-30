/**
 * image360.ts — Compatibility Layer forwarding to immersive-images.ts
 */

import {
  immersiveImages,
  getImmersiveImage,
  type ImmersiveImageEntry,
  type ImmersiveMode,
} from "@/data/immersive-images";
import type { Img } from "@/data/images";

export type ExperienceMode =
  ImmersiveMode | "true_360" | "extended_immersive" | "bounded_interactive" | "static_only";
export type ImageExperienceEntry = ImmersiveImageEntry;

export const imageExperienceRegistry = immersiveImages;
export const image360Registry = immersiveImages;
export const getImageExperience = getImmersiveImage;
export const getImage360 = getImmersiveImage;
