export interface ContactEntry {
  label: string;
  detail: string;
  phoneNumber: string;
}

export const CONTACTS: ContactEntry[] = [
  {
    label: 'Emergency Services',
    detail: 'Life-threatening emergency',
    phoneNumber: '911',
  },
  {
    label: 'Ski Patrol',
    detail: 'On-mountain injury response — update with your resort’s number',
    phoneNumber: '911',
  },
];
