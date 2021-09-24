describe('Index', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the site name', () => {
    cy.findByText('edmund.dev', { exact: false }).should('exist');
  });
});
