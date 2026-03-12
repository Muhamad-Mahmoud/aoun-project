import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/utils";
import { RequestFormData } from "../schemas/requestSchema";
import { RequestCategory } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface Step1BasicInfoProps {
    control: Control<RequestFormData>;
    selectedRequestType: number;
    categories: RequestCategory[];
}

export function Step1BasicInfo({ control, selectedRequestType, categories }: Step1BasicInfoProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
    };

    return (
        <div className="space-y-6">
            {/* Request Type Selection */}
            <FormField
                control={control}
                name="requestType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] font-bold text-slate-700 mb-3 inline-block">
                            تصنيف المساعدة المرجوة <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                        >
                            {categories.map((cat) => {
                                const isActive = selectedRequestType === cat.value;
                                return (
                                    <motion.div
                                        key={cat.value}
                                        variants={itemVariant}
                                        whileHover={!isActive ? { y: -2, scale: 1.01 } : {}}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => field.onChange(cat.value)}
                                        className={cn(
                                            "relative cursor-pointer rounded-2xl border-2 p-3 sm:p-4 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[90px] overflow-hidden group select-none",
                                            isActive
                                                ? `border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500/20`
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <motion.div 
                                            layout
                                            className={cn(
                                                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300 relative z-10",
                                                isActive ? "bg-emerald-100 text-emerald-600 shadow-sm" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600"
                                            )}
                                        >
                                            <cat.icon
                                                className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300"
                                            />
                                        </motion.div>
                                        <p
                                            className={cn(
                                                "font-bold text-xs sm:text-[13px] relative z-10 transition-colors duration-300",
                                                isActive ? "text-emerald-700" : "text-slate-600 group-hover:text-slate-800"
                                            )}
                                        >
                                            {cat.label}
                                        </p>
                                        
                                        {/* Active Checkmark Badge */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    className="absolute top-2.5 right-2.5"
                                                >
                                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Sub Category - Conditionals based on active category */}
            <AnimatePresence mode="wait">
            {selectedRequestType === 6 && (
                <motion.div
                    key="other"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-2"
                >
                    <FormField
                        control={control}
                        name="otherRequestType"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700 mb-2 inline-block">
                                    توضيح نوع المساعدة <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="يرجى وصف نوع المساعدة الأخرى بدقة..."
                                        className="rounded-xl min-h-[80px] text-[14px] border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm transition-all duration-300 resize-none px-4 py-3 placeholder:text-slate-400"
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
                    <FormItem className="text-start relative">
                        <FormLabel className="text-[14px] font-black text-slate-800 flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-3.5 bg-warm-green rounded-full" />
                            شرح الحالة بالتفصيل <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <div className="relative group">
                                <Textarea
                                    placeholder="اشرح حالتك هنا بالتفصيل (متى بدأت المشكلة، ما هي الاحتياجات الأساسية، وكيف يمكننا مساعدتك)..."
                                    className="min-h-[140px] text-[14px] rounded-[1.25rem] p-4 sm:p-5 border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-warm-green/10 focus:border-warm-green/40 font-medium transition-all duration-300 shadow-sm leading-relaxed resize-none"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                                <div className="absolute inset-x-4 bottom-3 flex justify-end pointer-events-none">
                                    <div className={cn(
                                        "text-[10px] font-bold px-2 py-1 rounded-md transition-colors backdrop-blur-sm",
                                        (field.value?.length || 0) > 1800 ? "bg-rose-100/80 text-rose-600" : "bg-slate-100/80 text-slate-400"
                                    )}>
                                        {(field.value?.length || 0)} / 2000
                                    </div>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage className="text-rose-500 font-medium mt-1.5 text-xs" />
                    </FormItem>
                )}
            />
        </div>
    );
}
