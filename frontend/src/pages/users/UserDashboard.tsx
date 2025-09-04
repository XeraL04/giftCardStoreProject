import { DashboardHero } from '../../components/users/DashboardHero';
import { DashboardFeaturedGiftCards } from '../../components/users/DashboardFeaturedGiftCards';
import { DashboardCommonGiftCards } from '../../components/users/DashboardCommonGiftCards';
import { DashboardHowItWorks } from '../../components/users/DashboardHowItWorks';


export default function UserDashboard() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <DashboardHero />
      <DashboardFeaturedGiftCards />
      <DashboardCommonGiftCards />
      <DashboardHowItWorks />
    </main>
  );
}