export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(200,170,110,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,170,110,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
            <div className="relative z-10 w-full max-w-md px-6">
                {children}
            </div>
        </div>
    );
}
