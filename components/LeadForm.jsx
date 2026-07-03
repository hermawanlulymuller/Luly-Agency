import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './LeadForm.module.css';

export default function LeadForm() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ nama: name, no_wa: whatsapp, role: role }]);
      if (error) throw error;
      alert("Tim Luly Agency akan WA kamu 1x24 jam");
      setName(''); setWhatsapp(''); setRole('');
    } catch (err) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formGlass}>
      <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="tel" placeholder="No WhatsApp 08xxx" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Pilih Role</option>
        <option value="Produser">Produser</option>
        <option value="Brand">Brand</option>
        <option value="Artist">Artist</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Mengirim...' : 'Klaim Lisensi Musik'}
      </button>
    </form>
  );
}
