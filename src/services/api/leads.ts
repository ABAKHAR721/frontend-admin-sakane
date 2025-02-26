import axios from './request';
import { Lead } from '@/types/leads';

export const addLead = async (lead: Partial<Lead>): Promise<Lead> => {
  const { data } = await axios.post('/leads', lead);
  return data;
};

export const updateLead = async (id: string, lead: Partial<Lead>): Promise<Lead> => {
  const { data } = await axios.put(`/leads/${id}`, lead);
  return data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await axios.delete(`/leads/${id}`);
};
