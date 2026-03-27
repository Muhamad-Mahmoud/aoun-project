import { LucideIcon } from "lucide-react";

/**
 * Category definition for request types
 */
export interface RequestCategory {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
}

/**
 * Step definition for wizard progress
 */
export interface WizardStep {
    num: number;
    label: string;
    icon: LucideIcon;
}
