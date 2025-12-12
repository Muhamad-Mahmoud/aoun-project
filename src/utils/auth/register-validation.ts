import { FormData, FormErrors, ERROR_MESSAGES } from "@/types/auth/register";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^01[0-9]{9}$/;

export const validateIndividualStep1 = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) errors.name = ERROR_MESSAGES.NAME_REQUIRED;
    if (!formData.governorate.trim()) errors.governorate = ERROR_MESSAGES.GOVERNORATE_REQUIRED;

    if (!formData.phone.trim()) {
        errors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!PHONE_REGEX.test(formData.phone)) {
        errors.phone = ERROR_MESSAGES.PHONE_INVALID;
    }

    if (!formData.email.trim()) {
        errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!EMAIL_REGEX.test(formData.email)) {
        errors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    return errors;
};

export const validateSecurityStep = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.password || formData.password.length < 8) {
        errors.password = ERROR_MESSAGES.PASSWORD_SHORT;
    }
    if (!formData.acceptTerms) {
        errors.acceptTerms = ERROR_MESSAGES.TERMS_REQUIRED;
    }

    return errors;
};

export const validateRepresentativeStep = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.repName.trim()) errors.repName = ERROR_MESSAGES.REP_NAME_REQUIRED;
    if (!formData.repJob.trim()) errors.repJob = ERROR_MESSAGES.JOB_REQUIRED;

    if (!formData.repEmail.trim()) {
        errors.repEmail = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!EMAIL_REGEX.test(formData.repEmail)) {
        errors.repEmail = ERROR_MESSAGES.EMAIL_INVALID;
    }

    if (!formData.repPhone.trim()) {
        errors.repPhone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!PHONE_REGEX.test(formData.repPhone)) {
        errors.repPhone = ERROR_MESSAGES.PHONE_INVALID;
    }

    return errors;
};

export const validateOrganizationStep = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.orgName.trim()) errors.orgName = ERROR_MESSAGES.ORG_NAME_REQUIRED;
    if (!formData.orgLegalName.trim()) errors.orgLegalName = ERROR_MESSAGES.LEGAL_NAME_REQUIRED;
    if (!formData.orgAddress.trim()) errors.orgAddress = ERROR_MESSAGES.ADDRESS_REQUIRED;
    if (!formData.orgGovernorate.trim()) errors.orgGovernorate = ERROR_MESSAGES.GOVERNORATE_REQUIRED;

    return errors;
};

export const validateRegistrationStep = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (formData.isRegistered === "yes" && !formData.registrationNumber.trim()) {
        errors.registrationNumber = ERROR_MESSAGES.REGISTRATION_NUMBER_REQUIRED;
    }

    return errors;
};

export const validateStep = (
    accountType: "individual" | "organization",
    currentStep: number,
    formData: FormData
): FormErrors => {
    if (accountType === "individual") {
        if (currentStep === 1) return validateIndividualStep1(formData);
        if (currentStep === 2) return validateSecurityStep(formData);
    } else {
        if (currentStep === 1) return validateRepresentativeStep(formData);
        if (currentStep === 2) return validateOrganizationStep(formData);
        if (currentStep === 3) return validateRegistrationStep(formData);
        if (currentStep === 4) return validateSecurityStep(formData);
    }

    return {};
};
