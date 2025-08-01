import { Footer } from '../components/publics/Footer';
import { Navbar } from '../components/publics/Navbar';

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
}
