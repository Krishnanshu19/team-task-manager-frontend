// src/pages/Board.jsx
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { StatusBadge, PriorityBadge, Spinner, Avatar } from '../components/ui'

const COLS = [
  { key:'TODO', label:'Todo', color:'#378ADD' },
  { key:'IN_PROGRESS', label:'In Progress', color:'#BA7517' },
  { key:'DONE', label:'Done', color:'#1D9E75' },
]

export default function Board() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tasks').then(res => setTasks(res.data)).finally(() => setLoading(false))
  }, [])

  const move = async (taskId, newStatus) => {
    const res = await api.patch(`/tasks/${taskId}`, { status: newStatus })
    setTasks(ts => ts.map(t => t.id === taskId ? res.data : t))
  }

  if (loading) return <Spinner />

  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      <div>
        <h1 style={{ fontFamily:'var(--ffs)', fontSize:'22px', fontWeight:700 }}>Board</h1>
        <div style={{ fontSize:'12px', color:'var(--t2)', marginTop:'2px' }}>Kanban view — click status to move tasks</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', alignItems:'start' }}>
        {COLS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div key={col.key} style={{ background:'var(--bg2)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
              <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:col.color }} />
                  <span style={{ fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px', color:'var(--t2)' }}>{col.label}</span>
                </div>
                <span style={{ fontSize:'10px', background:'var(--border)', padding:'1px 6px', borderRadius:'8px', color:'var(--t2)' }}>{colTasks.length}</span>
              </div>
              <div style={{ padding:'8px', display:'flex', flexDirection:'column', gap:'6px', minHeight:'100px' }}>
                {colTasks.length === 0
                  ? <div style={{ padding:'20px', textAlign:'center', color:'var(--t3)', fontSize:'11px' }}>Empty</div>
                  : colTasks.map(t => {
                    const isLate = t.status !== 'DONE' && t.dueDate && t.dueDate.split('T')[0] < today
                    return (
                      <div key={t.id} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'10px 12px', cursor:'default' }}>
                        <div style={{ fontSize:'12px', fontWeight:500, marginBottom:'6px', color:'var(--t1)' }}>{t.title}</div>
                        <div style={{ fontSize:'10px', color:'var(--t3)', marginBottom:'8px' }}>{t.project?.name}</div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <PriorityBadge priority={t.priority} />
                          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                            {t.assignee && <Avatar name={t.assignee.name} size={20} />}
                            <span style={{ fontSize:'10px', color: isLate ? '#E24B4A' : 'var(--t3)' }}>
                              {t.dueDate ? t.dueDate.split('T')[0] : ''}
                            </span>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:'4px', marginTop:'8px', borderTop:'1px solid var(--border)', paddingTop:'8px' }}>
                          {COLS.filter(c => c.key !== col.key).map(c => (
                            <button key={c.key} onClick={() => move(t.id, c.key)} style={{
                              flex:1, padding:'3px', fontSize:'10px', border:'1px solid var(--border)', borderRadius:'4px',
                              background:'transparent', color:'var(--t2)', cursor:'pointer', fontFamily:'var(--ff)', transition:'all 0.15s'
                            }}
                              onMouseEnter={e => { e.target.style.background=c.color; e.target.style.color='#fff'; e.target.style.borderColor=c.color }}
                              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='var(--t2)'; e.target.style.borderColor='var(--border)' }}>
                              → {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
