'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Briefcase, Plus, Trash2, Edit, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import RegistrationQuestions from '../../events/add/RegistrationQuestions';
import Swal from 'sweetalert2';

export default function ExecPositionsManagement() {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const router = useRouter();
  const questionsRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }

    fetchPositions();
  }, [router]);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/volunteering/exec-positions');
      const data = await response.json();

      if (response.ok) {
        setPositions(data.positions);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem('user'));
    const questions = questionsRef.current?.getQuestions() || [];

    const payload = {
      ...formData,
      questions,
      createdBy: userData._id
    };

    try {
      const url = editingPosition 
        ? `/api/volunteering/exec-positions/${editingPosition._id}`
        : '/api/volunteering/exec-positions';
      
      const method = editingPosition ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: editingPosition ? 'Position updated successfully!' : 'Position created successfully!',
          icon: 'success',
          confirmButtonColor: '#1e3a8a'
        });

        setShowForm(false);
        setEditingPosition(null);
        setFormData({ title: '', description: '', isActive: true });
        fetchPositions();
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to save position',
          icon: 'error',
          confirmButtonColor: '#1e3a8a'
        });
      }
    } catch (error) {
      console.error('Error saving position:', error);
      await Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred',
        icon: 'error',
        confirmButtonColor: '#1e3a8a'
      });
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({
      title: position.title,
      description: position.description,
      isActive: position.isActive
    });
    
    // Set questions in the component
    setTimeout(() => {
      if (questionsRef.current) {
        questionsRef.current.setQuestions(position.questions || []);
      }
    }, 0);
    
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (positionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the position and all its applications!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/volunteering/exec-positions/${positionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Position has been deleted.',
            icon: 'success',
            confirmButtonColor: '#1e3a8a'
          });
          fetchPositions();
        } else {
          const data = await response.json();
          await Swal.fire({
            title: 'Error',
            text: data.error || 'Failed to delete position',
            icon: 'error',
            confirmButtonColor: '#1e3a8a'
          });
        }
      } catch (error) {
        console.error('Error deleting position:', error);
        await Swal.fire({
          title: 'Error',
          text: 'Failed to delete position',
          icon: 'error',
          confirmButtonColor: '#1e3a8a'
        });
      }
    }
  };

  const toggleActive = async (position) => {
    try {
      const response = await fetch(`/api/volunteering/exec-positions/${position._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !position.isActive })
      });

      if (response.ok) {
        fetchPositions();
      }
    } catch (error) {
      console.error('Error toggling position status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading positions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              router.push('/pages/dashboard/volunteering');
            }}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Volunteering Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-accent to-accent-light rounded-2xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-white">Exec Positions</h1>
                <p className="text-gray-300 text-lg mt-2">{positions.length} total positions</p>
              </div>
            </div>

            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingPosition(null);
                  setFormData({ title: '', description: '', isActive: true });
                  window.scrollTo(0, 0);
                }}
                className="bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold flex items-center gap-2 justify-center group"
              >
                <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                Create New Position
              </button>
            )}
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-gray-900/50 border-2 border-gray-700 rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-black text-white mb-8">
              {editingPosition ? 'Edit Position' : 'Create New Position'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-white font-bold mb-3 text-lg">Position Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Social Media Coordinator"
                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-3 text-lg">Description *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the position, responsibilities, and requirements..."
                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-accent transition"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-7"></div>
                  </div>
                  <span className="text-white font-bold">Position is Active</span>
                </label>
              </div>

              {/* Questions Component */}
              <RegistrationQuestions ref={questionsRef} />

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-5 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold text-lg"
                >
                  {editingPosition ? 'Update Position' : 'Create Position'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPosition(null);
                    setFormData({ title: '', description: '', isActive: true });
                  }}
                  className="px-8 py-5 bg-gray-800 border-2 border-gray-700 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-bold text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Positions List */}
        {!showForm && (
          <div className="space-y-6">
            {positions.length === 0 ? (
              <div className="bg-gray-900/50 border-2 border-gray-700 rounded-3xl p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No positions created yet.</p>
                <p className="text-gray-500">Create your first executive position to start receiving applications!</p>
              </div>
            ) : (
              positions.map(position => (
                <div
                  key={position._id}
                  className="bg-gray-900/50 border-2 border-gray-700 rounded-2xl p-6 md:p-8 hover:border-accent/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">{position.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          position.isActive 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {position.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{position.description}</p>
                      
                      {position.questions && position.questions.length > 0 && (
                        <p className="text-sm text-gray-400">
                          📝 {position.questions.length} custom question{position.questions.length !== 1 ? 's' : ''}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Created {new Date(position.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:min-w-[200px]">
                      <button
                        onClick={() => handleEdit(position)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => toggleActive(position)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-300 font-bold"
                      >
                        {position.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {position.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(position._id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
