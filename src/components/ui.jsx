// src/components/ui.jsx
export function Card({ children, style }) {
  return (
    <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', ...style }}>
      {children}
    </div>
  )
}

export function CardHeader({ children, action }) {
  return (
    <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <span style={{ fontSize:'12px', fontWeight:500 }}>{children}</span>
      {action}
    </div>
  )
}

export function Btn({ onClick, children, variant='default', size='md', style, disabled, type='button' }) {
  const base = { display:'inline-flex', alignItems:'center', gap:'6px', border:'1px solid var(--border2)', borderRadius:'var(--radius)', fontFamily:'var(--ff)', cursor:'pointer', transition:'all 0.15s', fontWeight:400 }
  const variants = {
    default: { background:'var(--bg)', color:'var(--t1)' },
    primary: { background:'#1D9E75', color:'#fff', borderColor:'#1D9E75' },
    danger: { background:'transparent', color:'#E24B4A', borderColor:'#E24B4A' },
    ghost: { background:'transparent', color:'var(--t2)', border:'none' },
  }
  const sizes = {
    sm: { padding:'4px 8px', fontSize:'11px' },
    md: { padding:'6px 12px', fontSize:'12px' },
    lg: { padding:'9px 18px', fontSize:'13px' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...sizes[size], opacity: disabled ? 0.6 : 1, ...style }}>
      {children}
    </button>
  )
}

export function Badge({ children, color='gray' }) {
  const colors = {
    gray: { bg:'var(--bg2)', text:'var(--t2)' },
    green: { bg:'#EAF3DE', text:'#3B6D11' },
    blue: { bg:'#E6F1FB', text:'#185FA5' },
    amber: { bg:'#FAEEDA', text:'#854F0B' },
    red: { bg:'#FCEBEB', text:'#A32D2D' },
    teal: { bg:'#E1F5EE', text:'#085041' },
  }
  const c = colors[color] || colors.gray
  return (
    <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'20px', fontWeight:500, background:c.bg, color:c.text, whiteSpace:'nowrap' }}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = { TODO:['Todo','blue'], IN_PROGRESS:['In Progress','amber'], DONE:['Done','green'] }
  const [label, color] = map[status] || ['Unknown','gray']
  return <Badge color={color}>{label}</Badge>
}

export function PriorityBadge({ priority }) {
  const map = { LOW:['Low','gray'], MEDIUM:['Medium','blue'], HIGH:['High','red'] }
  const [label, color] = map[priority] || ['Medium','blue']
  return <Badge color={color}>{label}</Badge>
}

export function Avatar({ name, size=28, color }) {
  const initials = name?.split(' ').map(w=>w[0]).join('').slice(0,2) || '?'
  const colors = ['#1D9E75','#378ADD','#BA7517','#E24B4A','#534AB7','#D85A30']
  const bg = color || colors[name?.charCodeAt(0) % colors.length] || '#1D9E75'
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:500, flexShrink:0 }}>
      {initials}
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', color:'var(--t3)', fontSize:'12px' }}>
      Loading…
    </div>
  )
}

export function Empty({ message='Nothing here yet.' }) {
  return (
    <div style={{ padding:'32px', textAlign:'center', color:'var(--t3)', fontSize:'12px' }}>
      {message}
    </div>
  )
}

export function Input({ label, ...props }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
      {label && <label style={{ fontSize:'11px', color:'var(--t2)' }}>{label}</label>}
      <input style={{ padding:'7px 10px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--t1)', fontSize:'12px', fontFamily:'var(--ff)', outline:'none', width:'100%' }} {...props} />
    </div>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
      {label && <label style={{ fontSize:'11px', color:'var(--t2)' }}>{label}</label>}
      <select style={{ padding:'7px 10px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--t1)', fontSize:'12px', fontFamily:'var(--ff)', outline:'none', width:'100%' }} {...props}>
        {children}
      </select>
    </div>
  )
}

export function Modal({ title, onClose, children, width=480 }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'16px' }}>
      <div style={{ background:'var(--bg)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border2)', width:'100%', maxWidth:width, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontWeight:500, fontSize:'14px' }}>{title}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'18px', color:'var(--t2)', cursor:'pointer', lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:'20px' }}>{children}</div>
      </div>
    </div>
  )
}

export function StatCard({ label, value, color }) {
  return (
    <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 16px' }}>
      <div style={{ fontSize:'10px', color:'var(--t2)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px' }}>{label}</div>
      <div style={{ fontSize:'26px', fontWeight:500, fontFamily:'var(--ffs)', color: color || 'var(--t1)' }}>{value}</div>
    </div>
  )
}
