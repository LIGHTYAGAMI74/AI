export const executeRecaptcha = async (action: string) => {
  if (!(window as any).grecaptcha) {
    throw new Error("reCAPTCHA not loaded");
  }

  return await (window as any).grecaptcha.execute(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    { action }
  );
};