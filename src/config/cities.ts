export interface CityConfig {
  displayName: string;
  slug: string;
  cityCode: string;
  editionId: number;
}

export const cities: CityConfig[] = [
  {
    displayName: 'Mumbai',
    slug: 'mumbai',
    cityCode: 'HT_MUMB',
    editionId: 45,
  },
  {
    displayName: 'Delhi',
    slug: 'delhi',
    cityCode: 'HT_DELH',
    editionId: 1,
  },
  {
    displayName: 'Patna',
    slug: 'patna',
    cityCode: 'HT_PATN',
    editionId: 51,
  },
];

export const getCityBySlug = (slug: string): CityConfig | undefined => {
  return cities.find((c) => c.slug === slug);
};
