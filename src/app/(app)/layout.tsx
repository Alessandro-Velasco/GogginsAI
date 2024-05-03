import Navbar from "@/components/ui/Navbar";


export default function AppLayout({
 children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
   <div className="flex flex-col w-full h-full">
    <Navbar />
    {children}
   </div>
    );
  }