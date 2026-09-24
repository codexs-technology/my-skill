/**
 * Contact form wiring for Web3Forms — no backend required.
 * The access key is injected at build time from the VITE_WEB3FORMS_KEY env var.
 * Create a free key at https://web3forms.com and put it in `.env`.
 */
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

/** Pragmatic email check — the server-side/Web3Forms validation is the real gate. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export const MESSAGE_MIN_LENGTH = 20;

export function validateContact(values: ContactPayload): FieldErrors {
  const errors: FieldErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address, e.g. name@company.com';
  }

  if (message.length < MESSAGE_MIN_LENGTH) {
    errors.message = `Please add a little more detail (at least ${MESSAGE_MIN_LENGTH} characters).`;
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export async function submitContactForm(
  payload: ContactPayload,
  accessKey: string,
): Promise<SubmitResult> {
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New project enquiry from ${payload.name.trim()} — portfolio`,
        from_name: 'Mehboob Masih Portfolio',
        name: payload.name.trim(),
        email: payload.email.trim(),
        message: payload.message.trim(),
        botcheck: false,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!response.ok || !data?.success) {
      return {
        ok: false,
        error:
          data?.message ??
          `The form could not be submitted (status ${response.status}). Please email me directly instead.`,
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Network error — please check your connection, or email codexstechnology@gmail.com directly.',
    };
  }
}
