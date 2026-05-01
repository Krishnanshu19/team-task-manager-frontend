// src/pages/Tasks.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/api'
import { Card, CardHeader, Btn, StatusBadge, PriorityBadge, Modal, Input, Select, Spinner, Empty, Avatar } from '../components/ui'

function TaskForm({ projects, members, onSave, onClose, isAdmin }) {
  const [form, setForm] = useState({ title:'', description:'', projectId:'', assigneeId:'', status:'TODO', priority:'MEDIUM', dueDate:'' })
  const [saving, setSaving] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.title || !form.projectId) return
    setSaving(true)
    try {
      const res = await api.post('/tasks', { ...form, assigneeId: form.assigneeId || undefined, dueDate: form.dueDate || undefined })
      onSave(res.data)
      onClose()
    } catch (e) { alert(e.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  return (
    <Modal title="New task" onClose={onClose}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <div style={{ gridColumn:'1/-1' }}>
          <Input label="Title *" value={form.title} onChange={set('title')} placeholder="Task title" />
        </div>
        <Select label="Project *" value={form.projectId} onChange={set('projectId')}>
          <option value="">Select project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Select label="Assign to" value={form.assigneeId} onChange={set('assigneeId')}>
          <option value="">Unassigned</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </Select>
        <Select label="Status" value={form.status} onChange={set('status')}>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
        <Select label="Priority" value={form.priority} onChange={set('priority')}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
        <div style={{ gridColumn:'1/-1' }}>
          <Input label="Due date" type="date" value={form.dueDate} onChange={set('dueDate')} />
        </div>
      </div>
      <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'16px' }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={submit} disabled={saving || !form.title || !form.projectId}>{saving ? 'Adding…' : 'Add task'}</Btn>
      </div>
    </Modal>
  )
}

export default function Tasks() {
  const { user, isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('ALL')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const reqs = [api.get('/tasks'), api.get('/projects')]
    if (isAdmin) reqs.push(api.get('/members'))
    Promise.all(reqs)
      .then(([t, p, m]) => { setTasks(t.data); setProjects(p.data); if (m) setMembers(m.data) })
      .finally(() => setLoading(false))
  }, [isAdmin])

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE'
    const res = await api.patch(`/tasks/${task.id}`, { status: newStatus })
    setTasks(ts => ts.map(t => t.id === task.id ? res.data : t))
  }

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}`)
    setTasks(ts => ts.filter(t => t.id !== id))
  }

  const filtered = tasks.filter(t => {
    if (filter === 'ALL') return true
    if (filter === 'OVERDUE') return t.status !== 'DONE' && t.dueDate && t.dueDate.split('T')[0] < today
    return t.status === filter
  })

  if (loading) return <Spinner />

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:'var(--ffs)', fontSize:'22px', fontWeight:700 }}>Tasks</h1>
          <div style={{ fontSize:'12px', color:'var(--t2)', marginTop:'2px' }}>{tasks.length} total tasks</div>
        </div>
        {isAdmin && <Btn variant="primary" onClick={() => setShowForm(true)}>+ Add task</Btn>}
      </div>

      <div style={{ display:'flex', gap:'4px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'3px', width:'fit-content' }}>
        {['ALL','TODO','IN_PROGRESS','DONE','OVERDUE'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'4px 10px', borderRadius:'5px', border:'none', fontSize:'11px', cursor:'pointer', fontFamily:'var(--ff)',
            background: filter===f ? 'var(--bg3)' : 'transparent',
            color: filter===f ? 'var(--t1)' : 'var(--t2)', fontWeight: filter===f ? 500 : 400
          }}>{f.replace('_',' ')}</button>
        ))}
      </div>

      <Card>
        <div style={{ display:'grid', gridTemplateColumns:'24px 1fr 100px 90px 80px 90px 60px', padding:'8px 16px', borderBottom:'1px solid var(--border)', fontSize:'10px', color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.5px', gap:'8px' }}>
          <span/>
          <span>Title</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Assignee</span>
          <span>Due</span>
          <span/>
        </div>
        {filtered.length === 0 ? <Empty message="No tasks match this filter." /> : filtered.map(t => {
          const isLate = t.status !== 'DONE' && t.dueDate && t.dueDate.split('T')[0] < today
          return (
            <div key={t.id} style={{ display:'grid', gridTemplateColumns:'24px 1fr 100px 90px 80px 90px 60px', alignItems:'center', gap:'8px', padding:'10px 16px', borderBottom:'1px solid var(--border)', transition:'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div onClick={() => toggleStatus(t)} style={{ width:16, height:16, borderRadius:'3px', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'10px', background: t.status==='DONE' ? '#1D9E75' : 'transparent', color:'#fff', flexShrink:0, transition:'all 0.15s' }}>
                {t.status==='DONE' ? '✓' : ''}
              </div>
              <div>
                <div style={{ fontSize:'12px', color: t.status==='DONE' ? 'var(--t3)' : 'var(--t1)', textDecoration: t.status==='DONE' ? 'line-through' : 'none' }}>{t.title}</div>
                <div style={{ fontSize:'10px', color:'var(--t3)' }}>{t.project?.name}</div>
              </div>
              <StatusBadge status={t.status} />
              <PriorityBadge priority={t.priority} />
              <div style={{ fontSize:'11px', color:'var(--t2)' }}>{t.assignee?.name?.split(' ')[0] || '—'}</div>
              <div style={{ fontSize:'11px', color: isLate ? '#E24B4A' : 'var(--t2)' }}>{t.dueDate ? t.dueDate.split('T')[0] : '—'}</div>
              <div style={{ display:'flex', gap:'4px' }}>
                {(isAdmin || t.creator?.id === user?.id) && (
                  <Btn size="sm" variant="danger" onClick={() => deleteTask(t.id)} style={{ padding:'2px 6px', fontSize:'11px' }}>×</Btn>
                )}
              </div>
            </div>
          )
        })}
      </Card>

      {showForm && <TaskForm projects={projects} members={members} onSave={t => setTasks(ts => [t, ...ts])} onClose={() => setShowForm(false)} isAdmin={isAdmin} />}
    </div>
  )
}
