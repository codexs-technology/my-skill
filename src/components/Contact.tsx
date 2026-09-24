import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { profile } from '../data/profile';
import {
  MESSAGE_MIN_LENGTH,
  hasErrors,
  submitContactForm,
  validateContact,
} from '../lib/web3forms';
import type { ContactPayload, FieldErrors } from '../lib/web3forms';
import Reveal from './Reveal';
import Section from './Section';
import SectionHeading from './SectionHeading';

/** Injected at build time from .env — see .env.example */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? '';

const initialValues: ContactPayload = { name: '', email: '', message: '' };

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Channel = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const channels: Channel[] = [
  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: 'Phone / WhatsApp', value: profile.phoneDisplay, href: profile.phoneHref },
  {
    icon: MessageCircle,
    label: 'WhatsApp chat',
    value: 'Start a WhatsApp chat',
    href: profile.whatsapp,
    external: true,
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/codexs-technology',
    href: profile.github,
    external: true,
  },
  { icon: MapPin, label: 'Location', value: `${profile.location} — ${profile.remoteNote}` },
];

export default function Contact() {
  const [values, setValues] = useState<ContactPayload>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange =
    (field: keyof ContactPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => {
        if (!previous[field]) return previous;
        const next = { ...previous };
        delete next[field];
        return next;
      });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateContact(values);
    setErrors(validation);

    if (hasErrors(validation)) {
      setStatus('idle');
      setFeedback('');
      return;
    }

    if (!WEB3FORMS_KEY) {
      setStatus('error');
      setFeedback(
        'The contact form is not configured yet. Add VITE_WEB3FORMS_KEY to your .env file (and to Cloudflare Pages environment variables), or email codexstechnology@gmail.com directly.',
      );
      return;
    }

    setStatus('submitting');
    setFeedback('');

    const result = await submitContactForm(values, WEB3FORMS_KEY);

    if (result.ok) {
      setStatus('success');
      setFeedback("Thanks — your message has been sent. I'll get back to you as soon as I can.");
      setValues(initialValues);
      return;
    }

    setStatus('error');
    setFeedback(result.error);
  };

  const isSubmitting = status === 'submitting';

  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionHeading
        id="contact-title"
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Send a short brief and I'll come back with questions, a realistic scope and next steps."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <Reveal>
          <div className="card h-full p-6 sm:p-7">
            <h3 className="text-lg font-semibold">Direct channels</h3>
            <p className="mt-2 text-sm muted">
              Prefer email or WhatsApp? Both reach me directly — use whichever is easiest.
            </p>

            <ul className="mt-6 space-y-5">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide muted">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="mt-0.5 block break-words text-sm font-medium text-slate-800 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                        {value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-7">
            <h3 className="text-lg font-semibold">Send a message</h3>
            <p className="mt-2 text-sm muted">
              No backend required — submissions are delivered to my inbox through Web3Forms.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={handleChange('name')}
                  placeholder="Jane Smith"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="field mt-2"
                />
                {errors.name ? (
                  <p id="name-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle size={13} aria-hidden="true" />
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={handleChange('email')}
                  placeholder="you@company.com"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="field mt-2"
                />
                {errors.email ? (
                  <p id="email-error" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle size={13} aria-hidden="true" />
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Project details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={values.message}
                  onChange={handleChange('message')}
                  placeholder="What are you building, what problem should it solve, and what is your timeline?"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'message-error message-hint' : 'message-hint'}
                  className="field mt-2 resize-y"
                />
                <p id="message-hint" className="mt-2 text-xs muted">
                  Minimum {MESSAGE_MIN_LENGTH} characters — a couple of sentences is plenty.
                </p>
                {errors.message ? (
                  <p id="message-error" className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle size={13} aria-hidden="true" />
                    {errors.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden="true" />
                    Send message
                  </>
                )}
              </button>
            </div>

            {status === 'success' && feedback ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>{feedback}</span>
              </div>
            ) : null}

            {status === 'error' && feedback ? (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>{feedback}</span>
              </div>
            ) : null}

            <p className="mt-5 border-t border-slate-200 pt-4 text-xs muted dark:border-white/10">
              Your name, email and message are used only to reply to your enquiry. There is no mailing list.
            </p>
          </form>
        </Reveal>

      </div>
    </Section>
  );
}
