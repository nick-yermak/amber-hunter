import { readAcademyLibrary } from './academy-library';

describe('Academy library', () => {
  const article = {
    id: 'amber', slug: 'baltic-amber', lang: 'en',
    title: 'Baltic amber', summary: 'An introduction.', html: '<p>Amber is fossil resin.</p>',
  };

  it('accepts the generated English article contract', () => {
    expect(readAcademyLibrary([article])).toEqual([article]);
  });

  it('rejects missing, malformed and ambiguous entries', () => {
    for (const content of [
      null, [], [null], [{ ...article, slug: '../amber' }], [{ ...article, html: '' }],
      [article, { ...article, id: 'second' }], [article, { ...article, slug: 'second' }],
    ]) expect(() => readAcademyLibrary(content)).toThrow();
  });
});
