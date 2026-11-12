import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', class: '', school: '', wa_number: '' })
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (type === 'login') {
      const { error } = await signIn(formData)
      if (error) alert(error.message)
      else navigate('/')
    } else {
      const { data, error } = await signUp(formData)
      if (error) { alert(error.message); return; }

      if (data.user) {
        await supabase.from('profiles').update({
          full_name: formData.full_name,
          class: formData.class,
          school: formData.school,
          wa_number: formData.wa_number
        }).eq('id', data.user.id)
      }
      navigate('/')
    }
  }

  const inputStyle = {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    outline: 'none'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg)', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', color: '#22D3EE' }}>{type === 'login' ? 'Login Sprint SMU' : 'Daftar Akun'}</h2>

        <input type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
        <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />

        {type === 'register' && (
          <>
            <input type="text" placeholder="Nama Lengkap" required onChange={(e) => setFormData({...formData, full_name: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="Kelas" required onChange={(e) => setFormData({...formData, class: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="Sekolah" required onChange={(e) => setFormData({...formData, school: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="No WhatsApp" required onChange={(e) => setFormData({...formData, wa_number: e.target.value})} style={inputStyle} />
          </>
        )}

        <button type="submit" style={{ padding: '12px', borderRadius: '10px', border: 'none', background: '#22D3EE', color: '#0B1224', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' }}>
          {type === 'login' ? 'Masuk' : 'Daftar'}
        </button>

        <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'var(--muted)' }}>
          {type === 'login' ? (
            <>Belum punya akun? <Link to="/register" style={{ color: '#22D3EE', fontWeight: 'bold' }}>Daftar</Link></>
          ) : (
            <>Sudah punya akun? <Link to="/login" style={{ color: '#22D3EE', fontWeight: 'bold' }}>Login</Link></>
          )}
        </p>
      </form>
    </div>
  )
}