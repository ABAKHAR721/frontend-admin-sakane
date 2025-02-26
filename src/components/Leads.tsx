import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types/leads';
import { addLead, updateLead, deleteLead } from '../services/api/leads';

export default function Leads() {
  const { leads, loading, error, refreshLeads, purchaseLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    mode: '',
    type: '',
    bedrooms: '',
    area: '',
    budget: '',
    rental_duration: '',
    timing: '',
    address: '',
    lat: null,
    lng: null,
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    status: 'new'
  });

  const handleAddLead = async () => {
    try {
      await addLead(newLead);
      await refreshLeads();
      setNewLead({
        mode: '',
        type: '',
        bedrooms: '',
        area: '',
        budget: '',
        rental_duration: '',
        timing: '',
        address: '',
        lat: null,
        lng: null,
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        status: 'new'
      });
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  const handleUpdateLead = async (leadId: string) => {
    try {
      await updateLead(leadId, newLead);
      await refreshLeads();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      await refreshLeads();
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Leads Management</h1>
      <div>
        <h2>Add New Lead</h2>
        <input type="text" placeholder="Mode" onChange={(e) => setNewLead({ ...newLead, mode: e.target.value })} />
        <input type="text" placeholder="Type" onChange={(e) => setNewLead({ ...newLead, type: e.target.value })} />
        <button onClick={handleAddLead}>Add Lead</button>
      </div>
      <ul>
        {leads.map(lead => (
          <li key={lead.id}>
            {lead.address} - {lead.status}
            <button onClick={() => handleUpdateLead(lead.id)}>Update</button>
            <button onClick={() => handleDeleteLead(lead.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
