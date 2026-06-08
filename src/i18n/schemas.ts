/**
 * Localized Zod Schemas — All validation error messages switch
 * dynamically based on the active locale's dictionary.
 */
import * as z from 'zod';
import type { Dictionary } from './dictionaries/pt';

/**
 * Creates a fully localized checkout schema.
 * Every error message is pulled from the translation dictionary.
 */
export function getCheckoutSchema(t: Dictionary) {
  const v = t.validation;
  return z.object({
    firstName: z.string().min(2, v.firstNameTooShort),
    lastName: z.string().min(2, v.lastNameTooShort),
    email: z.string().email(v.invalidEmail),
    address: z.string().min(5, v.addressTooShort),
    city: z.string().min(2, v.cityRequired),
    zipCode: z.string().min(4, v.zipCodeInvalid),
    cardNumber: z.string().regex(/^[0-9]{16}$/, v.cardNumberInvalid),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, v.expiryInvalid),
    cvc: z.string().regex(/^[0-9]{3,4}$/, v.cvcInvalid),
  });
}

/**
 * Creates a localized contact form schema.
 */
export function getContactSchema(t: Dictionary) {
  const v = t.validation;
  return z.object({
    name: z.string().min(2, v.nameTooShort),
    email: z.string().email(v.invalidEmail),
    subject: z.string().min(1, v.required),
    message: z.string().min(10, v.messageTooShort),
  });
}

/**
 * Creates a localized login schema.
 */
export function getLoginSchema(t: Dictionary) {
  const v = t.validation;
  return z.object({
    email: z.string().email(v.invalidEmail),
    password: z.string().min(6, v.passwordTooShort),
  });
}

/**
 * Creates a localized registration schema.
 */
export function getRegisterSchema(t: Dictionary) {
  const v = t.validation;
  return z.object({
    name: z.string().min(2, v.nameTooShort),
    email: z.string().email(v.invalidEmail),
    password: z.string().min(6, v.passwordTooShort),
    confirmPassword: z.string().min(6, v.passwordTooShort),
  }).refine((data) => data.password === data.confirmPassword, {
    message: v.passwordsDoNotMatch,
    path: ['confirmPassword'],
  });
}

export type CheckoutFormValues = z.infer<ReturnType<typeof getCheckoutSchema>>;
export type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;
export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>;
