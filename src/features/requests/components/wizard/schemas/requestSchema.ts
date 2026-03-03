import { z } from "zod";

/**
 * Basic schema definition without refinements.
 * This ensures clean type inference for RequestFormData.
 */
export const baseRequestFormSchema = z.object({
    // Step 1: Basic Information
    requestType: z.coerce.number()
        .refine((val) => val !== undefined && val !== null && val >= 0, {
            message: "يرجى اختيار نوع الطلب (حقل إلزامي)"
        }),
    otherRequestType: z.string().optional(),
    description: z.string()
        .min(1, "وصف الطلب حقل إلزامي")
        .min(20, "يرجى كتابة وصف تفصيلي للحالة (20 حرف على الأقل)")
        .max(1000, "الوصف طويل جداً (الحد الأقصى 1000 حرف) - يجب أن يتوافق مع قواعد النظام"),

    // Step 2: Employment & Location
    isWorking: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "حالة العمل حقل إلزامي - يرجى تحديد نعم أو لا"
        }),
    workingType: z.coerce.number().optional(),
    employmentType: z.coerce.number().optional(),
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    location: z.string().min(1, "المدينة أو الحي السكني حقل إلزامي").min(2, "يرجى تحديد المدينة أو الحي السكني"),
    salaryMonthly: z.coerce.number().optional().nullable(),
    workDescription: z.string().optional(),
    workLocation: z.string().optional(),
    yearsAtJob: z.coerce.number().optional(),
    isLookingForJob: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "هل تبحث عن عمل؟ (حقل إلزامي) - يرجى تحديد نعم أو لا"
        }),
    needsTraining: z.boolean().optional(),
    estimatedIncomeMonthly: z.coerce.number().optional().nullable(),
    unEmploymentReason: z.string().optional(),

    // Step 3: Health Information
    hasInsurance: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "هل يوجد تأمين طبي؟ (حقل إلزامي) - يرجى تحديد نعم أو لا"
        }),
    insuranceType: z.string().optional(),
    hasDisability: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "هل يوجد إعاقة؟ (حقل إلزامي) - يرجى تحديد نعم أو لا"
        }),
    disabilityType: z.string().optional(),
    hasChronicDisease: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "هل يوجد أمراض مزمنة؟ (حقل إلزامي) - يرجى تحديد نعم أو لا"
        }),
    chronicDiseaseType: z.string().optional(),
    medicalCostMonthly: z.coerce.number().optional(),

    // Step 4: Financial & Housing
    housingType: z.coerce.number()
        .refine((val) => val !== undefined && val !== null, {
            message: "نوع السكن حقل إلزامي - يرجى اختيار نوع السكن"
        }),
    hasCar: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "يرجى تحديد هل تمتلك سيارة أم لا"
        }),
    rentMonthly: z.coerce.number().optional(),
    monthlyExpenses: z.coerce.number()
        .refine((val) => val !== undefined && val !== null, {
            message: "إجمالي المصاريف الشهرية حقل إلزامي"
        }),
    utilitiesMonthly: z.coerce.number()
        .refine((val) => val !== undefined && val !== null, {
            message: "تكلفة المرافق (كهرباء/مياه/غاز) حقل إلزامي"
        }),
    hasOtherCommitments: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "يرجى تحديد هل يوجد التزامات أخرى أم لا"
        }),
    otherCommitmentsType: z.string().optional(),
    otherCommitmentsAmount: z.coerce.number().optional(),
    householdMonthlySpending: z.coerce.number()
        .refine((val) => val !== undefined && val !== null, {
            message: "إجمالي إنفاق الأسرة الشهري حقل إلزامي"
        }),
    annualPayment: z.coerce.number()
        .refine((val) => val !== undefined && val !== null, {
            message: "المدفوعات السنوية الأخرى حقل إلزامي"
        }),
    registeredSocialSupport: z.boolean()
        .refine((val) => val !== undefined && val !== null, {
            message: "يرجى تحديد هل تستفيد من الضمان الاجتماعي أم لا"
        }),
    socialSupportAmount: z.coerce.number().optional(),
    otherAidProviders: z.string().optional(),
    otherAidType: z.string().optional(),
    otherAidAmount: z.coerce.number().optional(),
});

