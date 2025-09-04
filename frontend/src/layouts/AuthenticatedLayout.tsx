import { AuthNavbar } from '../components/users/AuthNavbar';
import { AuthFooter } from '../components/users/AuthFooter';

type Props = {
  children: React.ReactNode;
};

export default function AuthenticatedLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AuthNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
