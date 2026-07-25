import BottomNav from "@/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen pb-20 md:pb-0">
      {children}
      <BottomNav />
    </div>
  );
}