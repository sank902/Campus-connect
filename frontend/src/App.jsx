import React, { useState, useEffect, Fragment } from 'react';
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  User,
  Menu,
  X,
  Bell,
  ChevronRight,
  Plus,
  Check,
  ShieldCheck,
  Loader2,
  LogOut,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle,
  Eye,
  Key,
  AtSign,
  ArrowRight,
  BookUser,
  Trash2,
  AlertTriangle,
  Send, // New icon for dashboard hero
  Sparkles // New icon for dashboard hero
} from 'lucide-react';

// --- API Base URL ---
const API_URL = 'http://localhost:5001/api';

// --- Main App Component ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <MainAppLayout user={currentUser} onLogout={handleLogout} token={token} />
  );
}

// --- Login Page Component (Redesigned) ---
function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isRegistering 
      ? `${API_URL}/auth/register` 
      : `${API_URL}/auth/login`;
      
    const payload = isRegistering 
      ? { name, email, password } 
      : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isRegistering) {
        setIsRegistering(false);
        setError('Registration successful! Please log in.');
      } else {
        onLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-brand-dark font-sans
                    bg-[linear-gradient(45deg,_#111827,_#0e7490,_#a5f3fc,_#111827)] 
                    bg-[size:400%_400%] animate-gradient-bg">
      
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center items-center space-x-3 mb-8">
            <Building className="w-10 h-10 text-brand-accent-light"/>
            <h1 className="text-3xl font-bold text-white">Campus Connect</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
          <h2 className="text-3xl font-bold text-white text-center">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-300 text-center mt-2">
            {isRegistering ? 'Join the community!' : 'Sign in to your hub.'}
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="relative">
                <User className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg shadow-sm
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <AtSign className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg shadow-sm
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Key className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                className="w-full pl-12 pr-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg shadow-sm
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className={`p-3 rounded-lg flex items-center space-x-2 text-sm ${error.includes('successful') 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {error.includes('successful') ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-brand-accent hover:bg-brand-accent-dark 
                         focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark
                         transition-all duration-200 shadow-lg shadow-brand-accent/30 hover:shadow-brand-accent/40
                         flex items-center justify-center disabled:opacity-70 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Fragment>
                  <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Fragment>
              )}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="font-semibold text-brand-accent-light hover:text-white ml-1"
            >
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


// --- Main Application UI ---
function MainAppLayout({ user, onLogout, token }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} token={token} setCurrentPage={setCurrentPage} />;
      case 'lostfound':
        return <LostAndFound user={user} token={token} />;
      case 'feedback':
        return <Feedback user={user} token={token} />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Dashboard user={user} token={token} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-light text-gray-900 font-sans">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          setIsSidebarOpen={setIsSidebarOpen}
          currentPage={currentPage}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

// --- Layout Components (Redesigned) ---

function Sidebar({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen, onLogout }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'lostfound', name: 'Lost & Found', icon: Search },
    { id: 'feedback', name: 'Feedback', icon: MessageSquare },
    { id: 'profile', name: 'Profile', icon: User },
  ];
  
  const NavLink = ({ id, name, icon: Icon }) => (
    <button
      onClick={() => {
        setCurrentPage(id);
        setIsSidebarOpen(false);
      }}
      className={`
        flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg
        transition-all duration-200
        ${currentPage === id
          ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/30'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="truncate">{name}</span>
    </button>
  );

  return (
    <Fragment>
      {/* Mobile Sidebar Backdrop */}
      <div 
        className={`
          fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity
          lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      {/* Main Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col
          w-64 h-full bg-brand-dark text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <Building className="w-7 h-7 text-brand-accent-light"/>
            <h1 className="text-xl font-bold text-white">Campus Connect</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => <NavLink key={item.id} {...item} />)}
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3 text-brand-alert" />
            Sign Out
          </button>
        </div>
      </aside>
    </Fragment>
  );
}

function Header({ user, setIsSidebarOpen, currentPage }) {
  const pageTitles = {
    dashboard: 'Dashboard',
    lostfound: 'Lost & Found',
    feedback: 'Feedback',
    profile: 'My Profile',
  };
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 
                       bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {pageTitles[currentPage]}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-500 hover:text-gray-800">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-brand-alert rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <img 
            src={`https://placehold.co/100x100/a5f3fc/111827?text=${user.name.charAt(0)}`} 
            alt="User Avatar" 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-brand-accent-light"
          />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- NEW: Dashboard Hero Component ---
function DashboardHero({ user, setCurrentPage }) {
  return (
    <div className="relative p-8 rounded-2xl shadow-xl overflow-hidden mb-8
                    text-white
                    bg-[linear-gradient(45deg,_#0e7490,_#06b6d4,_#a5f3fc)] 
                    bg-[size:200%_200%] animate-gradient-bg">
      <div className="relative z-10">
        <h2 className="text-4xl font-bold">Welcome back, {user.name}!</h2>
        <p className="text-lg text-cyan-100 mt-2">
          This is your central hub. Find what's new on campus.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setCurrentPage('lostfound')}
            className="px-6 py-3 bg-white text-brand-dark font-semibold rounded-lg shadow-md
                       hover:bg-gray-200 transition-all duration-200
                       flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Lost & Found</span>
          </button>
          
          {user.role === 'admin' && (
             <button 
              onClick={() => { /* This needs to open the 'Create Event' modal, which is in Dashboard */ }}
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg shadow-md
                         hover:bg-white/30 transition-all duration-200
                         flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


// --- Page Components (Redesigned) ---

function Dashboard({ user, token, setCurrentPage }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);
  
  // --- MODIFIED DashboardHero ---
  // We pass the "Create Event" modal logic up to the hero
  const DashboardHero = () => (
    <div className="relative p-8 rounded-2xl shadow-xl overflow-hidden mb-8
                    text-white
                    bg-[linear-gradient(45deg,_#0e7490,_#06b6d4,_#a5f3fc)] 
                    bg-[size:200%_200%] animate-gradient-bg">
      <div className="relative z-10">
        <h2 className="text-4xl font-bold">Welcome back, {user.name}!</h2>
        <p className="text-lg text-cyan-100 mt-2">
          This is your central hub. Find what's new on campus.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setCurrentPage('lostfound')}
            className="px-6 py-3 bg-white text-brand-dark font-semibold rounded-lg shadow-md
                       hover:bg-gray-200 transition-all duration-200
                       flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Lost & Found</span>
          </button>
          
          {user.role === 'admin' && (
             <button 
              onClick={() => setShowCreateModal(true)} // This now works
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg shadow-md
                         hover:bg-white/30 transition-all duration-200
                         flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
  // --- End DashboardHero ---

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };
  
  const confirmRegistration = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(`${API_URL}/events/${selectedEvent._id}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      if (!response.ok) throw new Error('Registration failed');
      const updatedEvent = await response.json();
      setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
    } catch (error) {
      console.error("Failed to register:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setShowRegisterModal(false);
      setSelectedEvent(null);
    }
  };
  
  const handleCreateEvent = async (eventData) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to create event');
      const newEvent = await response.json();
      setEvents([newEvent, ...events]);
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-brand-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-brand-alert font-semibold">Error: {error}</div>;
  }

  const registeredEvents = events.filter(e => e.registeredUsers?.includes(user.id));
  const upcomingEvents = events.filter(e => !e.registeredUsers?.includes(user.id));

  return (
    <div className="space-y-8">
      {/* --- NEW HERO BANNER --- */}
      <DashboardHero />

      {/* My Registered Events */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Registered Events</h3>
        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map(event => (
              <EventCard key={event._id} event={event} formatDate={formatDate} isRegistered={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
            <BookUser className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-4">You haven't registered for any events yet.</p>
            <p className="text-gray-400 text-sm">Check out the upcoming events below!</p>
          </div>
        )}
      </section>
      
      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">Upcoming Events</h3>
          {/* Admin button is now in the hero */}
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventListItem 
                key={event._id} 
                event={event} 
                formatDate={formatDate} 
                onRegister={handleRegisterClick} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events to show.</p>
        )}
      </section>
      
      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-2">
            Confirm Registration
          </h3>
          <div className="mt-4">
            <p className="text-md text-gray-700">
              Are you sure you want to register for <span className="font-semibold">{selectedEvent.title}</span>?
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-brand-accent" />
                {formatDate(selectedEvent.date)}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-2 text-brand-accent" />
                {selectedEvent.location}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowRegisterModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent-dark shadow-lg shadow-brand-accent/30 transition-all duration-200"
              onClick={confirmRegistration}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
      
      {/* Create Event Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <EventForm 
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateEvent}
          />
        </Modal>
      )}
    </div>
  );
}

// --- Dashboard Sub-Components (Redesigned) ---

const EventCard = ({ event, formatDate, isRegistered }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    <div className="p-5">
      <h4 className="text-lg font-semibold text-brand-accent-dark">{event.title}</h4>
      <p className="text-sm text-gray-600 mt-2 flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
        {formatDate(event.date)}
      </p>
      <p className="text-sm text-gray-600 mt-2 flex items-center">
        <User className="w-4 h-4 mr-2 text-gray-400" />
        {event.location}
      </p>
      <p className="text-sm text-gray-700 mt-4 line-clamp-3">{event.description}</p>
    </div>
    {isRegistered && (
      <div className="px-5 py-3 bg-green-50 border-t border-green-200">
         <p className="text-sm font-medium text-green-700 flex items-center">
           <CheckCircle className="w-5 h-5 mr-2" />
           Registered
         </p>
      </div>
    )}
  </div>
);

const EventListItem = ({ event, formatDate, onRegister }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row items-start transition-all duration-300 hover:shadow-lg">
    <div className="p-5 flex-1">
      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
      <p className="text-sm text-gray-600 mt-2 flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
        {formatDate(event.date)}
      </p>
      <p className="text-sm text-gray-600 mt-2 flex items-center">
        <User className="w-4 h-4 mr-2 text-gray-400" />
        {event.location}
      </p>
      <p className="text-sm text-gray-700 mt-4 line-clamp-2">{event.description}</p>
    </div>
    <div className="p-5 w-full md:w-auto self-center md:self-auto">
      <button 
        onClick={() => onRegister(event)}
        className="w-full md:w-auto px-6 py-2 bg-brand-accent text-white rounded-lg shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark transition-all duration-200 flex items-center justify-center"
      >
        <span>Register</span>
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  </div>
);

const EventForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const eventDate = new Date(formData.date).toISOString();
    await onSubmit({ ...formData, date: eventDate });
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">
        Create New Event
      </h3>
      <div className="space-y-4">
        <FormInput name="title" label="Event Title" value={formData.title} onChange={handleChange} placeholder="e.g., Spring Hackathon" required />
        <FormInput name="date" label="Date and Time" value={formData.date} onChange={handleChange} type="datetime-local" required />
        <FormInput name="location" label="Location" value={formData.location} onChange={handleChange} placeholder="e.g., Auditorium" required />
        <FormTextarea name="description" label="Description" value={formData.description} onChange={handleChange} rows="4" placeholder="Event details, schedule, etc." required />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onClose}>
          Cancel
        </button>
        <button type="submit"
          disabled={loading}
          className="px-4 py-2 bg-brand-alert text-white rounded-lg shadow-lg shadow-brand-alert/30 hover:bg-brand-alert/90 transition-all duration-200 flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Event'}
        </button>
      </div>
    </form>
  );
};


function LostAndFound({ user, token }) {
  const [activeTab, setActiveTab] = useState('lost');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('lost');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  const openReportModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  
  const handleReportSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to submit report');
      
      const newItem = await response.json();
      setItems([newItem, ...items].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setShowModal(false);
      
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/items/${itemToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Could not delete item');
      }
      setItems(items.filter(i => i._id !== itemToDelete._id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const lostItems = items.filter(item => item.status === 'Lost');
  const foundItems = items.filter(item => item.status === 'Found');
  
  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'lost' ? 'bg-brand-alert/10 text-brand-alert shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'found' ? 'bg-brand-accent/10 text-brand-accent-dark shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Found Items ({foundItems.length})
          </button>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={() => openReportModal('lost')}
            className="flex-1 px-4 py-2 bg-brand-alert text-white rounded-lg shadow-lg shadow-brand-alert/30 hover:bg-brand-alert/90 transition-all duration-200 flex items-center justify-center"
          >
            Report a Lost Item
          </button>
          <button 
            onClick={() => openReportModal('found')}
            className="flex-1 px-4 py-2 bg-brand-accent text-white rounded-lg shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark transition-all duration-200 flex items-center justify-center"
          >
            Report a Found Item
          </button>
        </div>
      </div>
      
      <div className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-brand-alert font-semibold">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'lost' && (
              <Fragment>
                {lostItems.length === 0 && <EmptyState type="Lost" />}
                {lostItems.map(item => (
                  <ItemCard 
                    key={item._id} 
                    item={item} 
                    formatDate={formatDate} 
                    user={user} 
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </Fragment>
            )}
            {activeTab === 'found' && (
              <Fragment>
                {foundItems.length === 0 && <EmptyState type="Found" />}
                {foundItems.map(item => (
                  <ItemCard 
                    key={item._id} 
                    item={item} 
                    formatDate={formatDate} 
                    user={user} 
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </Fragment>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ReportItemForm 
            type={modalType} 
            onClose={() => setShowModal(false)}
            onSubmit={handleReportSubmit} 
          />
        </Modal>
      )}

      {showDeleteModal && itemToDelete && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900 mt-4">
              Delete Item
            </h3>
            <div className="mt-2">
              <p className="text-md text-gray-600">
                Are you sure you want to delete this item?
              </p>
              <p className="text-sm font-medium text-gray-800 bg-gray-100 p-2 mt-2 rounded">
                {itemToDelete.item}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all duration-200 flex items-center disabled:opacity-70"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Trash2 className="w-5 h-5 mr-2" />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- Lost & Found Sub-Components (Redesigned) ---

const ItemCard = ({ item, formatDate, user, onDeleteClick }) => {
  const isLost = item.status === 'Lost';
  const isMine = item.reporter === user.id;
  const isAdmin = user.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      <div className="relative">
        <img 
          src={item.imageUrl || `https://placehold.co/600x400/${isLost ? 'ffe4e6/f43f5e' : 'a5f3fc/0e7490'}?text=${item.item.split(' ').join('+')}`}
          alt={item.item}
          className="h-48 w-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/gray/ffffff?text=Image+Error` }}
        />
        {(isMine || isAdmin) && (
          <button
            onClick={() => onDeleteClick(item)}
            className="absolute top-3 right-3 p-2 bg-white/70 text-red-600 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-all duration-200 backdrop-blur-sm"
            title="Delete this item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.item}</h4>
            <span 
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                isLost ? 'bg-brand-alert/10 text-brand-alert' : 'bg-brand-accent/10 text-brand-accent-dark'
              }`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            {isLost ? 'Last seen' : 'Found'} at <span className="font-medium ml-1">{item.location}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            On {formatDate(item.date)}
          </p>
          <p className="text-sm text-gray-700 mt-4 line-clamp-3">{item.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          {isMine ? (
             <p className="text-sm font-medium text-gray-500 flex items-center justify-center">
               <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
               You reported this
             </p>
          ) : (
            <button className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              Contact Reporter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ type }) => (
  <div className="md:col-span-2 lg:col-span-3 text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <Search className="w-16 h-16 text-gray-300 mx-auto" />
    <h3 className="text-xl font-semibold text-gray-800 mt-4">No {type} Items Found</h3>
    <p className="text-gray-500 mt-2">There are currently no {type.toLowerCase()} items listed.</p>
    <p className="text-gray-400 text-sm">Check back later or report an item yourself!</p>
  </div>
);


const ReportItemForm = ({ type, onClose, onSubmit }) => {
  const isLost = type === 'lost';
  const [formData, setFormData] = useState({
    item: '',
    location: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    description: '',
    imageUrl: '',
    status: isLost ? 'Lost' : 'Found'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">
        Report a {isLost ? 'Lost' : 'Found'} Item
      </h3>
      <div className="space-y-4">
        <FormInput name="item" label="Item Name" value={formData.item} onChange={handleChange} placeholder="e.g., Blue Water Bottle" required />
        <FormInput name="location" label={isLost ? 'Last Seen Location' : 'Location Found'} value={formData.location} onChange={handleChange} placeholder="e.g., Library, 2nd Floor" required />
        <FormInput name="date" label={`Date ${isLost ? 'Lost' : 'Found'}`} value={formData.date} onChange={handleChange} type="date" required />
        <FormInput name="imageUrl" label="Image URL (Optional)" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
        <FormTextarea name="description" label="Description" value={formData.description} onChange={handleChange} rows="3" placeholder="Any additional details (color, brand, etc.)" />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onClose}>
          Cancel
        </button>
        <button type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 ${
            isLost 
              ? 'bg-brand-alert shadow-lg shadow-brand-alert/30 hover:bg-brand-alert/90' 
              : 'bg-brand-accent shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark'
          }`}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Report'}
        </button>
      </div>
    </form>
  );
};


function Feedback({ user, token }) {
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userId: user.id, feedbackType, message });
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Submit Feedback</h3>
        <p className="text-gray-600 mb-6">
          Have a suggestion, bug report, or general feedback? We'd love to hear it!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback Type</label>
            <div className="flex flex-wrap gap-2">
              {['Suggestion', 'Bug Report', 'General'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFeedbackType(type.toLowerCase().replace(' ', ''))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    feedbackType === type.toLowerCase().replace(' ', '')
                      ? 'bg-brand-accent/10 text-brand-accent-dark ring-2 ring-brand-accent/50'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <FormTextarea name="message" label="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows="5" placeholder="Share your thoughts..." required />
          
          <div className="flex justify-between items-center pt-4">
            {submitted ? (
              <p className="text-sm font-medium text-green-600 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Thank you! Your feedback has been submitted.
              </p>
            ) : ( <span /> )}
            <button type="submit"
              className="px-6 py-2 bg-brand-accent text-white rounded-lg shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark transition-all duration-200">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Profile({ user }) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <img 
            src={`https://placehold.co/150x150/a5f3fc/111827?text=${user.name.charAt(0)}`}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-brand-accent-light"
          />
          <div className="mt-4 sm:mt-0 sm:ml-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-xl font-medium text-brand-accent-dark capitalize">{user.role}</p>
            <p className="text-md text-gray-500 mt-1">{user.email}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoField label="Full Name" value={user.name} />
            <InfoField label="Email Address" value={user.email} />
            <InfoField label="User ID" value={user.id} />
            <InfoField label="Account Type" value={user.role} className="capitalize" />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value, className = '' }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`text-md font-semibold text-gray-800 ${className}`}>{value}</p>
  </div>
);


// --- Utility Components (Redesigned) ---

function Modal({ children, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs"></div>
      <div 
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg m-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Reusable FormInput
const FormInput = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
    />
  </div>
);

// Reusable FormTextarea
const FormTextarea = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
    />
  </div>
);