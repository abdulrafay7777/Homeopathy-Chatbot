import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { apiClient } from '../services/api';

const PlansTab = () => {
  const [plans, setPlans] = useState([
    {
      id: 'standard',
      name: 'Standard Plan',
      price: '5,000',
      currency: 'Rs',
      period: '/month',
      prompts: '6 consultations/day',
      users: 0, // Will be dynamically updated
      description: 'Consult up to 6 patients daily, Full diagnosis analysis, Priority support',
      color: 'from-purple-500 to-pink-500'
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/dashboard-stats');
        if (response.data && response.data.stats) {
          const totalUsers = response.data.stats.totalUsers || 0;
          setPlans(prev => prev.map(plan => ({
            ...plan,
            users: totalUsers
          })));
        }
      } catch (error) {
        console.error('Error fetching stats for plans:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pt-4 sm:pt-8 w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-12 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-primary break-words">
          Subscription Plans
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-muted break-words">
          View pricing and features for all subscription tiers
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 w-full">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-surface border border-default rounded-2xl p-5 sm:p-8 lg:p-10 flex flex-col shadow-lg hover:shadow-custom transition-shadow duration-300 w-full"
          >
            {/* Plan Name Badge */}
            <div className={`inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r ${plan.color} mb-6 sm:mb-12 self-start max-w-full overflow-hidden`}>
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide truncate">
                {plan.name}
              </span>
            </div>

            {/* Prompts Info */}
            <div className="mb-6 sm:mb-10 w-full">
              <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-4 text-muted break-words">
                Daily Prompts
              </p>
              <p className="text-xl sm:text-2xl md:text-[2rem] font-bold text-primary leading-tight break-words">
                {plan.prompts}
              </p>
            </div>
            
            {/* Price */}
            <div className="mb-6 sm:mb-12 pb-6 sm:pb-12 border-b-2 border-default w-full">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl md:text-[3rem] font-extrabold text-primary leading-none break-all">
                  {plan.price}
                </span>
                <span className="text-sm sm:text-base md:text-lg text-muted whitespace-nowrap">
                  /month
                </span>
              </div>
            </div>

            {/* Plan Description */}
            <div className="flex-1 mb-6 sm:mb-12 w-full">
              <p className="text-sm sm:text-base font-medium leading-relaxed text-primary break-words">
                {plan.description}
              </p>
            </div>

            {/* Users Enrolled */}
            <div className="bg-surface-2 p-3 sm:p-6 rounded-xl flex flex-wrap items-center justify-between gap-3 mt-auto w-full">
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Users size={18} className="text-accent shrink-0 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium text-muted whitespace-nowrap">
                  Users Enrolled
                </span>
              </div>
              <span className="text-lg sm:text-xl md:text-[2rem] font-bold text-accent leading-none">
                {plan.users}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansTab;
