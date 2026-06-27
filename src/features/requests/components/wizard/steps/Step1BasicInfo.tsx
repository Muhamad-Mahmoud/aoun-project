import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/utils";
import { RequestFormData } from "../schemas/requestSchema";
import { RequestCategory } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface Step1BasicInfoProps {
    control: Control<RequestFormData>;
    selectedRequestType: string;
    categories: RequestCategory[];
}

export function Step1BasicInfo({ control, selectedRequestType, categories }: Step1BasicInfoProps) {
    return (
        <div className="space-y-5">
            {/* Request Type Selection */}
            <FormField
                control={control}
                name="requestType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] font-bold text-foreground mb-2.5 inline-block">
                            تصنيف المساعدة المرجوة <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
                            {categories.map((cat) => {
                                const isActive = selectedRequestType === cat.value;
                                return (
                                    <motion.div
                                        key={cat.value}
                                        whileHover={!isActive ? { y: -2 } : {}}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => field.onChange(cat.value)}
                                        className={cn(
                                            "relative cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 text-center flex flex-col items-center justify-center gap-2 min-h-[80px] select-none group",
                                            isActive
                                                ? "border-emerald-500 bg-emerald-50/80 shadow-sm"
                                                : "border-border bg-card hover:border-slate-300 hover:bg-muted/80"
                                        )}
                                    >
                                        {/* Active ring dot */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.span
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                                                >
                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        <span className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                                            isActive ? "bg-emerald-100 text-primary" : `${cat.bg} ${cat.color} group-hover:opacity-90`
                                        )}>
                                            <cat.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                                        </span>
                                        <p className={cn(
                                            "font-bold text-[12px] leading-tight",
                                            isActive ? "text-emerald-700" : "text-muted-foreground"
                                        )}>
                                            {cat.label}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <FormMessage className="mt-1.5" />
                    </FormItem>
                )}
            />

            <AnimatePresence mode="wait">
                {selectedRequestType === "Other" && (
                    <motion.div
                        key="other"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <FormField
                            control={control}
                            name="otherRequestType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-foreground mb-1.5 inline-block">
                                        توضيح نوع المساعدة <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="يرجى وصف نوع المساعدة بدقة..."
                                            className="rounded-xl min-h-[80px] text-[14px] border border-border bg-card focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 transition-all resize-none px-4 py-3 placeholder:text-muted-foreground"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs mt-1" />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Description */}
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem className="text-start">
                        <FormLabel className="text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-2">
                            <span className="w-1 h-4 bg-warm-green rounded-full inline-block" />
                            شرح الحالة بالتفصيل <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Textarea
                                    placeholder="اشرح حالتك هنا بالتفصيل (متى بدأت المشكلة، ما هي الاحتياجات، وكيف نساعدك)..."
                                    className="min-h-[120px] text-[14px] rounded-xl p-4 border-border bg-card focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 transition-all resize-none leading-relaxed placeholder:text-muted-foreground"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                                <div className="absolute left-3 bottom-2.5 pointer-events-none">
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                        (field.value?.length || 0) > 1800 ? "bg-rose-100 text-rose-500" : "bg-muted/50 text-muted-foreground"
                                    )}>
                                        {field.value?.length || 0} / 2000
                                    </span>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage className="text-rose-500 text-xs mt-1" />
                    </FormItem>
                )}
            />
        </div>
    );
}
