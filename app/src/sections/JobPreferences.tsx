import React from 'react';
import { Briefcase, MapPin, Globe, DollarSign } from 'lucide-react';

const JobPreferences = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Preferences</h1>
      <p className="text-gray-600 mb-8">Set your job search preferences.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Desired Job Titles</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
              Software Engineer
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm">
              Full Stack Developer
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Preferred Locations</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
              San Francisco, CA
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm">
              Remote
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Remote Work Preference</h3>
          </div>
          <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
            No Preference
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Salary Expectations</h3>
          </div>
          <p className="text-sm text-gray-600">$80,000 - $150,000</p>
        </div>
      </div>
    </div>
  );
};

export default JobPreferences;
