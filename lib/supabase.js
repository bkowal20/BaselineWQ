import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function getStudies() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('studies')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function getStudy(id) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('studies')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export async function uploadFile(file) {
  if (!supabase) throw new Error('Supabase not connected');
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('study-files')
    .upload(fileName, file);
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from('study-files')
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function insertStudy(study) {
  if (!supabase) throw new Error('Supabase not connected');
  const { data, error } = await supabase
    .from('studies')
    .insert([study])
    .select()
    .single();
  if (error) throw error;
  return data;
}
