import type { SectorContent } from "./types";
import { GROUP_A } from "./a";
import { GROUP_B } from "./b";
import { GROUP_C } from "./c";

export type {
  Bilingual,
  SectorLeak,
  SectorLever,
  SectorFaq,
  SectorContent,
} from "./types";

export const SECTOR_CONTENT: Record<string, SectorContent> = {
  ...GROUP_A,
  ...GROUP_B,
  ...GROUP_C,
};
