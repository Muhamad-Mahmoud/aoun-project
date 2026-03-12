import { z } from "zod";

/**
 * Schema aligned with official API documentation
 * Source: POST /api/Requests - CreateAssistanceRequestDto
 */
export const baseRequestFormSchema = z.object({
    // ===== Core Data =====
    requestType: z.coerce.number()
        .min(0, "يرجى اختيار نوع الطلب")
        .max(6, "نوع طلب غير صحيح"),
    otherRequestType: z.string().optional(),
    description: z.string().min(20, "الشرح يجب أن يكون 20 حرفاً على الأقل").max(1000, "الشرح يجب ألا يتجاوز 1000 حرف"),

    // ===== Employment Data =====
    isWorking: z.boolean(),
    workingType: z.coerce.number().optional(),  // 0=FullTime, 1=PartTime, 2=Contract, 3=Freelance, 4=Internship
    employmentType: z.coerce.number().optional(),  // 0=Private, 1=Public, 2=NonProfit, 3=SelfEmployed
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    salaryMonthly: z.coerce.number().optional().nullable(),
    workDescription: z.string().optional(),
    unEmploymentReason: z.string().optional(),

    // Missing fields collected in UI
    yearsAtJob: z.coerce.number().optional().nullable(),
    estimatedIncomeMonthly: z.coerce.number().optional().nullable(),
    isLookingForJob: z.boolean().optional().default(false),
    needsTraining: z.boolean().optional().default(false),
    workLocation: z.string().optional(),

    // ===== Health Data =====
    hasInsurance: z.boolean(),
    insuranceType: z.string().optional(),
    hasDisability: z.boolean(),
    disabilityType: z.string().optional(),
    hasChronicDisease: z.boolean(),
    chronicDiseaseType: z.string().optional(),
    medicalCostMonthly: z.coerce.number().optional().nullable(),

    // ===== Living Condition =====
    housingType: z.coerce.number()
        .min(0, "يرجى اختيار نوع السكن")
        .max(4, "نوع سكن غير صحيح"),
    rentMonthly: z.coerce.number().optional().nullable(),
    hasCar: z.boolean(),
    monthlyExpenses: z.coerce.number().min(0, "المصاريف يجب أن تكون 0 أو أكثر"),
    utilitiesMonthly: z.coerce.number().min(0, "فواتير الخدمات يجب أن تكون 0 أو أكثر"),

    // Legacy/Commitment fields found in Swagger
    hasOtherCommitments: z.boolean().optional().default(false),
    otherCommitmentsType: z.string().optional(),
    otherCommitmentsAmount: z.coerce.number().optional().nullable(),
    householdMonthlySpending: z.coerce.number().min(0, "إجمالي الإنفاق يجب أن يكون 0 أو أكثر"),
    annualPayment: z.coerce.number().min(0, "الأقساط السنوية يجب أن تكون 0 أو أكثر"),

    // ===== Social Support & Other Aid =====
    registeredSocialSupport: z.boolean(),
    socialSupportAmount: z.coerce.number().optional().nullable(),
    otherAidProviders: z.string().optional(),
    otherAidType: z.string().optional(),
    otherAidAmount: z.coerce.number().optional().nullable(),

    // ===== Additional fields for frontend =====
    location: z.string()
        .min(2, "يرجى تحديد المدينة أو الحي السكني"),
    
    // ===== Attachments (optional) =====
    attachments: z.array(z.instanceof(File)).optional().default([]),
});

/**
 * Derived type for the form data.
 */
export type RequestFormData = z.infer<typeof baseRequestFormSchema>;

/**
 * Step-specific validation schemas for multi-step form
 */

// Step 0: Basic Request Info
export const step0Schema = baseRequestFormSchema.pick({
    requestType: true,
    otherRequestType: true,
    description: true,
}).superRefine((data, ctx) => {
    // Only validate Step 0 rules
    if (data.requestType === 6 && (!data.otherRequestType || data.otherRequestType.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["otherRequestType"],
            message: "يرجى ذكر نوع المساعدة الأخرى"
        });
    }
});

// Step 1: Employment & Location
export const step1Schema = baseRequestFormSchema.pick({
    location: true,
    isWorking: true,
    workingType: true,
    employmentType: true,
    jobTitle: true,
    company: true,
    salaryMonthly: true,
    workDescription: true,
    unEmploymentReason: true,
    yearsAtJob: true,
    estimatedIncomeMonthly: true,
    isLookingForJob: true,
    needsTraining: true,
    workLocation: true,
}).superRefine((data, ctx) => {
    // Required field
    if (!data.location || data.location.trim() === "") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["location"], message: "يرجى تحديد المدينة أو الحي السكني" });
    }

    // IsWorking conditional rules
    if (data.isWorking) {
        if (!data.jobTitle || data.jobTitle.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["jobTitle"], message: "المسمى الوظيفي مطلوب" });
        }
        if (!data.company || data.company.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["company"], message: "جهة العمل مطلوبة" });
        }
        if (data.salaryMonthly === undefined || data.salaryMonthly === null || data.salaryMonthly <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["salaryMonthly"], message: "الراتب الشهري مطلوب وأكبر من صفر" });
        }
        if (data.workingType === undefined || data.workingType === null || data.workingType < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workingType"], message: "نمط العمل مطلوب" });
        }
        if (data.employmentType === undefined || data.employmentType === null || data.employmentType < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["employmentType"], message: "القطاع مطلوب" });
        }
        if (!data.workDescription || data.workDescription.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workDescription"], message: "وصف طبيعة العمل مطلوب" });
        }
    } else {
        if (!data.unEmploymentReason || data.unEmploymentReason.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["unEmploymentReason"], message: "سبب عدم العمل مطلوب" });
        }
    }
});

