import { useState } from 'react';
import { Users } from 'lucide-react';

const PlansTab = () => {
  const [plans] = useState([
    {
      id: 1,
      name: 'Basic',
      price: '1,500',
      prompts: 35,
      users: 45,
      description: 'For individual learners & beginners',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Standard',
      price: '2,800',
      prompts: 70,
      users: 82,
      description: 'For practitioners & regular users',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      name: 'Premium',
      price: '4,500',
      prompts: 110,
      users: 27,
      description: 'For institutions & power users',
      color: 'from-orange-500 to-red-500'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto pt-4 sm:pt-8">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-primary">
          Subscription Plans
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          View pricing and features for all subscription tiers
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-surface border border-default rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col shadow-lg hover:shadow-custom transition-shadow duration-300"
          >
            {/* Plan Name Badge */}
            <div className={`inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r ${plan.color} mb-8 sm:mb-12 self-start`}>
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                {plan.name}
              </span>
            </div>

            {/* Prompts Info */}
            <div className="mb-6 sm:mb-10">
              <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 text-muted">
                Daily Prompts
              </p>
              <p className="text-xl sm:text-[2rem] font-bold text-primary leading-none">
                {plan.prompts}
              </p>
            </div>
            
            {/* Price */}
            <div className="mb-8 sm:mb-12 pb-8 sm:pb-12 border-b-2 border-default">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-3xl sm:text-[3rem] font-extrabold text-primary leading-none">
                  {plan.price}
                </span>
                <span className="text-sm sm:text-lg text-muted">
                  /month
                </span>
              </div>
            </div>

            {/* Plan Description */}
            <div className="flex-1 mb-8 sm:mb-12">
              <p className="text-sm sm:text-base font-medium leading-relaxed text-primary">
                {plan.description}
              </p>
            </div>

            {/* Users Enrolled */}
            <div className="bg-surface-2 p-4 sm:p-6 rounded-xl flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 sm:gap-4">
                <Users size={18} className="text-accent sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium text-muted">
                  Users Enrolled
                </span>
              </div>
              <span className="text-xl sm:text-[2rem] font-bold text-accent ml-4 sm:ml-6 leading-none">
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
