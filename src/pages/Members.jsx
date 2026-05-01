// src/pages/Members.jsx
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { Card, Btn, Badge, Spinner, Empty, Avatar } from '../components/ui'

export default function Members() {
  const { user: me, isAdmin } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return }
    api.get('/members').then(r => setMembers(r.data)).finally(() => setLoading(false))
  }, [isAdmin])

  const toggleRole = async (member) => {
    const newRole = member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN'
    const res = await api.patch(`/members/${member.id}/role`, { role: newRole })
    setMembers(ms => ms.map(m => m.id === member.id ? { ...m, role: res.data.role } : m))
  }

  const removeMember = async (id) => {
    if (!confirm('Remove this member?')) return
    await api.delete(`/members/${id}`)
    setMembers(ms => ms.filter(m => m.id !== id))
  }

  if (!isAdmin) return (
    <div style={{ padding:'40px', textAlign:'center', color:'var(--t2)' }}>
      <div style={{ fontSize:'24px', marginBottom:'8px' }}>🔒</div>
      <div>Admin access required to manage members.</div>
    </div>
  )

  if (loading) return <Spinner />

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:'var(--ffs)', fontSize:'22px', fontWeight:700 }}>Team Members</h1>
          <div style={{ fontSize:'12px', color:'var(--t2)', marginTop:'2px' }}>{members.length} members · role-based access control</div>
        </div>
      </div>

      {members.length === 0 ? <Empty message="No members yet." /> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
          {members.map(m => (
            <div key={m.id} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px' }}>
              <Avatar name={m.name} size={40} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:500, fontSize:'13px' }}>{m.name} {m.id === me?.id && <span style={{ fontSize:'10px', color:'var(--t3)' }}>(you)</span>}</div>
                <div style={{ fontSize:'11px', color:'var(--t2)', marginTop:'1px' }}>{m.email}</div>
                <div style={{ fontSize:'10px', color:'var(--t3)', marginTop:'2px' }}>{m._count?.assignedTasks || 0} assigned tasks</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', alignItems:'flex-end' }}>
                <Badge color={m.role === 'ADMIN' ? 'teal' : 'blue'}>{m.role}</Badge>
                {m.id !== me?.id && (
                  <div style={{ display:'flex', gap:'4px' }}>
                    <Btn size="sm" onClick={() => toggleRole(m)} style={{ fontSize:'10px', padding:'2px 7px' }}>
                      {m.role === 'ADMIN' ? '↓ Demote' : '↑ Promote'}
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => removeMember(m.id)} style={{ fontSize:'10px', padding:'2px 7px' }}>
                      Remove
                    </Btn>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'16px', marginTop:'4px' }}>
        <div style={{ fontWeight:500, fontSize:'13px', marginBottom:'8px' }}>Role permissions</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'12px', color:'var(--t2)' }}>
          <div>
            <div style={{ fontWeight:500, color:'var(--t1)', marginBottom:'4px' }}>Admin</div>
            <div>• Create / delete projects</div>
            <div>• Add / remove members</div>
            <div>• Manage all tasks</div>
            <div>• Promote / demote roles</div>
          </div>
          <div>
            <div style={{ fontWeight:500, color:'var(--t1)', marginBottom:'4px' }}>Member</div>
            <div>• View assigned projects</div>
            <div>• Update own tasks</div>
            <div>• Change task status</div>
            <div>• View team board</div>
          </div>
        </div>
      </div>
    </div>
  )
}
