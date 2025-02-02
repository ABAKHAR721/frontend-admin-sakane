export const LEAD_STATUS = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
  EMAIL_SENT: 'Email envoyé',
  MEETING_SCHEDULED: 'Rendez-vous programmé',
  MEETING_DONE: 'Rendez-vous effectué',
  PROPOSAL_SENT: 'Proposition envoyée',
  NEGOTIATION: 'En négociation',
  WON: 'Gagné',
  LOST: 'Perdu',
  NOT_INTERESTED: 'Pas intéressé',
} as const

export type LeadStatusType = keyof typeof LEAD_STATUS
