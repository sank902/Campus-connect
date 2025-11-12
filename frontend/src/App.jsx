import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
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
  LogOut
} from 'lucide-react';

// --- API Base URL ---
const API_URL = 'http://localhost:5001/api'; // Make sure this is port 5001

// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Check local storage for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isLoggedIn = !!user;

  const handleLogin = (userData, userToken) => {
    // Store user and token in state and local storage
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    // Clear state and local storage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} token={token} />;
      case 'lostfound':
        return <LostAndFound user={user} token={token} />;
      case 'feedback':
        return <Feedback user={user} token={token} />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Dashboard user={user} token={token} />;
    }
  };

  return (
    // Use the new bright background color
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          setIsSidebarOpen={setIsSidebarOpen}
          currentPage={currentPage}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8 lg:p-10">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

// --- Layout Components ---

// NEW DARK SIDEBAR
function Sidebar({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen }) {
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
          ? 'bg-blue-600 text-white' // New Active Color
          : 'text-gray-300 hover:bg-slate-700 hover:text-white' // New Inactive Color
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      {name}
    </button>
  );

  return (
    <>
      <div 
        className={`
          fixed inset-0 z-20 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity
          lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col
          w-64 h-full bg-slate-900 shadow-lg  
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">Campus Connect</h1>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => <NavLink key={item.id} {...item} />)}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-gray-500">© 2025 Campus Connect Portal.</p>
        </div>
      </aside>
    </>
  );
}

// NEW "FROSTED GLASS" HEADER
function Header({ user, setIsSidebarOpen, currentPage, onLogout }) {
  const pageTitles = {
    dashboard: 'Dashboard',
    lostfound: 'Lost & Found',
    feedback: 'Feedback',
    profile: 'My Profile',
  };

  return (
    // Sticky header with backdrop blur
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {pageTitles[currentPage]}
        </h2>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-5">
        <button className="relative text-gray-500 hover:text-gray-800 transition-colors" title="Notifications (Not Implemented)">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <img 
            src={`https://placehold.co/100x100/4f46e5/e0e7ff?text=${user.name.charAt(0)}`}
            alt="User Avatar" 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-200"
          />
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          title="Logout"
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100/80 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}


// LOGIN PAGE (Corrected)
function LoginPage({ onLogin }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLoginView) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        onLogin(data.user, data.token);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        // Switch to login view and show success message
        setIsLoginView(true);
        setEmail(email); // Pre-fill email
        setPassword(''); // Clear password
        setError('Registration successful! Please log in.');
      } catch (err)
 {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans">
      
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-slate-900 text-white p-12 flex-col justify-center relative">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-6">Campus Connect</h1>
          <p className="text-xl text-blue-100 mb-10 max-w-lg">
            Your all-in-one portal for a smarter, more connected campus life.
          </p>
          <ul className="space-y-5 text-lg">
            <li className="flex items-center">
              <Check className="w-6 h-6 mr-3 text-green-400" />
              <span>Discover & register for <span className="font-semibold">campus events</span></span>
            </li>
            <li className="flex items-center">
              <Search className="w-6 h-6 mr-3 text-green-400" />
              <span>Report or find <span className="font-semibold">lost & found</span> items</span>
            </li>
            <li className="flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-green-400" />
              <span>Provide valuable <span className="font-semibold">feedback</span> to administration</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex items-center justify-center overflow-y-auto">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {isLoginView ? 'Sign in to access your dashboard.' : 'Fill in your details to register.'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="mb-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Alex Johnson" required
                />
              </div>
            )}
            
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Student / Staff Email
              </label>
              <input type="email" id="email" value={email} 
                onChange={(e) => setEmail(e.target.value)} // <-- FIX HERE
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., s12345@campus.edu" required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input type="password" id="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} // <-- FIX HERE
                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Your secure password" required
              />
            </div>

            {error && (
              <p className={`text-sm mb-4 ${error.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {error}
              </p>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
            
            <p className="text-sm text-gray-600 text-center mt-6">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError(null);
                }}
                className="font-semibold text-blue-600 hover:text-blue-500 ml-1"
              >
                {isLoginView ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}

// --- Page Components ---

function Dashboard({ user, token }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

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
    fetchEvents();
  }, [token]);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };
  
  const confirmRegistration = async () => {
    if (!selectedEvent) return;
    setIsRegistering(true);
    try {
      const response = await fetch(`${API_URL}/events/${selectedEvent._id}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) throw new Error('Registration failed');
      const updatedEvent = await response.json();
      setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
      
    } catch (error) {
      console.error("Failed to register:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
      setShowRegisterModal(false);
      setSelectedEvent(null);
    }
  };

  const handleEventSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create event');
      const newEvent = await response.json();
      // Sort events by date after adding
      setEvents(prevEvents => [...prevEvents, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setShowEventModal(false);
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
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 font-semibold">Error: {error}</div>;
  }

  const registeredEvents = events.filter(e => e.registeredUsers?.includes(user.id));
  const upcomingEvents = events.filter(e => !e.registeredUsers?.includes(user.id));

  return (
    <div className="space-y-10">
      {/* My Registered Events */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-5">My Registered Events</h3>
        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map(event => (
              <EventCard key={event._id} event={event} formatDate={formatDate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-500">You haven't registered for any events yet.</p>
          </div>
        )}
      </section>
      
      {/* Upcoming Events */}
      <section>
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 space-y-3 md:space-y-0">
          <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
          {user.role === 'admin' && (
            <button 
              onClick={() => setShowEventModal(true)}
              className="flex items-center justify-center px-4 py-2 bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-700 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </button>
          )}
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventListItem 
                key={event._id} 
                event={event} 
                formatDate={formatDate} 
                onRegister={handleRegister} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-500">No upcoming events at this time.</p>
          </div>
        )}
      </section>
      
      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
            Confirm Registration
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Are you sure you want to register for <span className="font-semibold">{selectedEvent.title}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">{formatDate(selectedEvent.date)}</p>
            <p className="text-sm text-gray-500">{selectedEvent.location}</p>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowRegisterModal(false)}
              disabled={isRegistering}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              onClick={confirmRegistration}
              disabled={isRegistering}
            >
              {isRegistering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isRegistering ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </Modal>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <Modal onClose={() => setShowEventModal(false)}>
          <EventForm 
            onClose={() => setShowEventModal(false)}
            onSubmit={handleEventSubmit}
          />
        </Modal>
      )}
    </div>
  );
}

