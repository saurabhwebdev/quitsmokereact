import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function Cravings() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cravings, setCravings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    intensity: 5,
    trigger: '',
    notes: '',
    copingStrategy: '',
    gaveIn: false,
    cigarettesSmoked: 0
  });

  const triggers = [
    'Stress',
    'After Meals',
    'Social Situations',
    'Boredom',
    'Coffee/Drinks',
    'Seeing Others Smoke',
    'Work Break',
    'Other'
  ];

  const copingStrategies = [
    'Deep Breathing',
    'Walking',
    'Drinking Water',
    'Distraction',
    'Meditation',
    'Exercise',
    'Call a Friend',
    'Other'
  ];

  useEffect(() => {
    fetchCravings();
  }, [currentUser.uid]);

  const fetchCravings = async () => {
    try {
      const q = query(
        collection(db, 'cravings'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const cravingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
      setCravings(cravingsData);
    } catch (error) {
      console.error('Error fetching cravings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'cravings'), {
        userId: currentUser.uid,
        intensity: parseInt(formData.intensity),
        trigger: formData.trigger,
        notes: formData.notes,
        copingStrategy: formData.copingStrategy,
        timestamp: new Date(),
        resolved: false,
        gaveIn: formData.gaveIn,
        cigarettesSmoked: parseInt(formData.cigarettesSmoked) || 0
      });

      setFormData({
        intensity: 5,
        trigger: '',
        notes: '',
        copingStrategy: '',
        gaveIn: false,
        cigarettesSmoked: 0
      });
      setShowForm(false);
      fetchCravings();

      window.dispatchEvent(new Event('cravingUpdated'));
    } catch (error) {
      console.error('Error recording craving:', error);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (cravingId) => {
    try {
      const cravingRef = doc(db, 'cravings', cravingId);
      await updateDoc(cravingRef, {
        resolved: true,
        resolvedAt: new Date()
      });
      fetchCravings();
    } catch (error) {
      console.error('Error marking craving as resolved:', error);
    }
  };

  const deleteCraving = async (cravingId) => {
    if (!window.confirm('Are you sure you want to delete this craving record?')) return;
    
    try {
      await deleteDoc(doc(db, 'cravings', cravingId));
      fetchCravings();
    } catch (error) {
      console.error('Error deleting craving:', error);
    }
  };

  const [editingCraving, setEditingCraving] = useState(null);

  const handleEditSubmit = async (e, cravingId) => {
    e.preventDefault();
    try {
      const cravingRef = doc(db, 'cravings', cravingId);
      await updateDoc(cravingRef, {
        intensity: parseInt(formData.intensity),
        trigger: formData.trigger,
        notes: formData.notes,
        copingStrategy: formData.copingStrategy,
      });
      setEditingCraving(null);
      setFormData({
        intensity: 5,
        trigger: '',
        notes: '',
        copingStrategy: '',
        gaveIn: false,
        cigarettesSmoked: 0
      });
      fetchCravings();
    } catch (error) {
      console.error('Error updating craving:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="bg-primary px-4 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg leading-6 font-medium text-white">
                    Craving Tracker
                  </h2>
                  <p className="mt-1 text-sm text-white/80">
                    Record and monitor your cravings to better understand your triggers
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 hover:scale-105"
                >
                  {showForm ? 'Cancel' : 'Record Craving'}
                </button>
              </div>
            </div>
          </div>

          {/* Craving Form */}
          {showForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6 transform transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Craving Intensity (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.intensity}
                    onChange={(e) => setFormData(prev => ({ ...prev, intensity: e.target.value }))}
                    className="mt-1 w-full accent-primary"
                  />
                  <div className="text-center text-lg font-medium text-gray-900">
                    {formData.intensity}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      What triggered this craving?
                    </label>
                    <select
                      value={formData.trigger}
                      onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                      required
                    >
                      <option value="">Select a trigger</option>
                      {triggers.map(trigger => (
                        <option key={trigger} value={trigger}>{trigger}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coping Strategy
                    </label>
                    <select
                      value={formData.copingStrategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, copingStrategy: e.target.value }))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                      required
                    >
                      <option value="">Select a strategy</option>
                      {copingStrategies.map(strategy => (
                        <option key={strategy} value={strategy}>{strategy}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="gaveIn"
                      checked={formData.gaveIn}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        gaveIn: e.target.checked,
                        cigarettesSmoked: e.target.checked ? prev.cigarettesSmoked : 0
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="gaveIn" className="ml-2 block text-sm text-gray-700">
                      I gave in to this craving
                    </label>
                  </div>

                  {formData.gaveIn && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Number of cigarettes smoked
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.cigarettesSmoked}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          cigarettesSmoked: Math.max(0, parseInt(e.target.value) || 0)
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Recording...' : 'Record Craving'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cravings List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Craving History
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track your progress and identify patterns
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {cravings.map((craving) => (
                <div 
                  key={craving.id} 
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  {editingCraving === craving.id ? (
                    // Edit Form
                    <form onSubmit={(e) => handleEditSubmit(e, craving.id)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Intensity (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={formData.intensity}
                          onChange={(e) => setFormData(prev => ({ ...prev, intensity: e.target.value }))}
                          className="mt-1 w-full accent-primary"
                        />
                        <div className="text-center text-lg font-medium text-gray-900">
                          {formData.intensity}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Trigger</label>
                        <select
                          value={formData.trigger}
                          onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                          required
                        >
                          <option value="">Select a trigger</option>
                          {triggers.map(trigger => (
                            <option key={trigger} value={trigger}>{trigger}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Coping Strategy</label>
                        <select
                          value={formData.copingStrategy}
                          onChange={(e) => setFormData(prev => ({ ...prev, copingStrategy: e.target.value }))}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                          required
                        >
                          <option value="">Select a strategy</option>
                          {copingStrategies.map(strategy => (
                            <option key={strategy} value={strategy}>{strategy}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Any additional notes..."
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="editGaveIn"
                            checked={formData.gaveIn}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              gaveIn: e.target.checked,
                              cigarettesSmoked: e.target.checked ? prev.cigarettesSmoked : 0
                            }))}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="editGaveIn" className="ml-2 block text-sm text-gray-700">
                            I gave in to this craving
                          </label>
                        </div>

                        {formData.gaveIn && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Number of cigarettes smoked
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.cigarettesSmoked}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                cigarettesSmoked: Math.max(0, parseInt(e.target.value) || 0)
                              }))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditingCraving(null)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      {/* Header with Time and Intensity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${craving.intensity >= 7 ? 'bg-red-100 text-red-800' : 
                              craving.intensity >= 4 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            Intensity: {craving.intensity}/10
                          </span>
                          {craving.resolved && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              Resolved ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <time className="text-sm text-gray-500">
                            {new Date(craving.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingCraving(craving.id);
                                setFormData({
                                  intensity: craving.intensity,
                                  trigger: craving.trigger,
                                  notes: craving.notes || '',
                                  copingStrategy: craving.copingStrategy || '',
                                  gaveIn: craving.gaveIn,
                                  cigarettesSmoked: craving.cigarettesSmoked || 0
                                });
                              }}
                              className="text-gray-400 hover:text-primary"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteCraving(craving.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Trigger</p>
                            <p className="text-sm text-gray-500">{craving.trigger}</p>
                          </div>
                        </div>

                        {craving.copingStrategy && (
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Strategy Used</p>
                              <p className="text-sm text-gray-500">{craving.copingStrategy}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes Section */}
                      {craving.notes && (
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Notes</p>
                            <p className="mt-1 text-sm text-gray-500">{craving.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {!craving.resolved && (
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => markResolved(craving.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:scale-105"
                          >
                            Mark as Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {cravings.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No cravings recorded</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by recording your first craving.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 