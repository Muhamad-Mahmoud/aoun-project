import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Home } from "lucide-react";

/**
 * Global 404 Not Found Page
 */
export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <h2 className="text-3xl font-bold">الصفحة غير موجودة</h2>
                    <p className="text-muted-foreground">
                        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
                    </p>
                </div>

                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="ml-2 h-5 w-5" />
                        العودة للصفحة الرئيسية
                    </Link>
                </Button>
            </div>
        </div>
    );
}
