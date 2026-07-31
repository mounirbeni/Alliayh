/**
 * Localized Zod Schemas — All validation error messages switch
 * dynamically based on the active locale's dictionary.
 */
import * as z from 'zod';
import type { Dictionary } from './dictionaries/pt';

/**
 * Checkout contact schema.
 *
 * Card and address fields used to live here — `cardNumber`, `expiry`, `cvc` —
 * because the storefront rendered its own payment form. Those are gone: Stripe
 * collects payment and shipping details on its hosted checkout, so no card data
 * is ever validated, held or transmitted by this application.
 */
export function getCheckoutSchema(t: Dictionary) {
  const v = t.validation;
  return z.object({
    email: z.string().email(v.invalidEmail),
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
