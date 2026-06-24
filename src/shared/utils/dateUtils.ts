import { formatDistanceToNow, format } from "date-fns";
import { ar } from "date-fns/locale";

export function formatRelativeTime(dateString: string | Date | undefined): string {
    if (!dateString) return "";
    try {
        const date = typeof dateString === "string" ? new Date(dateString) : dateString;
        
        // If it's more than a week ago, show the full date
        const now = new Date();
        const diffInDays = Math.abs((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays > 7) {
            return format(date, 'dd MMM yyyy - HH:mm', { locale: ar });
        }
        
        return formatDistanceToNow(date, { addSuffix: true, locale: ar });
    } catch (e) {
        return "";
    }
}
