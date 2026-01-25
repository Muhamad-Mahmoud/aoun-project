/**
 * Register Form Validation
 */

import { FormData, FormErrors, AccountType, ERROR_MESSAGES } from '../types/register';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;

function validateIndividualStep1(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.firstName?.trim()) {
        errors.firstName = ERROR_MESSAGES.NAME_REQUIRED;
    }
    if (!data.lastName?.trim()) {
        errors.lastName = ERROR_MESSAGES.NAME_REQUIRED;
    }
    if (!data.headNationalId?.trim()) {
        errors.headNationalId = ERROR_MESSAGES.NATIONAL_ID_REQUIRED;
    } else if (!/^\d{14}$/.test(data.headNationalId)) {
        errors.headNationalId = ERROR_MESSAGES.NATIONAL_ID_INVALID;
    }
    if (!data.governorate?.trim()) {
        errors.governorate = ERROR_MESSAGES.GOVERNORATE_REQUIRED;
    }
    if (!data.city?.trim()) {
        errors.city = ERROR_MESSAGES.REQUIRED;
    }
    if (!data.phone?.trim()) {
        errors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!phoneRegex.test(data.phone)) {
        errors.phone = ERROR_MESSAGES.PHONE_INVALID;
    }
    if (!data.email?.trim()) {
        errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!emailRegex.test(data.email)) {
        errors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    return errors;
}

function validateSecurityStep(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.password || data.password.length < 8) {
        errors.password = ERROR_MESSAGES.PASSWORD_SHORT;
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = ERROR_MESSAGES.PASSWORD_MISMATCH;
    }

    if (!data.acceptTerms) {
        errors.acceptTerms = ERROR_MESSAGES.TERMS_REQUIRED;
    }

    return errors;
}

function validateOrganizationStep1(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.name?.trim()) {
        errors.name = ERROR_MESSAGES.ORG_NAME_REQUIRED;
    }
    if (!data.capacity?.toString().trim()) {
        errors.capacity = ERROR_MESSAGES.REQUIRED;
    }
    if (!data.email?.trim()) {
        errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!emailRegex.test(data.email)) {
        errors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }
    if (!data.phone?.trim()) {
        errors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!phoneRegex.test(data.phone)) {
        errors.phone = ERROR_MESSAGES.PHONE_INVALID;
    }
    if (!data.governorate?.trim()) {
        errors.governorate = ERROR_MESSAGES.GOVERNORATE_REQUIRED;
    }
    if (!data.city?.trim()) {
        errors.city = ERROR_MESSAGES.REQUIRED;
    }

    return errors;
}

export function validateStep(accountType: AccountType, step: number, data: FormData): FormErrors {
    if (accountType === "individual") {
        switch (step) {
            case 1:
                return validateIndividualStep1(data);
            case 2:
                return validateSecurityStep(data);
            default:
                return {};
        }
    } else {
        switch (step) {
            case 1:
                return validateOrganizationStep1(data);
            case 2:
                return validateSecurityStep(data);
            default:
                return {};
        }
    }
}