// --- Dashboard Sub-Components (Styled) ---

const EventCard = ({ event, formatDate }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="p-5">
      <h4 className="text-lg font-semibold text-blue-700">{event.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{formatDate(event.date)}</p>
      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
      <p className="text-sm text-gray-700 mt-3 line-clamp-2">{event.description}</p>
    </div>
    <div className="px-5 py-3 bg-green-100/60 border-t border-green-200">
       <p className="text-sm font-semibold text-green-800 flex items-center">
         <Check className="w-5 h-5 mr-2" />
         Registered
       </p>
    </div>
  </div>
);

const EventListItem = ({ event, formatDate, onRegister }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row items-start md:items-center transition-all duration-200 hover:shadow-md">
    <div className="p-5 flex-1">
      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{formatDate(event.date)}</p>
      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
      <p className="text-sm text-gray-700 mt-3 line-clamp-1">{event.description}</p>
    </div>
    <div className="p-5 w-full md:w-auto">
      <button 
        onClick={() => onRegister(event)}
        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
      >
        Register
        <ChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>
);

const EventForm = ({ onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '', 
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch(err) {
      console.error(err);
      // Let parent handle alert
    }
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">
        Create New Event
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange}
            placeholder="e.g., Spring Hackathon"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
          <input type="datetime-local" name="date" id="date" value={formData.date} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange}
            placeholder="e.g., Engineering Building, Room 101"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange}
            placeholder="Event details, schedule, etc."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onClose}
          disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit"
          className="px-4 py-2 text-white rounded-lg transition-colors bg-rose-600 hover:bg-rose-700 flex items-center"
          disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isSubmitting ? 'Creating...' : 'Create Event'}
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
    fetchItems();
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
        body: JSON.stringify({
          ...formData,
          reporter: user.id
        })
      });
      if (!response.ok) throw new Error('Failed to submit report');
      
      setShowModal(false);
      fetchItems(); // Re-fetch list
      
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. Please try again.');
    }
  };

  // Sort items by date, newest first
  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lostItems = sortedItems.filter(item => item.status === 'Lost');
  const foundItems = sortedItems.filter(item => item.status === 'Found');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Styled Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'lost' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'found' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Found Items ({foundItems.length})
          </button>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={() => openReportModal('lost')}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-1" /> Report Lost
          </button>
          <button 
            onClick={() => openReportModal('found')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-1" /> Report Found
          </button>
        </div>
      </div>
      
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold">Error: {error}</div>
        ) : (
          <>
            {activeTab === 'lost' && (
              <ItemList items={lostItems} type="Lost" user={user} />
            )}
            {activeTab === 'found' && (
              <ItemList items={foundItems} type="Found" user={user} />
            )}
          </>
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
    </div>
  );
}

