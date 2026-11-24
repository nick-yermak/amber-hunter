import { readAcademyLibrary } from './academy-library';

describe('Academy library', () => {
  const article = {
    id: 'amber', slug: 'baltic-amber', lang: 'en',
    title: 'Baltic amber', summary: 'An introduction.', html: '<p>Amber is fossil resin.</p>',
  };

  it('accepts the generated English article contract', () => {
    expect(readAcademyLibrary([article], 'en')).toEqual([article]);
  });

  it('validates every article against the requested collection language', () => {
    const polishArticle = { ...article, lang: 'pl' };
    expect(readAcademyLibrary([polishArticle], 'pl')).toEqual([polishArticle]);
    expect(() => readAcademyLibrary([article], 'pl')).toThrow();
    expect(() => readAcademyLibrary([polishArticle], 'en')).toThrow();
  });

  it('rejects missing, malformed and ambiguous entries', () => {
    for (const content of [
      null, [], [null], [{ ...article, slug: '../amber' }], [{ ...article, html: '' }],
      [article, { ...article, id: 'second' }], [article, { ...article, slug: 'second' }],
    ]) expect(() => readAcademyLibrary(content, 'en')).toThrow();
  });
});
