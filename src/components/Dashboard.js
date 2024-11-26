import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isFirstHour, setIsFirstHour] = useState(false);
  const [cigarettesFromCravings, setCigarettesFromCravings] = useState(0);
  const [hasRecentSmoke, setHasRecentSmoke] = useState(false);

  const fetchCravingsData = async () => {
    try {
      const q = query(
        collection(db, 'cravings'),
        where('userId', '==', currentUser.uid),
        where('gaveIn', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const totalCigarettes = querySnapshot.docs.reduce((total, doc) => {
        return total + (doc.data().cigarettesSmoked || 0);
      }, 0);
      setCigarettesFromCravings(totalCigarettes);

      const twentyFourHoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
      const recentSmoke = querySnapshot.docs.some(doc => {
        const cravingDate = doc.data().timestamp.toDate();
        return cravingDate > twentyFourHoursAgo && doc.data().gaveIn;
      });
      setHasRecentSmoke(recentSmoke);
    } catch (error) {
      console.error('Error fetching cravings data:', error);
    }
  };

  useEffect(() => {
    if (!currentUser?.smokingData) {
      navigate('/welcome');
      return;
    }

    fetchCravingsData();

    window.addEventListener('cravingUpdated', fetchCravingsData);

    return () => {
      window.removeEventListener('cravingUpdated', fetchCravingsData);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.smokingData) return;

    const calculateStats = () => {
      const {
        cigarettesPerDay,
        costPerPack,
        cigarettesPerPack,
        quitDate,
        currency
      } = currentUser.smokingData;

      const quitDateTime = new Date(quitDate);
      const now = new Date();
      
      const totalHours = differenceInHours(now, quitDateTime);
      const days = differenceInDays(now, quitDateTime);
      const hours = differenceInHours(now, quitDateTime) % 24;
      const minutes = differenceInMinutes(now, quitDateTime) % 60;
      const seconds = differenceInSeconds(now, quitDateTime) % 60;

      setIsFirstHour(totalHours < 1);

      const cigarettesPerMinute = cigarettesPerDay / 1440;
      const timeInMinutes = (days * 1440) + (hours * 60) + minutes + (seconds / 60);
      
      const cigarettesNotSmoked = Math.max(0, (timeInMinutes * cigarettesPerMinute) - cigarettesFromCravings);

      const moneySaved = (cigarettesNotSmoked / cigarettesPerPack) * costPerPack;

      const healthProgress = [
        { days: 1, milestone: "Blood oxygen levels return to normal", progress: 0 },
        { days: 2, milestone: "Sense of taste and smell improve", progress: 0 },
        { days: 3, milestone: "Breathing becomes easier", progress: 0 },
        { days: 14, milestone: "Circulation improves", progress: 0 },
        { days: 30, milestone: "Lung function increases", progress: 0 },
        { days: 90, milestone: "Risk of heart attack decreases", progress: 0 }
      ].map(milestone => {
        let progress = ((days + (hours/24) + (minutes/1440) + (seconds/86400)) / milestone.days) * 100;
        
        if (hasRecentSmoke) {
          progress = Math.max(0, progress - 25);
        }
        
        const progressReduction = (cigarettesFromCravings / cigarettesPerDay) * 10;
        progress = Math.max(0, progress - progressReduction);
        
        return {
          ...milestone,
          progress: Math.min(100, progress)
        };
      });

      return {
        days,
        hours,
        minutes,
        seconds,
        cigarettesNotSmoked: Math.max(0, Math.round(cigarettesNotSmoked * 100) / 100),
        moneySaved: Math.max(0, (Math.round(moneySaved * 100) / 100)).toFixed(2),
        currency,
        healthProgress
      };
    };

    const updateStats = () => {
      const newStats = calculateStats();
      setStats(prev => {
        if (!prev) return newStats;
        return {
          ...newStats,
          cigarettesNotSmoked: prev.cigarettesNotSmoked + (newStats.cigarettesNotSmoked - prev.cigarettesNotSmoked) * 0.1,
          moneySaved: (parseFloat(prev.moneySaved) + (parseFloat(newStats.moneySaved) - parseFloat(prev.moneySaved)) * 0.1).toFixed(2)
        };
      });
    };

    updateStats();
    const interval = setInterval(updateStats, isFirstHour ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [currentUser?.smokingData, cigarettesFromCravings, hasRecentSmoke]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-xl font-medium text-gray-900">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Time Smoke Free */}
            <div className="bg-white overflow-hidden shadow rounded-lg transform transition-all duration-500 hover:scale-105">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Time Smoke Free
                </dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900 transition-all duration-300">
                  {stats.days}d {stats.hours}h {stats.minutes}m {isFirstHour && `${stats.seconds}s`}
                </dd>
              </div>
            </div>

            {/* Cigarettes Not Smoked */}
            <div className="bg-white overflow-hidden shadow rounded-lg transform transition-all duration-500 hover:scale-105">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Cigarettes Not Smoked
                </dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900 transition-all duration-300">
                  {Math.round(stats.cigarettesNotSmoked * 10) / 10}
                </dd>
              </div>
            </div>

            {/* Money Saved */}
            <div className="bg-white overflow-hidden shadow rounded-lg transform transition-all duration-500 hover:scale-105">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Money Saved ({stats.currency})
                </dt>
                <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900 transition-all duration-300">
                  {stats.moneySaved}
                </dd>
              </div>
            </div>
          </div>

          {/* Health Progress */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Health Progress</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.healthProgress.map((milestone, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-4 transform transition-all duration-500 hover:scale-105">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {milestone.milestone}
                      </span>
                      <span className="text-sm font-medium text-gray-700 ml-2">
                        {Math.round(milestone.progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 