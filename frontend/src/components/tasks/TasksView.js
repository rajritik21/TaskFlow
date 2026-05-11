import React, { useState, useEffect ,useCallback} from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material';

const TasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo', priority: 'medium', projectId: '', assignedTo: '', dueDate: '' });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        params: { 
          page, 
          limit: 9, 
          search, 
          status: filterStatus,
          projectId: filterProject,
          assignedTo: filterMember,
          startDate,
          endDate
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus, filterProject, filterMember, startDate, endDate]);

  const fetchProjectsAndUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const [projectsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/projects?limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProjects(projectsRes.data.projects);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }
  , 
  [fetchTasks]
);

  useEffect(() => {
    fetchProjectsAndUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (currentTask) {
        await axios.put(`${API_BASE_URL}/api/tasks/${currentTask._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/tasks`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId?._id || '',
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setCurrentTask(null);
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium', projectId: '', assignedTo: '', dueDate: '' });
    }
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge badge-success">Completed</span>;
      case 'in-progress': return <span className="badge badge-info">In Progress</span>;
      default: return <span className="badge badge-warning">To Do</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="badge badge-danger">High</span>;
      case 'medium': return <span className="badge badge-info">Medium</span>;
      default: return <span className="badge badge-warning">Low</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <h1 className="view-title heading-gradient">Tasks</h1>
        <button className="modern-btn modern-btn-primary" onClick={() => openModal()}>
          <Add /> New Task
        </button>
      </div>

      <div className="controls-bar glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <div className="search-input" style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 200px' }}>
          <Search style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="modern-input" 
            placeholder="Search tasks..." 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select 
          className="modern-input" 
          style={{ width: '160px' }}
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select 
          className="modern-input" 
          style={{ width: '160px' }}
          value={filterProject}
          onChange={(e) => { setFilterProject(e.target.value); setPage(1); }}
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select 
          className="modern-input" 
          style={{ width: '160px' }}
          value={filterMember}
          onChange={(e) => { setFilterMember(e.target.value); setPage(1); }}
        >
          <option value="">All Members</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="date" 
            className="modern-input" 
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            title="Start Date"
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input 
            type="date" 
            className="modern-input" 
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            title="End Date"
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading tasks...</div>
      ) : (
        <>
          <div className="data-grid">
            {tasks.map(task => (
              <div key={task._id} className="data-card glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="card-title">{task.title}</h3>
                  <div className="card-actions">
                    <button className="icon-btn" onClick={() => openModal(task)}><Edit fontSize="small" /></button>
                    <button className="icon-btn" onClick={() => handleDelete(task._id)}><Delete fontSize="small" style={{ color: 'var(--danger)' }} /></button>
                  </div>
                </div>
                <p className="card-desc">{task.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
                <div className="card-meta">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span><strong style={{color:'var(--primary)'}}>Proj:</strong> {task.projectId ? task.projectId.name : 'N/A'}</span>
                    <span><strong style={{color:'var(--info)'}}>Assign:</strong> {task.assignedTo ? task.assignedTo.username : 'Unassigned'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                    <span>{task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}</span>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
               <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                 No tasks match your filters.
               </div>
            )}
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
              <h3>{currentTask ? 'Edit Task' : 'Create Task'}</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}><Close /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Status</label>
                  <select 
                    className="modern-input"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select 
                    className="modern-input"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Project</label>
                  <select 
                    className="modern-input"
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">No Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Assign To</label>
                  <select 
                    className="modern-input"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="modern-input" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="modern-btn modern-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="modern-btn modern-btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
