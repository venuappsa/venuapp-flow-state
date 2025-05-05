
describe('Basic Route Tests', () => {
  it('should confirm auth route exists', () => {
    cy.visit('/auth');
    cy.url().should('include', '/auth');
    cy.get('h1').should('contain', 'Venuapp');
    cy.get('form').should('exist');
  });

  it('should confirm feature pages exist', () => {
    // Test host feature page
    cy.visit('/features/host');
    cy.url().should('include', '/features/host');
    cy.get('h1').should('exist');
    
    // Test merchant feature page
    cy.visit('/features/merchant');
    cy.url().should('include', '/features/merchant');
    cy.get('h1').should('exist');
  });

  it('should redirect from role routes to feature pages', () => {
    // Test host redirect
    cy.visit('/host');
    cy.url().should('include', '/features/host');
    
    // Test vendor redirect
    cy.visit('/vendor');
    cy.url().should('include', '/features/vendor');
  });

  it('should confirm protected admin route requires auth', () => {
    cy.visit('/admin');
    // Since we're not logged in, we should be redirected to auth
    cy.url().should('include', '/auth');
  });
});
