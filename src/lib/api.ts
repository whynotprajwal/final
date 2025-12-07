import { supabase } from './supabase';

// Issues API helper
export const issuesAPI = {
  async createIssue(issue: any) {
    const { data, error } = await supabase
      .from('issues')
      .insert([issue])
      .select();
    if (error) throw error;
    return data;
  },
  async getAllIssues() {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// File Upload API
export const uploadAPI = {
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase
      .storage
      .from('issue-images')
      .upload(path, file);
    if (error) throw error;
    return data;
  },
  getPublicUrl(path: string) {
    const { data } = supabase
      .storage
      .from('issue-images')
      .getPublicUrl(path);
    return data?.publicUrl;
  },
};
