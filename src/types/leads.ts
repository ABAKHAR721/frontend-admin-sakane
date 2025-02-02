export interface Lead {
    id: string;
    mode: string;
    type: string;
    bedrooms: string;
    area: string;
    budget: string;
    rental_duration: string;
    timing: string;
    address: string;
    lat: number | null;
    lng: number | null;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    status: 'new' | 'purchased';
    created_at: string;
    updated_at: string;
}