/**
 * Derived type for the form data.
 * Inferring from baseRequestFormSchema is more stable than refined schema.
 */
export type RequestFormData = z.infer<typeof baseRequestFormSchema>;

/**
 * Refined schema for validation.
 * Strictly enforcing Business Logic rules provided by the user.
 */
export const requestFormSchema = baseRequestFormSchema.superRefine((data, ctx) => {
    // 1️⃣ لو RequestType == 6 (Other) -> OtherRequestType required
    if (data.requestType === 6 && (!data.otherRequestType || data.otherRequestType.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["otherRequestType"],
            message: "يرجى ذكر نوع المساعدة الأخرى"
        });
    }

    // 2️⃣ لو IsWorking == true -> JobTitle, Company, SalaryMonthly, Location, WorkingType, EmploymentType, YearsAtJob required
    if (data.isWorking) {
        if (!data.jobTitle || data.jobTitle.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["jobTitle"], message: "المسمى الوظيفي مطلوب عند العمل" });
        }
        if (!data.company || data.company.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["company"], message: "جهة العمل مطلوبة عند العمل" });
        }
        if (data.salaryMonthly === undefined || data.salaryMonthly === null || data.salaryMonthly <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["salaryMonthly"], message: "الراتب الشهري مطلوب ويجب أن يكون أكبر من 0" });
        }
        if (!data.workingType || data.workingType <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workingType"], message: "نوع العمل مطلوب" });
        }
        if (!data.employmentType || data.employmentType <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["employmentType"], message: "طبيعة التوظيف مطلوبة" });
        }
        if (data.yearsAtJob === undefined || data.yearsAtJob === null) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["yearsAtJob"], message: "سنوات الخدمة مطلوبة" });
        }
        if (!data.workDescription || data.workDescription.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workDescription"], message: "وصف طبيعة العمل مطلوب" });
        }
    } 
    // 3️⃣ لو IsWorking == false -> UnemploymentReason required
    else {
        if (!data.unEmploymentReason || data.unEmploymentReason.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["unEmploymentReason"], message: "سبب عدم العمل مطلوب" });
        }
    }

    // 4️⃣ لو HasInsurance == true -> InsuranceType required
    if (data.hasInsurance && (!data.insuranceType || data.insuranceType.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["insuranceType"], message: "نوع التأمين مطلوب" });
    }

    // 5️⃣ لو HasDisability == true -> DisabilityType required
    if (data.hasDisability && (!data.disabilityType || data.disabilityType.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["disabilityType"], message: "نوع الإعاقة مطلوب" });
    }

    // 6️⃣ لو HasChronicDisease == true -> ChronicDiseaseType required, MedicalCostMonthly required
    if (data.hasChronicDisease) {
        if (!data.chronicDiseaseType || data.chronicDiseaseType.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["chronicDiseaseType"], message: "نوع المرض المزمن مطلوب" });
        }
        if (data.medicalCostMonthly === undefined || data.medicalCostMonthly === null || data.medicalCostMonthly < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["medicalCostMonthly"], message: "تكلفة العلاج الشهرية مطلوبة" });
        }
    }

    // 7️⃣ لو HousingType == 1 (إيجار) -> RentMonthly required
    if (data.housingType === 1 && (data.rentMonthly === undefined || data.rentMonthly === null || data.rentMonthly <= 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rentMonthly"], message: "قيمة الإيجار الشهري مطلوبة" });
    }

    // 8️⃣ لو HasOtherCommitments == true -> OtherCommitmentsType, OtherCommitmentsAmount required
    if (data.hasOtherCommitments) {
        if (!data.otherCommitmentsType || data.otherCommitmentsType.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherCommitmentsType"], message: "نوع الالتزام مطلوب" });
        }
        if (data.otherCommitmentsAmount === undefined || data.otherCommitmentsAmount === null || data.otherCommitmentsAmount <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherCommitmentsAmount"], message: "مبلغ الالتزام مطلوب" });
        }
    }

    // 9️⃣ لو RegisteredSocialSupport == true -> SocialSupportAmount required
    if (data.registeredSocialSupport && (data.socialSupportAmount === undefined || data.socialSupportAmount === null || data.socialSupportAmount <= 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["socialSupportAmount"], message: "مبلغ الدعم الاجتماعي مطلوب" });
    }

    // 🔟 Other Aid Validation (Cross-field dependency)
    // If any field is filled, all must be filled
    const hasOtherAidProvider = data.otherAidProviders && data.otherAidProviders.trim() !== "";
    const hasOtherAidType = data.otherAidType && data.otherAidType.trim() !== "";
    const hasOtherAidAmount = data.otherAidAmount !== undefined && data.otherAidAmount !== null && data.otherAidAmount > 0;

    if (hasOtherAidProvider || hasOtherAidType || hasOtherAidAmount) {
        if (!hasOtherAidProvider) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherAidProviders"], message: "جهة المساعدة مطلوبة" });
        }
        if (!hasOtherAidType) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherAidType"], message: "نوع المساعدة مطلوب" });
        }
        if (!hasOtherAidAmount) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherAidAmount"], message: "مبلغ المساعدة مطلوب" });
        }
    }
});

