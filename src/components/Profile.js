import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-primary px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg leading-6 font-medium text-white">
                    Profile Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-white/80">
                    Your personal details and smoking statistics
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Content */}
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Name</h4>
                      <p className="mt-1 text-sm sm:text-base text-gray-900">{currentUser.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Quit Date</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {startDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Years Smoking</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentUser.smokingData?.yearsSmoking} years
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Daily Consumption</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentUser.smokingData?.cigarettesPerDay} cigarettes
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Pack Details</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentUser.smokingData?.cigarettesPerPack} cigarettes / 
                        {currentUser.smokingData?.currency} {currentUser.smokingData?.costPerPack}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="mt-6 sm:mt-10 bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-red-50 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-red-800">
                    Danger Zone
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-red-700">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              {showDeleteConfirm ? (
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-gray-700">
                    Are you absolutely sure you want to delete your account? All of your data will be permanently removed.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 