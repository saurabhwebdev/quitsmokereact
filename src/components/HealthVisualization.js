import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { differenceInDays } from 'date-fns';

export default function HealthVisualization({ days }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const { currentUser } = useAuth();
  const [healthStats, setHealthStats] = useState({
    hasRecentSmoke: false,
    totalCigarettesSmoked: 0,
    daysSmokeFree: days || 0,
    lastUpdate: new Date()
  });

  // Add real-time progress calculation
  const calculateProgress = (improvement) => {
    const now = new Date();
    const quitDate = new Date(currentUser.smokingData?.quitDate);
    const totalMinutes = (now - quitDate) / (1000 * 60);
    const totalDays = totalMinutes / (24 * 60);
    
    let progress = (totalDays / improvement.days) * 100;

    // Reduce progress if there's recent smoking
    if (healthStats.hasRecentSmoke) {
      progress *= 0.75;
    }

    // Reduce progress based on total cigarettes smoked
    const cigarettesPerDay = currentUser.smokingData?.cigarettesPerDay || 20;
    const progressReduction = (healthStats.totalCigarettesSmoked / cigarettesPerDay) * 10;
    progress = Math.max(0, progress - progressReduction);

    return Math.min(100, progress);
  };

  // Fetch health data with real-time updates
  const fetchHealthData = async () => {
    try {
      const q = query(
        collection(db, 'cravings'),
        where('userId', '==', currentUser.uid),
        where('gaveIn', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const cravings = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));

      // Check for recent smoking (last 24 hours)
      const twentyFourHoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
      const hasRecentSmoke = cravings.some(craving => craving.timestamp > twentyFourHoursAgo);

      // Calculate total cigarettes smoked
      const totalCigarettesSmoked = cravings.reduce((total, craving) => 
        total + (craving.cigarettesSmoked || 0), 0);

      setHealthStats({
        hasRecentSmoke,
        totalCigarettesSmoked,
        daysSmokeFree: days,
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  // Add interval for real-time updates
  useEffect(() => {
    fetchHealthData();
    
    // Update progress every minute
    const progressInterval = setInterval(() => {
      setHealthStats(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));
    }, 60000);

    // Listen for craving updates
    window.addEventListener('cravingUpdated', fetchHealthData);

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('cravingUpdated', fetchHealthData);
    };
  }, [currentUser.uid, days]);

  // Update the improvement card to show real-time progress
  const ImprovementCard = ({ improvement }) => {
    const progress = calculateProgress(improvement);
    const isCompleted = progress >= 100;

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Day {improvement.days}</span>
          <span className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-2">{improvement.text}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isCompleted ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const getPartProgress = (part) => {
    const baseProgress = (healthStats.daysSmokeFree / bodyParts[part].maxDays) * 100;
    
    // Reduce progress if there's recent smoking or high total cigarettes
    let progress = baseProgress;
    if (healthStats.hasRecentSmoke) {
      progress *= 0.75; // Reduce by 25% if smoked recently
    }
    
    // Reduce progress based on total cigarettes smoked
    const cigarettesPerDay = currentUser.smokingData?.cigarettesPerDay || 20;
    const progressReduction = (healthStats.totalCigarettesSmoked / cigarettesPerDay) * 10;
    progress = Math.max(0, progress - progressReduction);

    return Math.min(100, progress);
  };

  const getPartStatus = (part) => {
    const progress = getPartProgress(part);
    if (progress >= 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'starting';
  };

  const bodyParts = {
    brain: {
      title: "Brain",
      icon: "🧠",
      maxDays: 90,
      improvements: [
        { days: 1, text: "Anxiety and stress levels start to decrease" },
        { days: 7, text: "Mental fog begins to clear" },
        { days: 30, text: "Depression and anxiety symptoms decrease" },
        { days: 90, text: "Concentration and memory improve" }
      ]
    },
    mouth: {
      title: "Mouth",
      icon: "👄",
      maxDays: 365,
      improvements: [
        { days: 2, text: "Taste buds begin to recover" },
        { days: 7, text: "Sense of taste significantly improves" },
        { days: 30, text: "Gum health improves" },
        { days: 365, text: "Reduced risk of oral cancers" }
      ]
    },
    lungs: {
      title: "Lungs",
      icon: "🫁",
      maxDays: 90,
      improvements: [
        { days: 1, text: "Carbon monoxide levels drop to normal" },
        { days: 3, text: "Breathing becomes easier" },
        { days: 30, text: "Lung function increases by up to 30%" },
        { days: 90, text: "Coughing and shortness of breath decrease" }
      ]
    },
    heart: {
      title: "Heart",
      icon: "❤️",
      maxDays: 365,
      improvements: [
        { days: 1, text: "Heart rate and blood pressure normalize" },
        { days: 14, text: "Circulation improves" },
        { days: 90, text: "Risk of heart attack begins to decrease" },
        { days: 365, text: "Risk of heart disease drops by 50%" }
      ]
    }
  };

  // Add this function to calculate overall progress
  const calculateOverallProgress = () => {
    const allProgress = Object.keys(bodyParts).map(part => getPartProgress(part));
    return allProgress.reduce((sum, progress) => sum + progress, 0) / allProgress.length;
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-white">
            Your Body's Recovery Journey
          </h3>
          <p className="mt-1 text-sm text-white/80">
            Track how your body heals as you stay smoke-free
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Body Map - Takes 1/3 of space */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center">
              <div className="relative w-full max-w-[250px] mx-auto">
                <svg 
                  viewBox="0 0 206.326 206.326"
                  className="w-full h-auto"
                >
                  {/* Add gradient definition for the fill effect */}
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)" /> {/* red-500 with opacity */}
                      <stop offset={`${calculateOverallProgress()}%`} stopColor="rgba(239, 68, 68, 0.2)" />
                      <stop offset={`${calculateOverallProgress()}%`} stopColor="transparent" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Base Human Silhouette */}
                  <path
                    d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3 c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522 c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201 c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109 c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24 c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217 c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245 c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631 c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522 c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448 c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577 c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257 c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674 c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635 c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514 c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733 C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733 c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988 c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198 c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953 c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577 c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448 c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522 c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269 c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727 c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848 c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033 c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116 c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522 c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3 c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    strokeWidth="1"
                    className="transition-all duration-300"
                  />

                  {/* Progress Fill Overlay */}
                  <path
                    d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3 c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522 c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201 c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109 c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24 c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217 c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245 c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631 c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522 c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448 c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577 c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257 c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674 c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635 c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514 c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733 C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733 c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988 c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198 c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953 c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577 c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448 c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522 c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269 c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727 c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848 c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033 c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116 c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522 c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3 c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
                    fill="url(#progressGradient)"
                    className="transition-all duration-1000"
                  />

                  {/* Interactive Points */}
                  <g>
                    {/* Brain Point */}
                    <circle
                      cx="103" cy="25" r="6"
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedPart === 'brain' ? 'fill-primary stroke-primary animate-pulse' :
                        getPartStatus('brain') === 'completed' ? 'fill-green-500 stroke-green-500' :
                        getPartStatus('brain') === 'in-progress' ? 'fill-yellow-500 stroke-yellow-500' :
                        'fill-gray-400 stroke-gray-400'
                      }`}
                      onClick={() => setSelectedPart('brain')}
                    />

                    {/* Mouth Point */}
                    <circle
                      cx="103" cy="45" r="6"
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedPart === 'mouth' ? 'fill-primary stroke-primary animate-pulse' :
                        getPartStatus('mouth') === 'completed' ? 'fill-green-500 stroke-green-500' :
                        getPartStatus('mouth') === 'in-progress' ? 'fill-yellow-500 stroke-yellow-500' :
                        'fill-gray-400 stroke-gray-400'
                      }`}
                      onClick={() => setSelectedPart('mouth')}
                    />

                    {/* Heart Point */}
                    <circle
                      cx="103" cy="85" r="6"
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedPart === 'heart' ? 'fill-primary stroke-primary animate-pulse' :
                        getPartStatus('heart') === 'completed' ? 'fill-green-500 stroke-green-500' :
                        getPartStatus('heart') === 'in-progress' ? 'fill-yellow-500 stroke-yellow-500' :
                        'fill-gray-400 stroke-gray-400'
                      }`}
                      onClick={() => setSelectedPart('heart')}
                    />

                    {/* Lungs Point */}
                    <circle
                      cx="103" cy="100" r="6"
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedPart === 'lungs' ? 'fill-primary stroke-primary animate-pulse' :
                        getPartStatus('lungs') === 'completed' ? 'fill-green-500 stroke-green-500' :
                        getPartStatus('lungs') === 'in-progress' ? 'fill-yellow-500 stroke-yellow-500' :
                        'fill-gray-400 stroke-gray-400'
                      }`}
                      onClick={() => setSelectedPart('lungs')}
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* Recovery Timeline and Scientific Facts - Takes 2/3 of space */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recovery Timeline */}
              <div className="bg-gray-50 rounded-xl p-4">
                {selectedPart ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
                      <span className="text-3xl">{bodyParts[selectedPart].icon}</span>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          {bodyParts[selectedPart].title} Recovery
                        </h3>
                        {healthStats.hasRecentSmoke && (
                          <p className="text-sm text-red-600">
                            Recent smoking detected - recovery progress reduced
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bodyParts[selectedPart].improvements.map((improvement, index) => (
                        <ImprovementCard key={index} improvement={improvement} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center font-medium">
                      Select a body part to see detailed recovery timeline
                    </p>
                  </div>
                )}
              </div>

              {/* Scientific Facts in a Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:scale-105">
                  <h4 className="flex items-center text-blue-900 font-medium mb-2">
                    <span className="text-xl mr-2">🎯</span>
                    Quick Recovery
                  </h4>
                  <p className="text-sm text-blue-800">
                    Within 20 minutes of your last cigarette, your heart rate and blood pressure begin to drop.
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 transform transition-all duration-300 hover:scale-105">
                  <h4 className="flex items-center text-green-900 font-medium mb-2">
                    <span className="text-xl mr-2">💪</span>
                    Long-term Benefits
                  </h4>
                  <p className="text-sm text-green-800">
                    After 1 year smoke-free, your risk of heart disease drops to half that of a smoker.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 transform transition-all duration-300 hover:scale-105">
                  <h4 className="flex items-center text-purple-900 font-medium mb-2">
                    <span className="text-xl mr-2">✨</span>
                    Natural Healing
                  </h4>
                  <p className="text-sm text-purple-800">
                    Your body has an amazing ability to heal itself. Every smoke-free day contributes to your recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 