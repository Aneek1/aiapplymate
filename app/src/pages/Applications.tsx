import React from 'react';
import { Briefcase, Building2, MapPin, Calendar, CheckCircle } from 'lucide-react';

const ApplicationsPage = () => {
  const applications = [
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      appliedDate: '2026-02-13',
      status: 'applied',
      atsScore: 92
    },
    {
      id: 2,
      jobTitle: 'Frontend Developer',
      company: 'Meta',
      location: 'Remote',
      appliedDate: '2026-02-12',
      status: 'interviewing',
      atsScore: 85
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Tracker</h1>
      <p className="text-gray-600 mb-8">Track your job applications.</p>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{app.jobTitle}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {app.company}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {app.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{app.atsScore}%</span>
                  <p className="text-xs text-gray-500">ATS Match</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  app.status === 'applied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
