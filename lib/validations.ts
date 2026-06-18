import { z } from "zod";
export const emailSchema = z.string().email("Enter a valid email address");
export const passwordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/);
export const contactSchema = z.object({ name: z.string().min(2), businessName: z.string().min(2), email: emailSchema, phone: z.string().min(7), industry: z.string().min(2), message: z.string().optional() });
const ukPhone = z.string().min(10, "Enter a valid UK phone number").refine((value) => {
  const compact = value.replace(/\s|-/g, "");
  return /^(\+44|0)\d{9,10}$/.test(compact);
}, "Enter a valid UK phone number");

export const leadFormSchema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: emailSchema,
  phone: ukPhone,
  service: z.string().min(2),
  subService: z.string().min(2).optional(),
  city: z.string().min(2),
  budget: z.string().optional(),
  source: z.enum(["HOME_PAGE", "PHONE_CALL", "SIGN_UP", "GET_STARTED"]).default("HOME_PAGE"),
  referralSource: z.string().optional(),
  recaptchaToken: z.string().optional(),
  callDuration: z.string().optional(),
  leadTemperature: z.enum(["HOT", "WARM", "COLD"]).optional(),
  takenBy: z.string().optional(),
  message: z.string().optional(),
});
export const messageSchema = z.object({ content: z.string().min(1).max(5000) });
