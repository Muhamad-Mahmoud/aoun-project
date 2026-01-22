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
    skyBlue: {
        base: "sky-blue",
        text: "text-sky-blue",
        textDark: "text-sky-blue-dark",
        bg: "bg-sky-blue",
        border: "border-sky-blue",
        borderLight: "border-sky-blue/20",
        gradient: "from-sky-blue to-sky-blue-light",
        lightGradient: "from-sky-blue/10 to-sky-blue/5",
        hoverLightGradient: "group-hover:from-sky-blue/20 group-hover:to-sky-blue/10",
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
        textDark: "text-pharaoh-gold", // Adjust if needed
        bg: "bg-pharaoh-gold",
        border: "border-pharaoh-gold",
        borderLight: "border-pharaoh-gold/20",
        gradient: "from-pharaoh-gold to-golden-orange",
        lightGradient: "from-pharaoh-gold/10 to-pharaoh-gold/5",
        hoverLightGradient: "group-hover:from-pharaoh-gold/20 group-hover:to-pharaoh-gold/10",
    },
    // Auxiliary - For feature variety
    purple: {
        base: "royal-purple",
        text: "text-royal-purple",
        textDark: "text-royal-purple",
        bg: "bg-royal-purple",
        border: "border-royal-purple",
        borderLight: "border-royal-purple/20",
        gradient: "from-royal-purple to-royal-purple-light",
        lightGradient: "from-royal-purple/10 to-royal-purple/5",
        hoverLightGradient: "group-hover:from-royal-purple/20 group-hover:to-royal-purple/10",
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
    "صحية": colors.emerald, // Medical often uses clean emerald
    "غذائية": colors.goldenOrange,
    "اجتماعية": colors.skyBlue,
    "تنموية": colors.purple, // Development fits purple
};

export const storyCategoryColors: Record<string, typeof colors.warmGreen> = {
    "رعاية صحية": colors.warmGreen,
    "دعم تعليمي": colors.purple,
    "دعم غذائي": colors.goldenOrange,
};
