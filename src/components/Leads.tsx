import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types/leads';

export default function Leads() {
  const { leads, loading, error, purchaseLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleAddLead = async () => {
    try {
      const addedLead = await addLead(newLead);
      setLeads([...leads, addedLead]);
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

  const handleUpdateLead = async (leadId) => {
    try {
      const updatedLead = await updateLead(leadId, newLead);
      setLeads(leads.map(lead => lead.id === leadId ? updatedLead : lead));
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await deleteLead(leadId);
      setLeads(leads.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

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
