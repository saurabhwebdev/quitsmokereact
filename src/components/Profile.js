import { doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { badges, getBadgeProgress } from '../config/badges';
import { differenceInDays } from 'date-fns';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const isChromeExtensionAvailable = () => {
  return window?.chrome?.runtime?.id !== undefined;
};

export default function Profile() {
  const { currentUser, setCurrentUser, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    cigarettesPerDay: currentUser.smokingData?.cigarettesPerDay || '',
    cigarettesPerPack: currentUser.smokingData?.cigarettesPerPack || '',
    costPerPack: currentUser.smokingData?.costPerPack || '',
    yearsSmoking: currentUser.smokingData?.yearsSmoking || '',
    currency: currentUser.smokingData?.currency || 'USD'
  });

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'INR', symbol: '₹' },
  ];

  const [stats, setStats] = useState({
    moneySaved: 0
  });

  const [badgeStats, setBadgeStats] = useState({
    cravingsResisted: 0,
    totalCravings: 0,
    moneySaved: 0,
    daysSmokeFree: 0
  });

  const previousProgress = useRef({});

  const fetchCravingsData = async () => {
    try {
      const q = query(
        collection(db, 'cravings'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const cravings = querySnapshot.docs.map(doc => doc.data());

      const totalCravings = cravings.length;
      const cravingsResisted = cravings.filter(craving => !craving.gaveIn).length;
      
      const {
        costPerPack,
        cigarettesPerPack,
        cigarettesPerDay,
        quitDate
      } = currentUser.smokingData;

      const days = differenceInDays(new Date(), new Date(quitDate));
      const cigarettesNotSmoked = (days * cigarettesPerDay);
      const cigarettesSmoked = cravings.reduce((total, craving) => 
        total + (craving.gaveIn ? (craving.cigarettesSmoked || 0) : 0), 0);
      
      const moneySaved = ((cigarettesNotSmoked - cigarettesSmoked) / cigarettesPerPack) * costPerPack;

      setBadgeStats({
        cravingsResisted,
        totalCravings,
        moneySaved: Math.max(0, moneySaved),
        daysSmokeFree: days
      });
    } catch (error) {
      console.error('Error fetching cravings data:', error);
    }
  };

  useEffect(() => {
    if (!currentUser?.uid) return;

    fetchCravingsData();

    window.addEventListener('cravingUpdated', fetchCravingsData);
    return () => {
      window.removeEventListener('cravingUpdated', fetchCravingsData);
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!currentUser?.smokingData?.quitDate) return;

    const calculateStats = () => {
      const {
        costPerPack,
        cigarettesPerPack,
        cigarettesPerDay,
        quitDate
      } = currentUser.smokingData;

      const days = differenceInDays(new Date(), new Date(quitDate));
      const cigarettesNotSmoked = (days * cigarettesPerDay);
      const moneySaved = (cigarettesNotSmoked / cigarettesPerPack) * costPerPack;

      setStats({
        moneySaved: Math.max(0, (Math.round(moneySaved * 100) / 100))
      });
    };

    calculateStats();
  }, [currentUser?.smokingData]);

  useEffect(() => {
    const updatePreviousProgress = () => {
      const currentProgress = {};
      Object.entries(badges).forEach(([category, categoryBadges]) => {
        categoryBadges.forEach(badge => {
          const progress = getBadgeProgress(badge, {
            days: badgeStats.daysSmokeFree,
            cravingsResisted: badgeStats.cravingsResisted,
            moneySaved: badgeStats.moneySaved
          });
          currentProgress[badge.id] = progress;
        });
      });
      previousProgress.current = currentProgress;
    };

    updatePreviousProgress();
  }, [badgeStats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = {
        name: formData.name,
        smokingData: {
          ...currentUser.smokingData,
          cigarettesPerDay: parseInt(formData.cigarettesPerDay),
          cigarettesPerPack: parseInt(formData.cigarettesPerPack),
          costPerPack: parseFloat(formData.costPerPack),
          yearsSmoking: parseInt(formData.yearsSmoking),
          currency: formData.currency
        }
      };
      
      await updateDoc(userRef, updates);
      setCurrentUser({
        ...currentUser,
        ...updates
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteAccount();
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const startDate = new Date(currentUser.smokingData?.quitDate || Date.now());

  function BadgeCard({ badge, progress, unlocked, isNew }) {
    return (
      <div 
        className={`
          bg-white p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105
          ${unlocked ? 'border-primary' : 'border-gray-200'}
          ${isNew ? 'animate-bounce' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          <span className={`text-2xl ${isNew ? 'animate-spin' : ''}`}>
            {badge.icon}
          </span>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">
              {badge.name}
              {isNew && <span className="ml-2 text-xs text-primary">New!</span>}
            </h4>
            <p className="text-xs text-gray-500">{badge.description}</p>
          </div>
          {unlocked && (
            <span className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 text-right">{Math.round(progress)}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Profile Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-primary px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-white">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-white/80">
                  Your personal details and smoking statistics
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl text-primary font-bold">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cigarettes per Day</label>
                      <input
                        type="number"
                        name="cigarettesPerDay"
                        value={formData.cigarettesPerDay}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cigarettes per Pack</label>
                      <input
                        type="number"
                        name="cigarettesPerPack"
                        value={formData.cigarettesPerPack}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cost per Pack</label>
                      <input
                        type="number"
                        step="0.01"
                        name="costPerPack"
                        value={formData.costPerPack}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        {currencies.map(curr => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code} ({curr.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Details
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="mt-1 text-sm sm:text-base text-gray-900">{currentUser.name}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Smoking History */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Smoking History
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Quit Date</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {startDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Years Smoking</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentUser.smokingData?.yearsSmoking} years
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Daily Consumption</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentUser.smokingData?.cigarettesPerDay} cigarettes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cost Information */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cost Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Pack Details</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {currentUser.smokingData?.cigarettesPerPack} cigarettes / 
                            {currentUser.smokingData?.currency} {currentUser.smokingData?.costPerPack}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-primary px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Achievements & Badges
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  Track your milestones and celebrate your progress
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-8">
                  {Object.entries(badges).map(([category, categoryBadges]) => (
                    <div key={category}>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 capitalize flex items-center">
                        <span className="text-primary mr-2">
                          {category === 'streaks' ? '🏆' : 
                           category === 'cravings' ? '💪' : 
                           category === 'savings' ? '💰' : '❤️'}
                        </span>
                        {category} Achievements
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryBadges.map(badge => {
                          const progress = getBadgeProgress(badge, {
                            days: badgeStats.daysSmokeFree,
                            cravingsResisted: badgeStats.cravingsResisted,
                            moneySaved: badgeStats.moneySaved
                          });
                          
                          const isNewlyUnlocked = progress >= 100 && 
                            (!previousProgress.current[badge.id] || 
                             previousProgress.current[badge.id] < 100);

                          if (isNewlyUnlocked) {
                            toast.success(`🎉 New Achievement Unlocked: ${badge.name}!`);
                          }

                          return (
                            <BadgeCard
                              key={badge.id}
                              badge={badge}
                              progress={progress}
                              unlocked={progress >= 100}
                              isNew={isNewlyUnlocked}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-red-50 px-4 py-5 sm:px-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-red-800">
                      Danger Zone
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      Actions here cannot be undone. Please proceed with caution.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {showDeleteConfirm ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                      Are you absolutely sure you want to delete your account? All of your data will be permanently removed.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 