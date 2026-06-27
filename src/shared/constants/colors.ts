export const colors = {
    // Primary - Health & Growth
    warmGreen: {
        base: "warm-green",
        text: "text-warm-green",
        textDark: "text-warm-green-dark",
        bg: "bg-warm-green",
        border: "border-warm-green",
        borderLight: "border-warm-green/20",
        gradient: "from-warm-green to-warm-green-light",
        lightGradient: "from-warm-green/10 to-warm-green/5",
        hoverLightGradient: "group-hover:from-warm-green/20 group-hover:to-warm-green/10",
    },
    // Secondary - Trust & Social
    tealBlue: {
        base: "teal-blue",
        text: "text-teal-blue",
        textDark: "text-teal-blue-dark",
        bg: "bg-teal-blue",
        border: "border-teal-blue",
        borderLight: "border-teal-blue/20",
        gradient: "from-teal-blue to-teal-blue-light",
        lightGradient: "from-teal-blue/10 to-teal-blue/5",
        hoverLightGradient: "group-hover:from-teal-blue/20 group-hover:to-teal-blue/10",
    },
    // Action - Food & Hunger
    goldenOrange: {
        base: "golden-orange",
        text: "text-golden-orange-dark",
        textDark: "text-golden-orange-dark",
        bg: "bg-golden-orange",
        border: "border-golden-orange",
        borderLight: "border-golden-orange/20",
        gradient: "from-golden-orange to-golden-orange-light",
        lightGradient: "from-golden-orange/10 to-golden-orange/5",
        hoverLightGradient: "group-hover:from-golden-orange/20 group-hover:to-golden-orange/10",
    },
    // Accent - Development & Education
    pharaohGold: {
        base: "pharaoh-gold",
        text: "text-pharaoh-gold",
        textDark: "text-pharaoh-gold",
        bg: "bg-pharaoh-gold",
        border: "border-pharaoh-gold",
        borderLight: "border-pharaoh-gold/20",
        gradient: "from-pharaoh-gold to-golden-orange",
        lightGradient: "from-pharaoh-gold/10 to-pharaoh-gold/5",
        hoverLightGradient: "group-hover:from-pharaoh-gold/20 group-hover:to-pharaoh-gold/10",
    },
    // Auxiliary
    amber: {
        base: "royal-amber",
        text: "text-royal-amber",
        textDark: "text-royal-amber",
        bg: "bg-royal-amber",
        border: "border-royal-amber",
        borderLight: "border-royal-amber/20",
        gradient: "from-royal-amber to-royal-amber-light",
        lightGradient: "from-royal-amber/10 to-royal-amber/5",
        hoverLightGradient: "group-hover:from-royal-amber/20 group-hover:to-royal-amber/10",
    },
    cyan: {
        base: "vibrant-cyan",
        text: "text-vibrant-cyan",
        textDark: "text-vibrant-cyan",
        bg: "bg-vibrant-cyan",
        border: "border-vibrant-cyan",
        borderLight: "border-vibrant-cyan/20",
        gradient: "from-vibrant-cyan to-vibrant-cyan-light",
        lightGradient: "from-vibrant-cyan/10 to-vibrant-cyan/5",
        hoverLightGradient: "group-hover:from-vibrant-cyan/20 group-hover:to-vibrant-cyan/10",
    },
    emerald: {
        base: "emerald-green",
        text: "text-emerald-green",
        textDark: "text-emerald-green",
        bg: "bg-emerald-green",
        border: "border-emerald-green",
        borderLight: "border-emerald-green/20",
        gradient: "from-emerald-green to-emerald-green-light",
        lightGradient: "from-emerald-green/10 to-emerald-green/5",
        hoverLightGradient: "group-hover:from-emerald-green/20 group-hover:to-emerald-green/10",
    },
};

export const partnerTypeColors: Record<string, typeof colors.warmGreen> = {
    "عامة": colors.warmGreen,
    "صحية": colors.emerald,
    "غذائية": colors.goldenOrange,
    "اجتماعية": colors.tealBlue,
    "تنموية": colors.amber,
};

export const storyCategoryColors: Record<string, typeof colors.warmGreen> = {
    "رعاية صحية": colors.warmGreen,
    "دعم تعليمي": colors.amber,
    "دعم غذائي": colors.goldenOrange,
};
