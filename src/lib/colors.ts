export const colors = {
    emerald: {
        base: "emerald",
        text: "text-emerald-500",
        textDark: "text-emerald-600",
        bg: "bg-emerald-500",
        border: "border-emerald-500",
        borderLight: "border-emerald-500/20",
        gradient: "from-emerald-500 to-emerald-600",
        lightGradient: "from-emerald-500/10 to-emerald-500/5",
        hoverLightGradient: "group-hover:from-emerald-500/20 group-hover:to-emerald-500/10",
    },
    cyan: {
        base: "cyan",
        text: "text-cyan-500",
        textDark: "text-cyan-600",
        bg: "bg-cyan-500",
        border: "border-cyan-500",
        borderLight: "border-cyan-500/20",
        gradient: "from-cyan-500 to-cyan-600",
        lightGradient: "from-cyan-500/10 to-cyan-500/5",
        hoverLightGradient: "group-hover:from-cyan-500/20 group-hover:to-cyan-500/10",
    },
    orange: {
        base: "orange",
        text: "text-orange-400", // Adjusted to match previous 400 usage
        textDark: "text-orange-500",
        bg: "bg-orange-400",
        border: "border-orange-400",
        borderLight: "border-orange-400/20",
        gradient: "from-orange-400 to-orange-500",
        lightGradient: "from-orange-400/10 to-orange-400/5",
        hoverLightGradient: "group-hover:from-orange-400/20 group-hover:to-orange-400/10",
    },
    purple: {
        base: "purple",
        text: "text-purple-400", // Adjusted to match previous 400 usage
        textDark: "text-purple-500",
        bg: "bg-purple-400",
        border: "border-purple-400",
        borderLight: "border-purple-400/20",
        gradient: "from-purple-400 to-purple-500",
        lightGradient: "from-purple-400/10 to-purple-400/5",
        hoverLightGradient: "group-hover:from-purple-400/20 group-hover:to-purple-400/10",
    },
    warmGreen: {
        base: "warm-green",
        text: "text-warm-green",
        textDark: "text-emerald-700", // Fallback as warm-green-dark is not defined in config
        bg: "bg-warm-green",
        border: "border-warm-green",
        borderLight: "border-warm-green/20",
        gradient: "from-warm-green to-warm-green-light",
        lightGradient: "from-warm-green/10 to-warm-green/5",
        hoverLightGradient: "group-hover:from-warm-green/20 group-hover:to-warm-green/10",
    },
};

export const partnerTypeColors: Record<string, typeof colors.emerald> = {
    "عامة": colors.warmGreen,
    "صحية": colors.emerald,
    "غذائية": colors.orange,
    "اجتماعية": colors.cyan,
    "تنموية": colors.purple,
};

export const storyCategoryColors: Record<string, typeof colors.emerald> = {
    "رعاية صحية": colors.warmGreen,
    "دعم تعليمي": colors.purple,
    "دعم غذائي": colors.orange,
};
