'use client'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="h-full isolate">
            {children}
        </section>
    );
}