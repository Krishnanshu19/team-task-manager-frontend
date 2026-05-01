// src/pages/AuthPage.jsx
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg3)', padding:'20px' },
  card: { background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', padding:'32px', width:'100%', maxWidth:'380px' },
  logo: { fontFamily:'var(--ffs)', fontSize:'24px', fontWeight:700, textAlign:'center', marginBottom:'6px', color:'var(--t1)' },
  accent: { color:'#1D9E75' },
  sub: { fontSize:'12px', color:'var(--t2)', textAlign:'center', marginBottom:'24px' },
  tabs: { display:'flex', background:'var(--bg2)', borderRadius:'var(--radius)', padding:'3px', marginBottom:'20px' },
  tab: { flex:1, textAlign:'center', padding:'6px', borderRadius:'6px', cursor:'pointer', fontSize:'12px', color:'var(--t2)', border:'none', background:'transparent', fontFamily:'var(--ff)', transition:'all 0.15s' },
  tabActive: { background:'var(--bg)', color:'var(--t1)', fontWeight:500 },
  label: { fontSize:'11px', color:'var(--t2)', marginBottom:'4px', display:'block' },
  input: { width:'100%', padding:'8px 10px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--t1)', fontSize:'13px', fontFamily:'var(--ff)', outline:'none', marginBottom:'12px', transition:'border 0.15s' },
  btn: { width:'100%', padding:'10px', background:'#1D9E75', color:'#fff', border:'none', borderRadius:'var(--radius)', fontSize:'13px', fontWeight:500, fontFamily:'var(--ff)', cursor:'pointer', transition:'background 0.15s' },
  err: { fontSize:'12px', color:'#E24B4A', marginBottom:'10px', padding:'8px', background:'#FCEBEB', borderRadius:'var(--radius)' },
}

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return }
        await signup(form.name, form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>task<span style={s.accent}>OS</span></div>
        <div style={s.sub}>Team-wide task intelligence</div>

        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab==='login' ? s.tabActive : {}) }} onClick={() => { setTab('login'); setError('') }}>Login</button>
          <button style={{ ...s.tab, ...(tab==='signup' ? s.tabActive : {}) }} onClick={() => { setTab('signup'); setError('') }}>Sign up</button>
        </div>

        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={submit}>
          {tab === 'signup' && (
            <>
              <label style={s.label}>Full name</label>
              <input style={s.input} type="text" placeholder="Alex Morgan" value={form.name} onChange={set('name')} required />
            </>
          )}
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder={tab==='signup' ? 'Min 6 characters' : '••••••••'} value={form.password} onChange={set('password')} required />

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {tab === 'login' && (
          <div style={{ marginTop:'16px', padding:'12px', background:'var(--bg2)', borderRadius:'var(--radius)', fontSize:'11px', color:'var(--t2)' }}>
            <strong style={{ color:'var(--t1)' }}>Demo credentials:</strong><br />
            Admin: admin@taskos.io / admin123<br />
            Member: jordan@taskos.io / member123
          </div>
        )}
      </div>
    </div>
  )
}
