import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { JWTTool } from '@/components/jwt-decoder/JWTTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'JWT Decoder — Decode & Inspect JSON Web Tokens Online',
  description:
    'Decode and inspect JWT tokens instantly in your browser. View header, payload, claims, expiry status and algorithm. Free, secure — your token never leaves your device.',
  path: '/jwt-decoder',
  keywords: [
    'JWT decoder',
    'decode JWT online',
    'JWT token decoder',
    'JSON web token decoder',
    'JWT inspector',
    'JWT payload decoder',
    'JWT header decoder',
    'read JWT token',
    'JWT expiry checker',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is a JWT?',
    answer:
      'A JSON Web Token (JWT) is a compact, URL-safe token used to securely represent claims between two parties. It consists of three Base64url-encoded parts separated by dots: a header (algorithm), a payload (claims), and a signature.',
  },
  {
    question: 'Is it safe to decode a JWT in a browser tool?',
    answer:
      'Decoding only reads the unencrypted header and payload — it does not expose the secret signing key, which stays on your server. However, if your payload contains sensitive data, avoid pasting production tokens into any online tool. This tool runs entirely client-side with no server logging.',
  },
  {
    question: 'Can this tool verify a JWT signature?',
    answer:
      'No. Signature verification requires the secret key (for HMAC algorithms) or the public key (for RSA/EC algorithms), which should never be shared with a client-side tool. This tool decodes the payload for inspection only.',
  },
  {
    question: 'What does "token is expired" mean?',
    answer:
      'The JWT payload contains an exp claim — a Unix timestamp representing the expiry time. If the current time is past that timestamp, the token is considered expired and will be rejected by your API server.',
  },
  {
    question: 'What are standard JWT claims?',
    answer:
      'Standard claims include: iss (issuer), sub (subject), aud (audience), exp (expiration), nbf (not before), iat (issued at), and jti (JWT ID). Custom claims can be anything your application needs.',
  },
];

export default function Page() {
  const tool = getTool('jwt-decoder')!;
  const related = getRelatedTools('jwt-decoder');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'JWT Decoder',
        headline: 'Decode & Inspect JWTs Instantly',
        subheadline:
          'View header, payload, all claims, expiry status, and algorithm — without leaving your browser.',
      }}
      contentBlocks={[
        {
          title: 'How JWT tokens work',
          body: (
            <>
              <p>
                A JWT has three parts: <strong className="text-rose-500">header</strong>,{' '}
                <strong className="text-violet-500">payload</strong>, and{' '}
                <strong className="text-amber-500">signature</strong>, each Base64url-encoded and
                joined by dots. The header declares the signing algorithm; the payload carries
                claims (data); the signature ensures the token was not tampered with.
              </p>
              <p>
                The payload is <em>not encrypted</em> — it is only encoded. Anyone who has the
                token can read the claims. Sensitive data should never be placed in a JWT payload
                unless the token itself is encrypted (JWE).
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <JWTTool />
    </ToolPageLayout>
  );
}
