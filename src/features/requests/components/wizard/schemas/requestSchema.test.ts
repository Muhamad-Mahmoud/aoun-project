import { step0Schema, step1Schema, requestFormSchema, defaultFormValues } from './requestSchema';

describe('wizard step schemas', () => {
    it('step0 requires otherRequestType when requestType is Other', () => {
        const bad = step0Schema.safeParse({ requestType: 'Other', otherRequestType: '', description: 'x'.repeat(25) });
        expect(bad.success).toBe(false);
        const good = step0Schema.safeParse({
            requestType: 'Other',
            otherRequestType: 'علاج',
            description: 'x'.repeat(25),
        });
        expect(good.success).toBe(true);
    });

    it('step1 toggles job fields vs unemployment reason', () => {
        const workingBad = step1Schema.safeParse({ ...defaultFormValues, location: 'القاهرة', isWorking: true });
        expect(workingBad.success).toBe(false);
        const notWorkingBad = step1Schema.safeParse({
            ...defaultFormValues,
            location: 'القاهرة',
            isWorking: false,
            unEmploymentReason: '',
        });
        expect(notWorkingBad.success).toBe(false);
    });

    it('full schema accepts coherent defaults-derived payload', () => {
        const payload = {
            ...defaultFormValues,
            description: 'وصف تفصيلي للحالة يتجاوز عشرين حرفا بالتأكيد',
            location: 'القاهرة',
            isWorking: false,
            unEmploymentReason: 'أبحث عن عمل مناسب',
        };
        expect(requestFormSchema.safeParse(payload).success).toBe(true);
    });
});
