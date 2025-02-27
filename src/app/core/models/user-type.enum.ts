export enum UserType {
  CITIZEN = 'CITIZEN',
  LOCAL_LEVEL_EMPLOYEE = 'LOCAL_LEVEL_EMPLOYEE',
  ELECTED_REPRESENTATIVE = 'ELECTED_REPRESENTATIVE',
  GOVERNMENT_INSTITUTIONAL = 'GOVERNMENT_INSTITUTIONAL',
  SPECIAL_USER = 'SPECIAL_USER',
  SPECIAL_SERVICE_PROVIDER = 'SPECIAL_SERVICE_PROVIDER',
  MEDIA_AND_PUBLIC_COMMUNICATION = 'MEDIA_AND_PUBLIC_COMMUNICATION',
  COMMUNITY_CONTRIBUTOR = 'COMMUNITY_CONTRIBUTOR',
  OTHER = 'OTHER',
}

// Replace static labels with translation keys
export const USER_TYPE_TRANSLATION_KEYS = {
  [UserType.CITIZEN]: 'registration.userTypes.citizen',
  [UserType.LOCAL_LEVEL_EMPLOYEE]: 'registration.userTypes.localLevelEmployee',
  [UserType.ELECTED_REPRESENTATIVE]: 'registration.userTypes.electedRepresentative',
  [UserType.GOVERNMENT_INSTITUTIONAL]: 'registration.userTypes.governmentInstitutional',
  [UserType.SPECIAL_USER]: 'registration.userTypes.specialUser',
  [UserType.SPECIAL_SERVICE_PROVIDER]: 'registration.userTypes.specialServiceProvider',
  [UserType.MEDIA_AND_PUBLIC_COMMUNICATION]: 'registration.userTypes.mediaAndPublicCommunication',
  [UserType.COMMUNITY_CONTRIBUTOR]: 'registration.userTypes.communityContributor',
  [UserType.OTHER]: 'registration.userTypes.other',
} as const;

export const USER_TYPE_LABELS = {
  [UserType.CITIZEN]: 'Citizen',
  [UserType.LOCAL_LEVEL_EMPLOYEE]: 'Local Level Employee',
  [UserType.ELECTED_REPRESENTATIVE]: 'Elected Representative',
  [UserType.GOVERNMENT_INSTITUTIONAL]:
    'Government & Institutional Representative',
  [UserType.SPECIAL_USER]: 'Special User',
  [UserType.SPECIAL_SERVICE_PROVIDER]: 'Special Service Provider',
  [UserType.MEDIA_AND_PUBLIC_COMMUNICATION]: 'Media & Public Communication',
  [UserType.COMMUNITY_CONTRIBUTOR]: 'Community Contributor',
  [UserType.OTHER]: 'Other',
};

/*
Citizen: Province -> District -> Municipality -> Ward
Local Level Employee: Province -> District -> Municipality

Office Section
- General Administration (Administration, Planning, Monitoring & Evaluation)
- Revenue & Financial Administration (Tax, Revenue, Budget)
- Infrastructure Development (Road, Water Supply, Electricity, Urban Development)
- Social Development (Helath, Education, Social Welfare)
- Economic Development (Agriculture, Industry, Tourism)
- Planning & Development (Urban & Rural Planning, Monitoring & Evaluation)
- Environment & Disaster Management (Disaster Management, Environment Conservation)
- Legal & Information (Legal, Information, Communication)
- Other (Other)

Local Level Representative: Province -> District -> Municipality

Elected Representative: Province -> District -> Municipality

Position:
- Chairperson
- Vice Chairperson
- Ward chairperson
- Ward member

Aka if ward chairperson or member is selectd select specific ward
*/
