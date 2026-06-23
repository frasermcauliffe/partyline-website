import { SITE } from '@/data/site';

export const CONTACT_SUBJECTS = {
	general: 'PartyLine Collective enquiry',
	partnership: 'Ticket partnership enquiry',
	correction: 'Profile or event correction'
} as const;

export function mailtoHref(subject: string): string {
	return `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}`;
}
