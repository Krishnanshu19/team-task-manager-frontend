// src/components/Layout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to:'/', label:'Dashboard', icon:'◈', end:true },
  { to:'/projects', label:'Projects', icon:'⬡' },
  { to:'/tasks', label:'My Tasks', icon:'◻' },
  { to:'/board', label:'Board', icon:'⊟' },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name?.split(' ').map(w=>w[0]).join('') || '?'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gridTemplateRows:'48px 1fr', height:'100vh', background:'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
        <div style={{ fontFamily:'var(--ffs)', fontWeight:700, fontSize:'16px' }}>
          task<span style={{ color:'#1D9E75' }}>OS</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'20px', background: isAdmin ? '#E1F5EE' : '#E6F1FB', color: isAdmin ? '#085041' : '#0C447C', fontWeight:500, letterSpacing:'0.5px' }}>
            {user?.role}
          </span>
          <span style={{ fontSize:'12px', color:'var(--t2)' }}>{user?.name}</span>
          <div style={{ width:28, height:28, borderRadius:'50%', background: isAdmin ? '#1D9E75' : '#378ADD', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:500 }}>
            {initials}
          </div>
          <button onClick={handleLogout} style={{ fontSize:'11px', padding:'4px 8px', border:'1px solid var(--border)', borderRadius:'var(--radius)', background:'var(--bg)', color:'var(--t2)', cursor:'pointer', fontFamily:'var(--ff)' }}>
            logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ borderRight:'1px solid var(--border)', padding:'12px 0', background:'var(--bg2)', overflowY:'auto' }}>
        <div style={{ padding:'6px 12px 4px', fontSize:'10px', letterSpacing:'1px', color:'var(--t3)', textTransform:'uppercase' }}>Workspace</div>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', fontSize:'12px',
            color: isActive ? 'var(--t1)' : 'var(--t2)', fontWeight: isActive ? 500 : 400,
            background: isActive ? 'var(--bg3)' : 'transparent', textDecoration:'none', transition:'all 0.15s'
          })}>
            <span style={{ fontSize:'14px' }}>{n.icon}</span>{n.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div style={{ padding:'12px 12px 4px', fontSize:'10px', letterSpacing:'1px', color:'var(--t3)', textTransform:'uppercase' }}>Team</div>
            <NavLink to="/members" style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', fontSize:'12px',
              color: isActive ? 'var(--t1)' : 'var(--t2)', fontWeight: isActive ? 500 : 400,
              background: isActive ? 'var(--bg3)' : 'transparent', textDecoration:'none', transition:'all 0.15s'
            })}>
              <span style={{ fontSize:'14px' }}>◎</span>Members
            </NavLink>
          </>
        )}
      </div>

      {/* Main content */}
      <div style={{ overflowY:'auto', padding:'24px', background:'var(--bg3)' }}>
        <Outlet />
      </div>
    </div>
  )
}
