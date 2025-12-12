export type AccountType = "individual" | "organization";

export interface FormData {
    accountType: AccountType;
    name: string;
    governorate: string;
    phone: string;
    email: string;
    repName: string;
    repJob: string;
    repEmail: string;
    repPhone: string;
    orgName: string;
    orgLegalName: string;
    orgAddress: string;
    orgGovernorate: string;
    isRegistered: "yes" | "no";
    registrationNumber: string;
    password: string;
    acceptTerms: boolean;
}

export interface FormErrors {
    [key: string]: string;
}

export const INITIAL_FORM_DATA: FormData = {
    accountType: "individual",
    name: "",
    governorate: "",
    phone: "",
    email: "",
    repName: "",
    repJob: "",
    repEmail: "",
    repPhone: "",
    orgName: "",
    orgLegalName: "",
    orgAddress: "",
    orgGovernorate: "",
    isRegistered: "yes",
    registrationNumber: "",
    password: "",
    acceptTerms: false,
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
    TERMS_REQUIRED: "يجب الموافقة على الشروط والأحكام",
    REP_NAME_REQUIRED: "اسم المسؤول مطلوب",
    JOB_REQUIRED: "الوظيفة مطلوبة",
    ORG_NAME_REQUIRED: "اسم الجمعية مطلوب",
    LEGAL_NAME_REQUIRED: "الاسم القانوني مطلوب",
    ADDRESS_REQUIRED: "العنوان مطلوب",
    REGISTRATION_NUMBER_REQUIRED: "رقم التسجيل مطلوب",
} as const;
