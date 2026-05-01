// src/pages/Projects.jsx
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { Btn, Modal, Input, Spinner, Empty, Avatar } from '../components/ui'

function NewProjectModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name:'', description:'', color:'#1D9E75' })
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const COLORS = ['#1D9E75','#378ADD','#BA7517','#E24B4A','#534AB7','#D85A30']

  const submit = async () => {
    if (!form.name) return
    setSaving(true)
    try {
      const res = await api.post('/projects', form)
      onSave(res.data); onClose()
    } catch (e) { alert(e.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  return (
    <Modal title="New project" onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        <Input label="Project name *" value={form.name} onChange={set('name')} placeholder="My project" />
        <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
          <label style={{ fontSize:'11px', color:'var(--t2)' }}>Description</label>
          <textarea value={form.description} onChange={set('description')} placeholder="What is this project about?" rows={3}
            style={{ padding:'7px 10px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--t1)', fontSize:'12px', fontFamily:'var(--ff)', resize:'vertical', outline:'none' }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={{ fontSize:'11px', color:'var(--t2)' }}>Color</label>
          <div style={{ display:'flex', gap:'8px' }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => setForm(f => ({ ...f, color:c }))} style={{ width:24, height:24, borderRadius:'50%', background:c, cursor:'pointer', border: form.color===c ? '2px solid var(--t1)' : '2px solid transparent', transition:'border 0.15s' }} />
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'4px' }}>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={submit} disabled={saving || !form.name}>{saving ? 'Creating…' : 'Create project'}</Btn>
        </div>
      </div>
    </Modal>
  )
}

export default function Projects() {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).finally(() => setLoading(false))
  }, [])

  const deleteProject = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return
    await api.delete(`/projects/${id}`)
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  if (loading) return <Spinner />

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:'var(--ffs)', fontSize:'22px', fontWeight:700 }}>Projects</h1>
          <div style={{ fontSize:'12px', color:'var(--t2)', marginTop:'2px' }}>{projects.length} active projects</div>
        </div>
        {isAdmin && <Btn variant="primary" onClick={() => setShowForm(true)}>+ New project</Btn>}
      </div>

      {projects.length === 0 ? <Empty message="No projects yet. Create one!" /> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'14px' }}>
          {projects.map(p => {
            const total = p.tasks?.length || 0
            const done = p.tasks?.filter(t => t.status==='DONE').length || 0
            const pct = total ? Math.round(done / total * 100) : 0
            return (
              <div key={p.id} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'16px', display:'flex', flexDirection:'column', gap:'10px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:p.color, flexShrink:0 }} />
                    <div>
                      <div style={{ fontFamily:'var(--ffs)', fontSize:'15px', fontWeight:700 }}>{p.name}</div>
                      {p.description && <div style={{ fontSize:'11px', color:'var(--t2)', marginTop:'2px' }}>{p.description}</div>}
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => deleteProject(p.id)} style={{ background:'none', border:'none', color:'var(--t3)', cursor:'pointer', fontSize:'16px', lineHeight:1, padding:'0' }}>×</button>
                  )}
                </div>

                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'var(--t2)', marginBottom:'4px' }}>
                    <span>{done}/{total} tasks done</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ height:'4px', background:'var(--bg2)', borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background: pct > 60 ? '#1D9E75' : '#BA7517', borderRadius:'2px', transition:'width 0.5s' }} />
                  </div>
                </div>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:'3px' }}>
                    {p.members?.slice(0,5).map(m => (
                      <Avatar key={m.id} name={m.user?.name} size={22} />
                    ))}
                    {p.members?.length > 5 && <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:'var(--t2)' }}>+{p.members.length - 5}</div>}
                  </div>
                  <div style={{ fontSize:'10px', color:'var(--t3)' }}>by {p.owner?.name?.split(' ')[0]}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <NewProjectModal onSave={p => setProjects(ps => [p, ...ps])} onClose={() => setShowForm(false)} />}
    </div>
  )
}
