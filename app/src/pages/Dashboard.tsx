import React from 'react';
import { Briefcase, Target, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Track your job search progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">24</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Applications</h3>
          <p className="text-xs text-green-600 mt-1">+3 today</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">78%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">ATS Score</h3>
          <p className="text-xs text-green-600 mt-1">+12% this week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">4</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Interviews</h3>
          <p className="text-xs text-blue-600 mt-1">2 upcoming</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">68%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
          <p className="text-xs text-gray-500 mt-1">Interview conversion</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
