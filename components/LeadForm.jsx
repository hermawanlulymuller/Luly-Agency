import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from './LeadForm.module.css';

// Inisialisasi Supabase Client menggunakan Environment Variables
// Mendukung Next.js (process.env) dan Vite (import.meta.env)
const supabaseUrl = typeof window !== 'undefined'
  ? (window.NEXT_PUBLIC_SUPABASE_URL || window.VITE_SUPABASE_URL || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || '');

const supabaseAnonKey = typeof window !== 'undefined'
  ? (window.NEXT_PUBLIC_SUPABASE_ANON_KEY || window.VITE_SUPABASE_ANON_KEY || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

// Buat client jika URL dan Key tersedia, jika tidak maka return null (agar tidak crash saat dev)
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function LeadForm() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!supabase) {
      console.warn("Supabase client belum terkonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL telah diatur di file .env Anda.");
      alert("Konfigurasi Supabase tidak ditemukan. Form tidak dapat dikirim.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            name: name, 
            whatsapp: whatsapp, 
            role: role 
          }
        ]);

      if (error) throw error;

      // Alert sukses sesuai instruksi
      alert("Tim Luly Agency akan WA kamu 1x24 jam");
      
      // Reset form
      setName('');
      setWhatsapp('');
      setRole('');
    } catch (err) {
      console.error("Gagal mengirim data ke Supabase:", err.message);
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Konsultasi Sekarang</h2>
      <p className={styles.subtitle}>Otomatisasikan bisnis digital dan dapatkan jingle orisinal Anda</p>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name-input" className={styles.label}>Nama Lengkap / Brand</label>
          <input
            id="name-input"
            type="text"
            className={styles.input}
            placeholder="Contoh: Kopi Senja / Ahmad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="wa-input" className={styles.label}>Nomor WhatsApp</label>
          <input
            id="wa-input"
            type="tel"
            className={styles.input}
            placeholder="Contoh: 08123456789"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role-select" className={styles.label}>Role Anda</label>
          <select
            id="role-select"
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            <option value="" disabled>Pilih Role</option>
            <option value="UMKM">UMKM</option>
            <option value="Kreator">Kreator</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Permintaan'}
        </button>
      </form>
    </div>
  );
}
