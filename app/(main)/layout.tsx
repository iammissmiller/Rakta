import BottomNav from "@/components/BottomNav";
import { SideNav } from "@/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="relative flex-1 min-w-0 pb-20 md:pb-0">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}