// --- Lost & Found Sub-Components (Styled) ---

const ItemList = ({ items, type, user }) => (
  <div className="space-y-4">
    {items.length === 0 ? (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
        <Search className="w-12 h-12 text-gray-400 mx-auto" />
        <p className="mt-4 text-gray-500">No {type.toLowerCase()} items reported yet.</p>
      </div>
    ) : (
      items.map(item => (
        <div key={item._id} className="bg-white rounded-lg shadow-sm p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{item.item}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {type === 'Lost' ? 'Last seen' : 'Found'}: <span className="font-medium">{item.location}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Date: {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
              <span 
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  type === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {item.status}
              </span>
              {user.role === 'admin' && (
                <button className="mt-3 flex items-center px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Moderate
                </button>
              )}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

const ReportItemForm = ({ type, onClose, onSubmit }) => {
  const isLost = type === 'lost';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: isLost ? 'Lost' : 'Found'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData); 
    } catch (err) {
      console.error(err);
    }
    // Parent component will close modal, which unmounts this
    // If it didn't unmount, we'd set isSubmitting(false)
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">
        Report a {isLost ? 'Lost' : 'Found'} Item
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="item" className="block text-sm font-medium text-gray-700">Item Name</label>
          <input type="text" name="item" id="item" value={formData.item} onChange={handleChange}
            placeholder="e.g., Blue Hydroflask Water Bottle"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">{isLost ? 'Last Seen Location' : 'Location Found'}</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange}
            placeholder="e.g., Library, 2nd Floor"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date {isLost ? 'Lost' : 'Found'}</label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange}
            placeholder="Any additional details (color, brand, etc.)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onClose}
          disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit"
          className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
            isLost ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
};


function Feedback({ user, token }) {
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Placeholder - In a real app, send to backend
    // You would use the 'token' to authorize this request
    console.log({ feedbackType, message, userId: user.id }); 
    
    setTimeout(() => { // Simulate network request
      setMessage('');
      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Feedback</h3>
        <p className="text-gray-600 mb-6">
          Have a suggestion, bug report, or general feedback? Let us know!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
              <div className="flex flex-wrap gap-3">
                {['suggestion', 'bug', 'general'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFeedbackType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      feedbackType === type
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea name="message" id="message" rows="5" value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>
            <div className="flex justify-between items-center pt-2">
              {submitted ? (
                <p className="text-sm font-medium text-green-600">
                  Thank you! Your feedback has been submitted.
                </p>
              ) : ( <span></span> )}
              <button type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center"
                disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Profile({ user }) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <img 
            src={`https://placehold.co/100x100/4f46e5/e0e7ff?text=${user.name.charAt(0)}`} 
            alt="User Avatar"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-300"
          />
          <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-xl font-medium text-blue-600 capitalize">{user.role}</p>
            <p className="text-md text-gray-500 mt-1">ID: {user.id}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">My Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoField label="Full Name" value={user.name} />
            <InfoField label="Email Address" value={user.email} />
            <InfoField label="Primary Role" value={user.role === 'student' ? 'Student' : 'Administration'} />
            <InfoField label="Joined" value="Fall 2022" />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md font-semibold text-gray-900">{value}</p>
  </div>
);


// --- Utility Components (Styled) ---

function Modal({ children, onClose }) {
  return (
    // Add backdrop blur to the overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-[-1.5rem] px-2 pb-2">
          {children}
        </div>
      </div>
    </div>
  );
}