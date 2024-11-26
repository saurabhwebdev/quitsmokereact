export const badges = {
  streaks: [
    {
      id: 'streak-1',
      name: '24 Hours Strong',
      description: 'Stayed smoke-free for 24 hours',
      icon: '🌟',
      requirement: 1, // days
      category: 'streak'
    },
    {
      id: 'streak-2',
      name: 'First Week Victory',
      description: 'Completed 7 days smoke-free',
      icon: '🏆',
      requirement: 7,
      category: 'streak'
    },
    {
      id: 'streak-3',
      name: 'Two Week Warrior',
      description: 'Maintained 14 days without smoking',
      icon: '💪',
      requirement: 14,
      category: 'streak'
    },
    {
      id: 'streak-4',
      name: 'Monthly Milestone',
      description: 'One month of smoke-free life',
      icon: '🌙',
      requirement: 30,
      category: 'streak'
    },
    {
      id: 'streak-5',
      name: 'Quarter Champion',
      description: 'Three months of dedication',
      icon: '👑',
      requirement: 90,
      category: 'streak'
    }
  ],
  cravings: [
    {
      id: 'craving-1',
      name: 'Craving Conqueror',
      description: 'Resisted 10 cravings',
      icon: '🛡️',
      requirement: 10,
      category: 'craving'
    },
    {
      id: 'craving-2',
      name: 'Master of Will',
      description: 'Overcame 50 cravings',
      icon: '⚔️',
      requirement: 50,
      category: 'craving'
    }
  ],
  savings: [
    {
      id: 'savings-1',
      name: 'Money Saver',
      description: 'Saved your first $100',
      icon: '💰',
      requirement: 100,
      category: 'savings'
    },
    {
      id: 'savings-2',
      name: 'Financial Freedom',
      description: 'Saved $500 by not smoking',
      icon: '💎',
      requirement: 500,
      category: 'savings'
    }
  ],
  health: [
    {
      id: 'health-1',
      name: 'Breathing Better',
      description: 'Oxygen levels back to normal',
      icon: '🫁',
      requirement: 1,
      category: 'health'
    },
    {
      id: 'health-2',
      name: 'Taste Master',
      description: 'Sense of taste and smell improved',
      icon: '👅',
      requirement: 2,
      category: 'health'
    }
  ]
};

export const getBadgeProgress = (badge, stats) => {
  switch (badge.category) {
    case 'streak':
      return Math.min(100, (stats.days / badge.requirement) * 100);
    case 'craving':
      return Math.min(100, (stats.cravingsResisted / badge.requirement) * 100);
    case 'savings':
      return Math.min(100, (stats.moneySaved / badge.requirement) * 100);
    case 'health':
      return Math.min(100, (stats.days / badge.requirement) * 100);
    default:
      return 0;
  }
}; 