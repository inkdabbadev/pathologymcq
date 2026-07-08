import Link from "next/link";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ambient -mt-[var(--nav-offset)] flex min-h-[calc(100vh+var(--nav-offset))] flex-col items-center justify-center px-[var(--gutter)] pb-16 pt-[calc(var(--nav-offset)+4rem)]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-plum-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-hema-700 to-eosin-500 text-sm text-white">
              P
            </span>
            Pathology MCQ
          </Link>

          <h1 className="mt-6 font-display text-3xl font-bold text-plum-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-700">{subtitle}</p>
        </div>

        <div className="mt-8 rounded-hero border border-iris-300/30 bg-white p-6 shadow-lifted sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
