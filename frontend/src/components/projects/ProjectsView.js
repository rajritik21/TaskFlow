import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material';

const ProjectsView = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', teamId: '' });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/projects`, {
        params: { page, limit: 9, search },
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/teams?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(res.data.teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (currentProject) {
        await axios.put(`http://localhost:5001/api/projects/${currentProject._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5001/api/projects`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        teamId: project.teamId?._id || ''
      });
    } else {
      setCurrentProject(null);
      setFormData({ name: '', description: '', teamId: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <h1 className="view-title heading-gradient">Projects</h1>
        <button className="modern-btn modern-btn-primary" onClick={() => openModal()}>
          <Add /> New Project
        </button>
      </div>

      <div className="controls-bar glass-panel" style={{ padding: '16px' }}>
        <div className="search-input" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="modern-input" 
            placeholder="Search projects..." 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading projects...</div>
      ) : (
        <>
          <div className="data-grid">
            {projects.map(project => (
              <div key={project._id} className="data-card glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="card-title">{project.name}</h3>
                  <div className="card-actions">
                    <button className="icon-btn" onClick={() => openModal(project)}><Edit fontSize="small" /></button>
                    <button className="icon-btn" onClick={() => handleDelete(project._id)}><Delete fontSize="small" style={{ color: 'var(--danger)' }} /></button>
                  </div>
                </div>
                <p className="card-desc">{project.description}</p>
                <div className="card-meta">
                  <span><span style={{ color: 'var(--primary)' }}>Team:</span> {project.teamId ? project.teamId.name : 'None'}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
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
              <h3>{currentProject ? 'Edit Project' : 'Create Project'}</h3>
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
              <div className="form-group">
                <label>Team</label>
                <select 
                  className="modern-input"
                  value={formData.teamId}
                  onChange={(e) => setFormData({...formData, teamId: e.target.value})}
                >
                  <option value="">No Team</option>
                  {teams.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="modern-btn modern-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="modern-btn modern-btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
