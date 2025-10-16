import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="https://picsum.photos/seed/logo/100/100" alt="EcoTrack Logo" width={80} height={80} className="rounded-2xl" data-ai-hint="leaf logo" />
        </div>
        {children}
      </div>
    </div>
  );
}
