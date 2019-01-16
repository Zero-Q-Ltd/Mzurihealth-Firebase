export interface InsuranceCompany {
  id: string,
  name: string,
  location: string,
  contact: string,
  website: string
}

export const emptyinsurance: InsuranceCompany = {
  contact: null,
  id: null,
  location: null,
  name: null,
  website: null
};
