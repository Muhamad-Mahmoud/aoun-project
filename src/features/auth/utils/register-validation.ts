/**
 * Register Form Validation
 */

import { FormData, FormErrors, AccountType, ERROR_MESSAGES } from '../types/register';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;

function validateIndividualStep1(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.name?.trim()) {
        errors.name = ERROR_MESSAGES.NAME_REQUIRED;
    }
    if (!data.governorate?.trim()) {
        errors.governorate = ERROR_MESSAGES.GOVERNORATE_REQUIRED;
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
    if (!data.acceptTerms) {
        errors.acceptTerms = ERROR_MESSAGES.TERMS_REQUIRED;
    }

    return errors;
}

function validateOrganizationStep1(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.repName?.trim()) {
        errors.repName = ERROR_MESSAGES.REP_NAME_REQUIRED;
    }
    if (!data.repJob?.trim()) {
        errors.repJob = ERROR_MESSAGES.JOB_REQUIRED;
    }
    if (!data.repEmail?.trim()) {
        errors.repEmail = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!emailRegex.test(data.repEmail)) {
        errors.repEmail = ERROR_MESSAGES.EMAIL_INVALID;
    }
    if (!data.repPhone?.trim()) {
        errors.repPhone = ERROR_MESSAGES.PHONE_REQUIRED;
    } else if (!phoneRegex.test(data.repPhone)) {
        errors.repPhone = ERROR_MESSAGES.PHONE_INVALID;
    }

    return errors;
}

function validateOrganizationStep2(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.orgName?.trim()) {
        errors.orgName = ERROR_MESSAGES.ORG_NAME_REQUIRED;
    }
    if (!data.orgLegalName?.trim()) {
        errors.orgLegalName = ERROR_MESSAGES.LEGAL_NAME_REQUIRED;
    }
    if (!data.orgAddress?.trim()) {
        errors.orgAddress = ERROR_MESSAGES.ADDRESS_REQUIRED;
    }
    if (!data.orgGovernorate?.trim()) {
        errors.orgGovernorate = ERROR_MESSAGES.GOVERNORATE_REQUIRED;
    }

    return errors;
}

function validateOrganizationStep3(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (data.isRegistered === "yes" && !data.registrationNumber?.trim()) {
        errors.registrationNumber = ERROR_MESSAGES.REGISTRATION_NUMBER_REQUIRED;
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
                return validateOrganizationStep2(data);
            case 3:
                return validateOrganizationStep3(data);
            case 4:
                return validateSecurityStep(data);
            default:
                return {};
        }
    }
}
