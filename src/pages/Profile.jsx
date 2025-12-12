import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthContext } from '@/hooks/useAuthContext';

export default function Profile() {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    field: 'Information Technology',
    level: 'Intermediate',
    goals: 'Improve technical communication skills',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      field: 'Information Technology',
      level: 'Intermediate',
      goals: 'Improve technical communication skills',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and learning preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="mb-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-gray-300 flex items-center justify-center">
                    <span className="text-2xl text-gray-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {user?.name || 'User'}
              </h3>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Study Streak</span>
                  <span className="font-semibold text-green-600">7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Points</span>
                  <span className="font-semibold text-purple-600">2,450</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600 mb-2">Learning Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">68% Complete</div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900">{formData.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Learning Preferences */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field of Study
                      </label>
                      {isEditing ? (
                        <select
                          name="field"
                          value={formData.field}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Information Technology">Information Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Business">Business</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{formData.field}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        English Level
                      </label>
                      {isEditing ? (
                        <select
                          name="level"
                          value={formData.level}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Upper-Intermediate">Upper-Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{formData.level}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Goals
                    </label>
                    {isEditing ? (
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What do you want to achieve with your English learning?"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.goals}</p>
                    )}
                  </div>
                </div>

                {/* Account Settings */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Study Reminders</h4>
                        <p className="text-sm text-gray-600">Get reminded to maintain your study streak</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
