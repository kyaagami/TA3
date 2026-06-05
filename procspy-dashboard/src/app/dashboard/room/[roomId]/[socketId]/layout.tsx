export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="isolate">
            {children}
        </section>
    );
}