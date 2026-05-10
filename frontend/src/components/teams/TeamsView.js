import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material';

const TeamsView = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/teams`, {
        params: { page, limit: 9, search },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(res.data.teams);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }
  // , [page, search]
);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (currentTeam) {
        await axios.put(`http://localhost:5001/api/teams/${currentTeam._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5001/api/teams`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const openModal = (team = null) => {
    if (team) {
      setCurrentTeam(team);
      setFormData({
        name: team.name,
        description: team.description
      });
    } else {
      setCurrentTeam(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <h1 className="view-title heading-gradient">Teams</h1>
        <button className="modern-btn modern-btn-primary" onClick={() => openModal()}>
          <Add /> New Team
        </button>
      </div>

      <div className="controls-bar glass-panel" style={{ padding: '16px' }}>
        <div className="search-input" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="modern-input" 
            placeholder="Search teams..." 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading teams...</div>
      ) : (
        <>
          <div className="data-grid">
            {teams.map(team => (
              <div key={team._id} className="data-card glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="card-title">{team.name}</h3>
                  <div className="card-actions">
                    <button className="icon-btn" onClick={() => openModal(team)}><Edit fontSize="small" /></button>
                    <button className="icon-btn" onClick={() => handleDelete(team._id)}><Delete fontSize="small" style={{ color: 'var(--danger)' }} /></button>
                  </div>
                </div>
                <p className="card-desc">{team.description}</p>
                <div className="card-meta">
                  <span>{team.members?.length || 0} Members</span>
                  <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="modern-btn modern-btn-secondary" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                className="modern-btn modern-btn-secondary" 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <div className="modal-header">
              <h3>{currentTeam ? 'Edit Team' : 'Create Team'}</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><Close /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="modern-input" 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="modern-btn modern-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="modern-btn modern-btn-primary">Save Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsView;