// Step 2: Health
export const step2Schema = baseRequestFormSchema.pick({
    hasInsurance: true,
    insuranceType: true,
    hasDisability: true,
    disabilityType: true,
    hasChronicDisease: true,
    chronicDiseaseType: true,
    medicalCostMonthly: true,
}).superRefine((data, ctx) => {
    if (data.hasInsurance && (!data.insuranceType || data.insuranceType.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["insuranceType"], message: "نوع التأمين مطلوب" });
    }

    if (data.hasDisability && (!data.disabilityType || data.disabilityType.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["disabilityType"], message: "نوع الإعاقة مطلوب" });
    }

    if (data.hasChronicDisease) {
        if (!data.chronicDiseaseType || data.chronicDiseaseType.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["chronicDiseaseType"], message: "نوع المرض المزمن مطلوب" });
        }
        if (data.medicalCostMonthly === undefined || data.medicalCostMonthly === null || data.medicalCostMonthly < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["medicalCostMonthly"], message: "تكلفة العلاج الشهرية مطلوبة" });
        }
    }
});

// Step 3: Financial
export const step3Schema = baseRequestFormSchema.pick({
    housingType: true,
    rentMonthly: true,
    hasCar: true,
    monthlyExpenses: true,
    utilitiesMonthly: true,
    hasOtherCommitments: true,
    otherCommitmentsType: true,
    otherCommitmentsAmount: true,
    householdMonthlySpending: true,
    annualPayment: true,
    registeredSocialSupport: true,
    socialSupportAmount: true,
    otherAidProviders: true,
    otherAidType: true,
    otherAidAmount: true,
}).superRefine((data, ctx) => {
    // HousingType required
    if (data.housingType !== undefined && data.housingType !== null) {
        // Validate based on housing type
        if (data.housingType === 1 && (data.rentMonthly === undefined || data.rentMonthly === null || data.rentMonthly <= 0)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rentMonthly"], message: "الإيجار الشهري مطلوب" });
        }
    }

    if (data.registeredSocialSupport && (data.socialSupportAmount === undefined || data.socialSupportAmount === null || data.socialSupportAmount <= 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["socialSupportAmount"], message: "مبلغ الدعم الاجتماعي مطلوب" });
    }

    // HasOtherCommitments conditional rules
    if (data.hasOtherCommitments) {
        if (!data.otherCommitmentsType || data.otherCommitmentsType.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherCommitmentsType"], message: "نوع الالتزام مطلوب" });
        }
        if (data.otherCommitmentsAmount === undefined || data.otherCommitmentsAmount === null || data.otherCommitmentsAmount <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherCommitmentsAmount"], message: "مبلغ الالتزام مطلوب" });
        }
    }

    // Other Aid: if any field filled, all must be filled
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

// Step 4: Attachments (no validation needed)

// Full schema for final submission (validates all steps together)
export const requestFormSchema = baseRequestFormSchema.superRefine((data, ctx) => {
    // 1️⃣ RequestType == 6 (Other) -> OtherRequestType required
    if (data.requestType === 6 && (!data.otherRequestType || data.otherRequestType.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["otherRequestType"],
            message: "يرجى ذكر نوع المساعدة الأخرى"
        });
    }

    // 2️⃣ IsWorking == true -> JobTitle, Company, SalaryMonthly, WorkingType, EmploymentType, WorkDescription required
    if (data.isWorking) {
        if (!data.jobTitle || data.jobTitle.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["jobTitle"], message: "المسمى الوظيفي مطلوب" });
        }
        if (!data.company || data.company.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["company"], message: "جهة العمل مطلوبة" });
        }
        if (data.salaryMonthly === undefined || data.salaryMonthly === null || data.salaryMonthly <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["salaryMonthly"], message: "الراتب الشهري مطلوب وأكبر من صفر" });
        }
        if (data.workingType === undefined || data.workingType === null || data.workingType < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workingType"], message: "نمط العمل مطلوب" });
        }
        if (data.employmentType === undefined || data.employmentType === null || data.employmentType < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["employmentType"], message: "القطاع مطلوب" });
        }
        if (!data.workDescription || data.workDescription.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["workDescription"], message: "وصف طبيعة العمل مطلوب" });
        }
    } 
    // 3️⃣ IsWorking == false -> UnemploymentReason required
    else {
        if (!data.unEmploymentReason || data.unEmploymentReason.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["unEmploymentReason"], message: "سبب عدم العمل مطلوب" });
        }
    }

    // 4️⃣ HasInsurance == true -> InsuranceType required
    if (data.hasInsurance && (!data.insuranceType || data.insuranceType.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["insuranceType"], message: "نوع التأمين مطلوب" });
    }

    // 5️⃣ HasDisability == true -> DisabilityType required
    if (data.hasDisability && (!data.disabilityType || data.disabilityType.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["disabilityType"], message: "نوع الإعاقة مطلوب" });
    }

    // 6️⃣ HasChronicDisease == true -> ChronicDiseaseType & MedicalCostMonthly required
    if (data.hasChronicDisease) {
        if (!data.chronicDiseaseType || data.chronicDiseaseType.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["chronicDiseaseType"], message: "نوع المرض المزمن مطلوب" });
        }
        if (data.medicalCostMonthly === undefined || data.medicalCostMonthly === null || data.medicalCostMonthly < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["medicalCostMonthly"], message: "تكلفة العلاج الشهرية مطلوبة" });
        }
    }

    // 7️⃣ HousingType == 1 (Rented) -> RentMonthly required
    if (data.housingType === 1 && (data.rentMonthly === undefined || data.rentMonthly === null || data.rentMonthly <= 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rentMonthly"], message: "الإيجار الشهري مطلوب" });
    }

    // 8️⃣ RegisteredSocialSupport == true -> SocialSupportAmount required
    if (data.registeredSocialSupport && (data.socialSupportAmount === undefined || data.socialSupportAmount === null || data.socialSupportAmount <= 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["socialSupportAmount"], message: "مبلغ الدعم الاجتماعي مطلوب" });
    }

    // 8.5️⃣ HasOtherCommitments == true -> OtherCommitmentsType & OtherCommitmentsAmount required
    if (data.hasOtherCommitments) {
        if (!data.otherCommitmentsType || data.otherCommitmentsType.trim() === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherCommitmentsType"], message: "نوع الالتزام مطلوب" });
        }
        if (data.otherCommitmentsAmount === undefined || data.otherCommitmentsAmount === null || data.otherCommitmentsAmount <= 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherCommitmentsAmount"], message: "مبلغ الالتزام مطلوب" });
        }
    }

    // 9️⃣ Other Aid: if any field filled, all must be filled
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
 * Map of step schemas for validation
 */
