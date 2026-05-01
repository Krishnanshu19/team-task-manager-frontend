// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/api'
import { Card, CardHeader, StatCard, StatusBadge, PriorityBadge, Spinner, Avatar } from '../components/ui'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/tasks'), api.get('/projects')])
      .then(([t, p]) => { setTasks(t.data); setProjects(p.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const today = new Date().toISOString().split('T')[0]
  const myTasks = isAdmin ? tasks : tasks.filter(t => t.assignee?.id === user.id)
  const done = myTasks.filter(t => t.status === 'DONE').length
  const inProg = myTasks.filter(t => t.status === 'IN_PROGRESS').length
  const overdue = myTasks.filter(t => t.status !== 'DONE' && t.dueDate && t.dueDate.split('T')[0] < today).length
  const recent = myTasks.slice(0, 6)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div>
        <h1 style={{ fontFamily:'var(--ffs)', fontSize:'22px', fontWeight:700 }}>Dashboard</h1>
        <div style={{ fontSize:'12px', color:'var(--t2)', marginTop:'2px' }}>
          Good day, {user?.name?.split(' ')[0]} — {done} done, {myTasks.length - done} remaining
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
        <StatCard label="Total Tasks" value={myTasks.length} />
        <StatCard label="Completed" value={done} color="#1D9E75" />
        <StatCard label="In Progress" value={inProg} color="#BA7517" />
        <StatCard label="Overdue" value={overdue} color="#E24B4A" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <Card>
          <CardHeader>Recent Tasks</CardHeader>
          {recent.length === 0
            ? <div style={{ padding:'24px', textAlign:'center', color:'var(--t3)', fontSize:'12px' }}>No tasks yet</div>
            : recent.map(t => (
              <div key={t.id} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', alignItems:'center', gap:'8px', padding:'10px 16px', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize:'12px', color: t.status==='DONE' ? 'var(--t3)' : 'var(--t1)', textDecoration: t.status==='DONE' ? 'line-through' : 'none' }}>{t.title}</div>
                  <div style={{ fontSize:'10px', color:'var(--t3)', marginTop:'2px' }}>{t.project?.name}</div>
                </div>
                <StatusBadge status={t.status} />
                <div style={{ fontSize:'10px', color: t.dueDate?.split('T')[0] < today && t.status!=='DONE' ? '#E24B4A' : 'var(--t3)' }}>
                  {t.dueDate ? t.dueDate.split('T')[0] : '—'}
                </div>
              </div>
            ))
          }
        </Card>

        <Card>
          <CardHeader>Projects</CardHeader>
          {projects.slice(0, 5).map(p => {
            const total = p.tasks?.length || 0
            const doneCount = p.tasks?.filter(t => t.status==='DONE').length || 0
            const pct = total ? Math.round(doneCount / total * 100) : 0
            return (
              <div key={p.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'12px', fontWeight:500 }}>{p.name}</span>
                  <span style={{ fontSize:'11px', color:'var(--t2)' }}>{pct}%</span>
                </div>
                <div style={{ height:'4px', background:'var(--bg2)', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background: pct > 60 ? '#1D9E75' : '#BA7517', borderRadius:'2px', transition:'width 0.4s' }} />
                </div>
                <div style={{ fontSize:'10px', color:'var(--t3)', marginTop:'4px' }}>{total} tasks · {p.members?.length || 0} members</div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
