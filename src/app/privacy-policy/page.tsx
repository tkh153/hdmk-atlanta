import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | HDMK Inspection Services Greater Atlanta",
  description:
    "Privacy policy for HDMK Inspection Services Greater Atlanta lead forms and website inquiries.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="policy-page">
      <section className="policy-card">
        <Link href="/" className="policy-back">
          Back to Home
        </Link>
        <h1>Privacy Policy</h1>
        <p>
          HDMK Inspection Services Greater Atlanta respects your privacy. This policy explains how we collect, use, and protect information submitted through our website, advertising forms, and lead-generation campaigns.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect your name, phone number, email address, property details, buying timeframe, inspection preferences, and any message you choose to submit.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use your information to respond to inspection requests, deliver requested resources, confirm availability, provide quotes, send appointment reminders, and follow up about home inspection services.
        </p>

        <h2>Text And Email Communications</h2>
        <p>
          By submitting a form, you agree that HDMK Inspection Services may contact you by phone, text, or email about your request. Message and data rates may apply. You can opt out of text messages by replying STOP.
        </p>

        <h2>Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share information only with service providers used to operate our business, manage leads, communicate with customers, or fulfill inspection-related requests.
        </p>

        <h2>Advertising And Analytics</h2>
        <p>
          We may use advertising and analytics tools, including Meta and Google, to understand website performance, measure campaign results, and improve our marketing.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this policy or your information, contact HDMK Inspection Services Greater Atlanta at 404-474-4032.
        </p>

        <p className="policy-updated">Last updated July 19, 2026.</p>
      </section>
    </main>
  );
}