export const stepSchemas: Record<number, z.ZodSchema> = {
    0: step0Schema,
    1: step1Schema,
    2: step2Schema,
    3: step3Schema,
    // Step 4 has no validation
};

/**
 * Default values for the form.
 * Aligned with API nullable fields.
 */
export const defaultFormValues: RequestFormData = {
    requestType: 0,
    otherRequestType: "",
    description: "",
    isWorking: false,
    workingType: 0,
    employmentType: 0,
    jobTitle: "",
    company: "",
    salaryMonthly: 0,
    workDescription: "",
    unEmploymentReason: "",
    hasInsurance: false,
    insuranceType: "",
    hasDisability: false,
    disabilityType: "",
    hasChronicDisease: false,
    chronicDiseaseType: "",
    medicalCostMonthly: 0,
    housingType: 0,
    rentMonthly: 0,
    hasCar: false,
    monthlyExpenses: 0,
    utilitiesMonthly: 0,
    registeredSocialSupport: false,
    socialSupportAmount: 0,
    otherAidProviders: "",
    otherAidType: "",
    otherAidAmount: 0,
    location: "",
    attachments: [],
    
    // Default values for missing fields
    yearsAtJob: 0,
    estimatedIncomeMonthly: 0,
    isLookingForJob: false,
    needsTraining: false,
    workLocation: "",

    // Default values for commitments
    hasOtherCommitments: false,
    otherCommitmentsType: "",
    otherCommitmentsAmount: 0,
    householdMonthlySpending: 0,
    annualPayment: 0,
};

/**
 * Per-step field names for client-side validation.
 * Only includes fields that are rendered in the UI.
 */
export const stepFieldNames: Record<number, (keyof RequestFormData)[]> = {
    0: ["requestType", "otherRequestType", "description"],
    1: [
        "location", "isWorking", "workingType", "employmentType",
        "jobTitle", "company", "salaryMonthly", "workDescription",
        "unEmploymentReason"
    ],
    2: [
        "hasInsurance", "insuranceType", "hasDisability",
        "disabilityType", "hasChronicDisease", "chronicDiseaseType",
        "medicalCostMonthly"
    ],
    3: [
        "housingType", "rentMonthly", "hasCar", "monthlyExpenses",
        "utilitiesMonthly", "householdMonthlySpending", "annualPayment",
        "hasOtherCommitments", "otherCommitmentsType", "otherCommitmentsAmount",
        "registeredSocialSupport", "socialSupportAmount",
        "otherAidProviders", "otherAidType", "otherAidAmount"
    ],
    4: [], // Attachments - no validation needed
};