/**
 * Default values for the form.
 */
export const defaultFormValues: RequestFormData = {
    requestType: 0,
    description: "",
    otherRequestType: "",
    isWorking: false,
    location: "",
    jobTitle: "",
    company: "",
    salaryMonthly: null,
    workDescription: "",
    workLocation: "",
    yearsAtJob: undefined,
    isLookingForJob: false,
    needsTraining: undefined,
    estimatedIncomeMonthly: null,
    unEmploymentReason: "",
    hasInsurance: false,
    insuranceType: "",
    hasDisability: false,
    disabilityType: "",
    hasChronicDisease: false,
    chronicDiseaseType: "",
    medicalCostMonthly: undefined,
    housingType: 0,
    hasCar: false,
    rentMonthly: undefined,
    monthlyExpenses: 0,
    utilitiesMonthly: 0,
    hasOtherCommitments: false,
    otherCommitmentsType: "",
    otherCommitmentsAmount: undefined,
    householdMonthlySpending: 0,
    annualPayment: 0,
    registeredSocialSupport: false,
    socialSupportAmount: undefined,
    otherAidProviders: "",
    otherAidType: "",
    otherAidAmount: undefined,
};

/**
 * Per-step field names for step-level validation.
 * Used by the wizard to validate only the current step before navigating.
 */
export const stepFieldNames: Record<number, (keyof RequestFormData)[]> = {
    0: ["requestType", "otherRequestType", "description"],
    1: [
        "location", "isWorking", "workingType", "employmentType",
        "jobTitle", "company", "salaryMonthly", "workDescription",
        "workLocation", "yearsAtJob", "isLookingForJob", "needsTraining",
        "unEmploymentReason", "estimatedIncomeMonthly"
    ],
    2: [
        "hasInsurance", "insuranceType", "hasDisability",
        "disabilityType", "hasChronicDisease", "chronicDiseaseType",
        "medicalCostMonthly"
    ],
    3: [
        "housingType", "hasCar", "rentMonthly", "monthlyExpenses",
        "utilitiesMonthly", "hasOtherCommitments", "otherCommitmentsType",
        "otherCommitmentsAmount", "registeredSocialSupport",
        "socialSupportAmount", "otherAidProviders", "otherAidType",
        "otherAidAmount", "householdMonthlySpending", "annualPayment"
    ],
    4: [], // Attachments step — no form fields to validate
};
