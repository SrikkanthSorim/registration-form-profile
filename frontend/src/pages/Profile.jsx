import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import api from '../services/api.js';

const API_BASE = 'http://localhost:8082';

const COLUMNS = [
  { label: 'Employee ID', renderCell: (item) => item.employeeId },
  {
    label: 'Photo',
    renderCell: (item) => (
      <img className="table-avatar" src={`${API_BASE}${item.imageUrl}`} alt={item.name} />
    )
  },
  { label: 'Name', renderCell: (item) => item.name },
  { label: 'Email', renderCell: (item) => item.email },
  { label: 'Date of Birth', renderCell: (item) => item.dob }
];

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [colleagues, setColleagues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }

    api.get(`/profile/${email}`)
      .then((response) => setProfile(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load profile.'));

    api.get(`/colleagues/${email}`)
      .then((response) => setColleagues(response.data))
      .catch(() => setColleagues([]));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const theme = useTheme([
    getTheme(),
    {
      Table: '--data-table-library_grid-template-columns: 140px 90px 1fr 1.4fr 160px;',
      HeaderRow: `
        background-color: #4f46e5;
        color: #ffffff;
      `,
      HeaderCell: `
        font-weight: 700;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        & > div {
          overflow: visible;
          text-overflow: clip;
          white-space: nowrap;
        }
      `,
      Row: `
        font-size: 14px;
        &:nth-of-type(odd) { background-color: #f8fafc; }
        &:hover { background-color: #eef2ff; }
      `,
      Cell: 'padding: 12px 14px;'
    }
  ]);

  const tableData = {
    nodes: colleagues.map((colleague) => ({ id: colleague.employeeId, ...colleague }))
  };

  if (error) {
    return (
      <div className="page">
        <div className="card"><div className="error">{error}</div></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="page"><div className="card">Loading profile...</div></div>;
  }

  return (
    <div className="page">
      <div className="card profile-card">
        <img className="profile-image" src={`${API_BASE}${profile.imageUrl}`} alt={profile.name} />
        <h1>{profile.name}</h1>
        <div className="profile-details">
          <p><strong>Employee ID:</strong> {profile.employeeId}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Date of Birth:</strong> {profile.dob}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      {colleagues.length > 0 && (
          <div className="colleagues">
            <h2>Your Colleagues</h2>
            <div className="colleagues-table">
              <CompactTable columns={COLUMNS} data={tableData} theme={theme} layout={{ custom: true }} />
            </div>
          </div>
        )}
    </div>
  );
}
