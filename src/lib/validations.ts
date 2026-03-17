import { z } from 'zod';

export const requirementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'AWARDED']).default('DRAFT'),
  description: z.string().optional(),
  category: z.string().optional(),
  currency: z.string().default('INR'),
  ceilingPrice: z.number().optional(),
  minDecrement: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  participants: z.array(z.string().email()).optional(),
}).superRefine((data, ctx) => {
  if (data.status === 'ACTIVE') {
    if (!data.description || data.description.length < 20) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description must be at least 20 characters', path: ['description'] });
    }
    if (!data.ceilingPrice || data.ceilingPrice <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ceiling price must be greater than 0', path: ['ceilingPrice'] });
    }
    if (!data.minDecrement || data.minDecrement <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Minimum decrement must be greater than 0', path: ['minDecrement'] });
    }
    if (!data.startTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Start time is required', path: ['startTime'] });
    } else if (new Date(data.startTime) <= new Date()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Start time must be in the future', path: ['startTime'] });
    }
    if (!data.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End time is required', path: ['endTime'] });
    } else if (data.startTime && new Date(data.endTime) <= new Date(data.startTime)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End time must be after start time', path: ['endTime'] });
    }
  }
});

export const bidSchema = z.object({
  offeredPrice: z.number().min(1, 'Offered price must be greater than 0'),
  deliveryDays: z.number().min(1).optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const userRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  gstNo: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number'),
  designation: z.string().min(2, 'Designation is required'),
  industry: z.string().min(2, 'Industry is required'),
  dob: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18 && age <= 100;
  }, 'Age must be between 18 and 100'),
});

export type RequirementFormData = z.infer<typeof requirementSchema> & {
  attachments?: File[];
};
export type BidFormData = z.infer<typeof bidSchema>;
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;