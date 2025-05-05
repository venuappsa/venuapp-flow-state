
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
    
    // Test fetchman feature page
    cy.visit('/features/fetchman');
    cy.url().should('include', '/features/fetchman');
    cy.get('h1').should('exist');
    
    // Test attendee feature page (previously customer)
    cy.visit('/features/attendee');
    cy.url().should('include', '/features/attendee');
    cy.get('h1').should('exist');
  });

  it('should redirect from role routes to feature pages', () => {
    // Test host redirect
    cy.visit('/host');
    cy.url().should('include', '/features/host');
    
    // Test vendor redirect
    cy.visit('/vendor');
    cy.url().should('include', '/features/vendor');
    
    // Test fetchman redirect
    cy.visit('/fetchman');
    cy.url().should('include', '/features/fetchman');
    
    // Test customer to attendee redirect
    cy.visit('/customer');
    cy.url().should('include', '/features/attendee');
  });
  
  it('should redirect from customer to attendee feature page', () => {
    cy.visit('/features/customer');
    cy.url().should('include', '/features/attendee');
  });

  it('should confirm protected admin route requires auth', () => {
    cy.visit('/admin');
    // Since we're not logged in, we should be redirected to auth
    cy.url().should('include', '/auth');
  });
});
