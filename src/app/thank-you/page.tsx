import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b88600]">Inspection Request Received</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          Thank you! Your request has been received.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          A member of our team will contact you shortly to confirm your inspection.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#f6b400] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d89d00]"
          >
            Return Home
          </Link>
          <a
            href="https://manager.hdmk.net/schedule"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Schedule Directly
          </a>
        </div>
      </div>
    </main>
  );
}
