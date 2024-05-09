export interface BadgeOption {
    type?: "success" | "error" | "info" | "warning" | "new";
    label?: string;
    noIcon?: boolean;
    small?: boolean;
    color?: string;
}
