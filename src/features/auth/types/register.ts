/**
 * Register Form Types
 */

export type AccountType = "individual" | "organization" | "donor";

export interface FormData {
    // Common
    accountType: AccountType;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    country: string;
    city: string;
    governorate: string;
    acceptTerms: boolean;

    // Family Specific
    firstName: string;
    lastName: string;
    headNationalId: string;
    neighborhood: string;

    // Association Specific
    name: string; // Association Name
    capacity: string; // Will convert to number on submit
    coverageNotes: string;
}

export interface FormErrors {
    [key: string]: string;
}

export const INITIAL_FORM_DATA: FormData = {
    accountType: "individual",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "Egypt", // Default
    city: "",
    governorate: "",
    acceptTerms: false,

    // Family
    firstName: "",
    lastName: "",
    headNationalId: "",
    neighborhood: "",

    // Association
    name: "",
    capacity: "",
    coverageNotes: "",
};

export const ERROR_MESSAGES = {
    REQUIRED: "هذا الحقل مطلوب",
    NAME_REQUIRED: "الاسم مطلوب",
    GOVERNORATE_REQUIRED: "المحافظة مطلوبة",
    PHONE_REQUIRED: "رقم الهاتف مطلوب",
    PHONE_INVALID: "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم",
    EMAIL_REQUIRED: "البريد الإلكتروني مطلوب",
    EMAIL_INVALID: "بريد إلكتروني غير صالح",
    PASSWORD_SHORT: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    PASSWORD_MISMATCH: "كلمة المرور غير متطابقة",
    TERMS_REQUIRED: "يجب الموافقة على الشروط والأحكام",
    ORG_NAME_REQUIRED: "اسم الجمعية مطلوب",
    NATIONAL_ID_REQUIRED: "الرقم القومي مطلوب",
    NATIONAL_ID_INVALID: "الرقم القومي يجب أن يتكون من 14 رقم",
} as const;
