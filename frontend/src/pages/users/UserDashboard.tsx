import { DashboardHero } from '../../components/users/DashboardHero';
import { DashboardFeaturedGiftCards } from '../../components/users/DashboardFeaturedGiftCards';
import { DashboardCommonGiftCards } from '../../components/users/DashboardCommonGiftCards';
import { DashboardHowItWorks } from '../../components/users/DashboardHowItWorks';


export default function UserDashboard() {

  return (
    <>
      <DashboardHero />
      <DashboardFeaturedGiftCards />
      <DashboardCommonGiftCards />
      <DashboardHowItWorks />
    </>
  );
}
