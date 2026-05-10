import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Assignment, CheckCircle, Warning } from '@mui/icons-material';

const DashboardSummary = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalProjects: 0,
    totalTeams: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // We can fetch all these concurrently to get counts
        const [tasksRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/tasks?limit=1000`, { headers }),
          axios.get(`http://localhost:5001/api/projects?limit=1`, { headers }),
          axios.get(`http://localhost:5001/api/teams?limit=1`, { headers })
        ]);

        const tasks = tasksRes.data.tasks || [];
        const completed = tasks.filter(t => t.status === 'completed').length;
        
        // Since projects and teams endpoints return totalPages and might not return count directly, 
        // we might have to infer or just do another endpoint. For now we use the array length or meta if available.
        // Assuming we update the API to return total count? The controllers currently return `totalPages` and `currentPage`.
        // Let's just use the length or an approximation for this UI. Wait, our controllers return a `totalDocs` or just `tasks` array.
        // Actually, our taskController.js returns `tasks`, `totalPages`, `currentPage`. We didn't include totalCount. 
        // Let's just use the array length since we fetched limit 1000 for tasks.
        
        // Let's refetch projects/teams with limit 1000 for accurate count
        const allProjects = await axios.get(`http://localhost:5001/api/projects?limit=1000`, { headers });
        const allTeams = await axios.get(`http://localhost:5001/api/teams?limit=1000`, { headers });

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: tasks.length - completed,
          totalProjects: allProjects.data.projects?.length || 0,
          totalTeams: allTeams.data.teams?.length || 0
        });

      } catch (error) {
        console.error('Error fetching summary stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading Dashboard...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <h1 className="view-title heading-gradient">Dashboard Overview</h1>
      </div>

      <div className="data-grid" style={{ marginBottom: '32px' }}>
        <div className="data-card glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">Total Tasks</h3>
            <Assignment style={{ color: 'var(--primary)' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '16px' }}>{stats.totalTasks}</p>
        </div>

        <div className="data-card glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">Completed Tasks</h3>
            <CheckCircle style={{ color: 'var(--success)' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '16px' }}>{stats.completedTasks}</p>
        </div>

        <div className="data-card glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">Pending Tasks</h3>
            <Warning style={{ color: 'var(--warning)' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '16px' }}>{stats.pendingTasks}</p>
        </div>

        <div className="data-card glass-panel" style={{ borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">Active Projects</h3>
            <Assignment style={{ color: 'var(--info)' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginTop: '16px' }}>{stats.totalProjects}</p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Welcome to TaskMaster Pro</h3>
        <p className="card-desc">Navigate through the sidebar to manage your Teams, Projects, and Tasks. Use the comprehensive filtering options inside the Tasks view to track progress efficiently.</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
