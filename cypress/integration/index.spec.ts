describe('Index', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the site name', () => {
    cy.findByText('edmund.dev', { exact: false, selector: 'h1' }).should(
      'exist',
    );
  });

  it('should list the content properly', async () => {
    const content = await cy.fixture('content.json');

    for (const kv of content) {
      cy.findByText(
        kv.metadata.title ?? kv.key.slice(kv.key.lastIndexOf('/') + 1),
        { selector: 'h2' },
      ).should('exist');
    }
  });
});
