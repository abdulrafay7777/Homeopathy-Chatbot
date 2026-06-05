import React, { useState } from 'react';
import { Plus, Users, FileText, BarChart3, Menu, LogOut } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import Badge from '../components/Common/Badge';

const DoctorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: 'Total Consultations', value: '342', icon: FileText, color: 'homoeo-royal' },
    { label: 'Active Patients', value: '47', icon: Users, color: 'homoeo-sky' },
    { label: 'This Month', value: '89', icon: BarChart3, color: 'homoeo-success' },
  ];

  const recentConsultations = [
    {
      id: 1,
      patientName: 'Priya Sharma',
      disease: 'Skin Allergy',
      date: '2024-06-05',
      status: 'completed',
      prescription: 'Arsenicum Album 30C'
    },
    {
      id: 2,
      patientName: 'Rajesh Kumar',
      disease: 'Hair Loss',
      date: '2024-06-05',
      status: 'ongoing',
      prescription: 'Pending'
    },
    {
      id: 3,
      patientName: 'Anita Singh',
      disease: 'Migraine',
      date: '2024-06-04',
      status: 'completed',
      prescription: 'Belladonna 200C'
    },
  ];

  return (
    <div className="flex h-screen bg-homoeo-light">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'}
        bg-homoeo-gradient transition-all duration-300 text-white
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-homoeo-sky border-opacity-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-homoeo-sky rounded-lg flex items-center justify-center">
              <span className="font-bold text-homoeo-dark">HI</span>
            </div>
            {sidebarOpen && <h2 className="font-bold text-lg">Homoeo Intel</h2>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: BarChart3, label: 'Dashboard' },
            { icon: Plus, label: 'New Consultation' },
            { icon: Users, label: 'Patients' },
            { icon: FileText, label: 'Prescriptions' },
          ].map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-homoeo-sky hover:bg-opacity-20 transition-smooth"
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-homoeo-sky border-opacity-30">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-smooth">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-4 p-2 hover:bg-homoeo-sky hover:bg-opacity-20 rounded-lg transition-smooth"
        >
          <Menu size={20} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-homoeo-border p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-homoeo-dark">Dashboard</h1>
            <p className="text-homoeo-text-light">Welcome back, Dr. Sharma</p>
          </div>
          <Button variant="primary">
            <Plus size={20} />
            New Consultation
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="hover:shadow-homoeo-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-homoeo-text-light text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-homoeo-dark">{stat.value}</p>
                  </div>
                  <div className={`w-16 h-16 bg-homoeo-${stat.color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                    <stat.icon className="text-homoeo-royal" size={32} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Consultations */}
          <Card>
            <h2 className="text-2xl font-bold text-homoeo-dark mb-4">Recent Consultations</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-homoeo-border">
                    <th className="text-left py-3 px-4 font-semibold text-homoeo-dark">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold text-homoeo-dark">Disease</th>
                    <th className="text-left py-3 px-4 font-semibold text-homoeo-dark">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-homoeo-dark">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-homoeo-dark">Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConsultations.map((consultation) => (
                    <tr key={consultation.id} className="border-b border-homoeo-border hover:bg-homoeo-light transition-smooth">
                      <td className="py-4 px-4 font-medium text-homoeo-dark">{consultation.patientName}</td>
                      <td className="py-4 px-4 text-homoeo-text-light">{consultation.disease}</td>
                      <td className="py-4 px-4 text-homoeo-text-light">{consultation.date}</td>
                      <td className="py-4 px-4">
                        <Badge variant={consultation.status === 'completed' ? 'success' : 'warning'}>
                          {consultation.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <a href="#" className="text-homoeo-royal hover:underline font-medium">
                          {consultation.prescription}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;