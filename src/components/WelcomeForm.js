import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function WelcomeForm() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cigarettesPerDay: '',
    cigarettesPerPack: 20,
    costPerPack: '',
    currency: 'USD',
    yearsSmoking: ''
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
      const smokingData = {
        cigarettesPerDay: parseInt(formData.cigarettesPerDay),
        cigarettesPerPack: parseInt(formData.cigarettesPerPack),
        costPerPack: parseFloat(formData.costPerPack),
        yearsSmoking: parseInt(formData.yearsSmoking),
        quitDate: new Date().toISOString(),
        currency: formData.currency
      };
      
      await updateDoc(userRef, {
        smokingData
      });

      const updatedUserDoc = await getDoc(userRef);
      const updatedUserData = updatedUserDoc.data();
      
      setCurrentUser({
        ...currentUser,
        ...updatedUserData
      });

      navigate('/');
    } catch (error) {
      console.error('Error saving data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome, {currentUser.name}!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's get some information about your smoking habits
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cigarettes per day
              </label>
              <input
                type="number"
                name="cigarettesPerDay"
                required
                value={formData.cigarettesPerDay}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cigarettes per pack
              </label>
              <input
                type="number"
                name="cigarettesPerPack"
                required
                value={formData.cigarettesPerPack}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost per pack
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="costPerPack"
                  required
                  value={formData.costPerPack}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years smoking
              </label>
              <input
                type="number"
                name="yearsSmoking"
                required
                value={formData.yearsSmoking}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? 'Saving...' : 'Start Your Smoke-Free Journey'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 