
import React, { useState, useMemo } from 'react';
import { ViewType, WarrantyClaim, SupportTicket, ClaimStatus, TicketStatus, TicketPriority, Comment } from './types';
import { MOCK_CLAIMS, MOCK_TICKETS, BRANCHES } from './constants';
import {
  PlusIcon, ChartBarIcon, DocumentCheckIcon, WrenchScrewdriverIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
  PencilSquareIcon, ExclamationTriangleIcon
} from './components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Helper Functions ---
const timeSince = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `قبل ${Math.floor(interval)} سنة`;
  interval = seconds / 2592000;
  if (interval > 1) return `قبل ${Math.floor(interval)} شهر`;
  interval = seconds / 86400;
  if (interval > 1) return `قبل ${Math.floor(interval)} يوم`;
  interval = seconds / 3600;
  if (interval > 1) return `قبل ${Math.floor(interval)} ساعة`;
  interval = seconds / 60;
  if (interval > 1) return `قبل ${Math.floor(interval)} دقيقة`;
  return `قبل ${Math.floor(seconds)} ثانية`;
};

const getStatusChipStyle = (status: ClaimStatus | TicketStatus) => {
  switch (status) {
    case ClaimStatus.Approved:
    case TicketStatus.Solved:
      return 'bg-green-100 text-green-800';
    case ClaimStatus.Pending:
    case TicketStatus.Open:
      return 'bg-blue-100 text-blue-800';
    case ClaimStatus.RevisionNeeded:
    case TicketStatus.InProgress:
      return 'bg-yellow-100 text-yellow-800';
    case ClaimStatus.Rejected:
      return 'bg-red-100 text-red-800';
    case ClaimStatus.Invoiced:
        return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityChipStyle = (priority: TicketPriority) => {
    return priority === TicketPriority.Urgent ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: ClaimStatus | TicketStatus) => {
    switch (status) {
        case ClaimStatus.Approved:
        case TicketStatus.Solved:
            return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        case ClaimStatus.Pending:
        case TicketStatus.Open:
            return <ClockIcon className="w-5 h-5 text-blue-500" />;
        case ClaimStatus.RevisionNeeded:
        case TicketStatus.InProgress:
            return <PencilSquareIcon className="w-5 h-5 text-yellow-500" />;
        case ClaimStatus.Rejected:
            return <XCircleIcon className="w-5 h-5 text-red-500" />;
        case ClaimStatus.Invoiced:
            return <DocumentCheckIcon className="w-5 h-5 text-indigo-500" />;
        default:
            return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
};


// --- Components defined in App.tsx to avoid extra files ---

const Header = ({ activeView, setActiveView }: { activeView: ViewType; setActiveView: (view: ViewType) => void; }) => {
  // Fix: Used React.ReactElement instead of JSX.Element to resolve the "Cannot find namespace 'JSX'" error.
  const navItems: { id: ViewType; label: string; icon: React.ReactElement; }[] = [
    { id: 'warranty', label: 'مطالبات الضمان', icon: <DocumentCheckIcon className="w-5 h-5" /> },
    { id: 'support', label: 'الدعم الفني', icon: <WrenchScrewdriverIcon className="w-5 h-5" /> },
    { id: 'analytics', label: 'التحليلات', icon: <ChartBarIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-blue-600">مركز الخدمة</span>
          </div>
          <nav className="hidden md:flex items-center space-x-reverse space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeView === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};


const WarrantyView = ({ claims }: { claims: WarrantyClaim[] }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">مطالبات الضمان</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>مطالبة جديدة</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claims.map(claim => (
                    <div key={claim.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{claim.issue}</h3>
                                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${getStatusChipStyle(claim.status)}`}>
                                    {claim.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">رقم الشاصي: {claim.vehicleVIN}</p>
                            <p className="text-sm text-gray-500 mb-4">الفرع: {claim.branch}</p>
                            
                            <div className="border-t border-gray-200 pt-4">
                               <div className="flex items-center justify-between text-xs text-gray-500">
                                   <div className="flex items-center gap-2">
                                        {getStatusIcon(claim.status)}
                                        <span>{claim.id}</span>
                                   </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4"/>
                                        <span>{timeSince(claim.createdAt)}</span>
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SupportView = ({ tickets }: { tickets: SupportTicket[] }) => {
    const isOverdue = (createdAt: Date) => {
        const hours = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        return hours > 48;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">تذاكر الدعم الفني</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>تذكرة جديدة</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map(ticket => (
                    <div key={ticket.id} className={`bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300 ${isOverdue(ticket.createdAt) && ticket.status !== TicketStatus.Solved ? 'border-red-500 border-2' : 'border-gray-200'}`}>
                        {isOverdue(ticket.createdAt) && ticket.status !== TicketStatus.Solved && (
                            <div className="bg-red-500 text-white text-center text-sm font-bold p-1 flex items-center justify-center gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                <span>تجاوزت 48 ساعة</span>
                            </div>
                        )}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{ticket.issue}</h3>
                                <div className="flex flex-col items-end gap-2">
                                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${getStatusChipStyle(ticket.status)}`}>
                                      {ticket.status}
                                  </span>
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPriorityChipStyle(ticket.priority)}`}>
                                      {ticket.priority}
                                  </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">الفرع: {ticket.branch}</p>
                            
                            <div className="border-t border-gray-200 pt-4">
                               <div className="flex items-center justify-between text-xs text-gray-500">
                                   <div className="flex items-center gap-2">
                                        {getStatusIcon(ticket.status)}
                                        <span>{ticket.id}</span>
                                   </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4"/>
                                        <span>{timeSince(ticket.createdAt)}</span>
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AnalyticsDashboard = ({ claims, tickets }: { claims: WarrantyClaim[]; tickets: SupportTicket[] }) => {
    const recurringIssues = useMemo(() => {
        const issueCount: { [key: string]: number } = {};
        claims.forEach(claim => {
            issueCount[claim.issue] = (issueCount[claim.issue] || 0) + 1;
        });
        return Object.entries(issueCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [claims]);
    
    const claimsByStatus = useMemo(() => {
        const statusCount: { [key: string]: number } = {};
        claims.forEach(claim => {
            statusCount[claim.status] = (statusCount[claim.status] || 0) + 1;
        });
        return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    }, [claims]);

    const ticketsByStatus = useMemo(() => {
        const statusCount: { [key: string]: number } = {};
        tickets.forEach(ticket => {
            statusCount[ticket.status] = (statusCount[ticket.status] || 0) + 1;
        });
        return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    }, [tickets]);

    const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">لوحة التحليلات</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">أكثر المشاكل تكراراً في الضمان</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={recurringIssues} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3B82F6" name="عدد التكرارات" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">حالات مطالبات الضمان</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={claimsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {claimsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">حالات تذاكر الدعم الفني</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={ticketsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {ticketsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

const App = () => {
  const [activeView, setActiveView] = useState<ViewType>('warranty');
  const [claims, setClaims] = useState<WarrantyClaim[]>(MOCK_CLAIMS);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);

  const renderContent = () => {
    switch (activeView) {
      case 'warranty':
        return <WarrantyView claims={claims} />;
      case 'support':
        return <SupportView tickets={tickets} />;
      case 'analytics':
        return <AnalyticsDashboard claims={claims} tickets={tickets} />;
      default:
        return <WarrantyView claims={claims} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
