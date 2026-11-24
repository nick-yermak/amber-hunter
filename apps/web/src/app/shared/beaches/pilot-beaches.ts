export type BeachId = 'sobieszewo' | 'mikoszewo' | 'orle';

export interface Beach {
  readonly id: BeachId;
  readonly name: string;
  readonly locality: string;
  readonly localityKey?: 'entrance88';
  readonly position: readonly [longitude: number, latitude: number];
  readonly source: { readonly url: string; readonly reference: string; readonly referenceKey?: 'sobieszewoSource' | 'mikoszewoSource' };
}

const gdanskReport = 'https://download.cloudgdansk.pl/gdansk-pl/d/20110536582/zatoka-gdanska-i-jeziora-pdf.pdf';

export const pilotBeaches: readonly Beach[] = [
  {
    id: 'sobieszewo',
    name: 'Sobieszewo',
    locality: 'Gdańsk · ul. Falowa',
    position: [18.836583, 54.355317],
    source: { url: gdanskReport, reference: 'A12, main entrance (54°21.319′ N, 18°50.195′ E)', referenceKey: 'sobieszewoSource' },
  },
  {
    id: 'mikoszewo',
    name: 'Mikoszewo',
    locality: 'Stegna · entrance 88',
    localityKey: 'entrance88',
    position: [18.977491, 54.347655],
    source: {
      url: 'https://edziennik.gdansk.uw.gov.pl/WDU_G/2023/2682/oryginal/akt.pdf',
      reference: 'Annex 4, bathing-area boundary (54°20′51.5591″ N, 18°58′38.9691″ E, WGS84)',
      referenceKey: 'mikoszewoSource',
    },
  },
  {
    id: 'orle',
    name: 'Orle',
    locality: 'Gdańsk · ul. Lazurowa',
    position: [18.874800, 54.348133],
    source: { url: gdanskReport, reference: 'A13, ul. Lazurowa (54°20.888′ N, 18°52.488′ E)' },
  },
];
