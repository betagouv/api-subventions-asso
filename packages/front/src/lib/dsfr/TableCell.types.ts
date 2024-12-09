import type { BadgeOption } from "./Badge.types";

export interface TableCell {
    desc?: string;
    title?: string;
    // <Badge> or <StatusLabel>
    badge?: BadgeOption | { status: string };
}
