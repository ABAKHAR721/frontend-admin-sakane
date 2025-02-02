import { useMyLeads } from '../hooks/useMyLeads';

export default function MyLeads() {
  const { myLeads, loading, error } = useMyLeads();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Mes Leads Achetés</h1>
      <ul>
        {myLeads.map(lead => (
          <li key={lead.id}>
            {lead.mode} - {lead.type} - {lead.area}m² - {lead.budget}€
            <div className="text-sm text-gray-500">
              Contact: {lead.contact_name} ({lead.contact_email})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
