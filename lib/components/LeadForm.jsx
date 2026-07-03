import { supabase } from '@/lib/supabase' // <- ambil dari file lib tadi

const { error } = await supabase
  .from('leads')
  .insert([{ nama: name, no_wa: whatsapp, role: role }]);