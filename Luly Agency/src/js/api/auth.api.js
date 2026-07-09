import { requireSupabase } from './supabase-client.js';

export async function signUp({ email, password, fullName, whatsapp }) {
  const supabase = requireSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        whatsapp,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const supabase = requireSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export function onAuthStateChange(callback) {
  const supabase = requireSupabase();
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

export async function getProfile() {
  const supabase = requireSupabase();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTeamMembers() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .in('role', ['admin', 'member']);

  if (error) throw error;
  return data;
}
