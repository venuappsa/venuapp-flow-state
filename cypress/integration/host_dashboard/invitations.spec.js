
describe('Vendor Invitations', () => {
  beforeEach(() => {
    cy.visit('/host/invitations');
    // Mock authentication - in a real test we would use a test account
    cy.window().then((window) => {
      window.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'host' }));
    });
  });

  it('should load the invitations page', () => {
    cy.contains('Vendor Invitations').should('be.visible');
    cy.get('[role="tablist"]').should('be.visible');
    cy.get('[role="tab"]').should('have.length', 3);
  });
  
  it('should filter vendors by search term', () => {
    cy.get('input[placeholder="Search vendors by name or category..."]').type('Gourmet');
    cy.contains('Gourmet Delights').should('be.visible');
    cy.contains('Sound Systems Pro').should('not.exist');
  });
  
  it('should filter vendors by category', () => {
    cy.contains('Category').click();
    cy.contains('Food').click();
    cy.contains('Gourmet Delights').should('be.visible');
    cy.contains('Sweet Treat Bakery').should('be.visible');
    cy.contains('Sound Systems Pro').should('not.exist');
  });
  
  it('should display correct status badges', () => {
    cy.contains('Gourmet Delights').parent().parent().contains('Invited');
    cy.contains('Sound Systems Pro').parent().parent().contains('Accepted');
    cy.contains('Event Planners Inc').parent().parent().contains('Declined');
  });
  
  it('should show toast when sending an invitation', () => {
    cy.contains('Party Supplies Co').parent().parent().parent().contains('Send Invitation').click();
    cy.contains('Invitation sent!').should('be.visible');
  });
  
  it('should switch between tabs', () => {
    cy.contains('Invitations').click();
    cy.contains('Recent Invitations').should('be.visible');
    cy.contains('Invitation Statistics').should('be.visible');
    
    cy.contains('Public Signup').click();
    cy.contains('Vendor Signup Link').should('be.visible');
    cy.contains('Customize Signup Page').should('be.visible');
  });
  
  it('should show QR code when button is clicked', () => {
    cy.contains('Public Signup').click();
    cy.contains('Show QR Code').click();
    cy.contains('Scan to join as a vendor').should('be.visible');
    cy.contains('Hide QR Code').should('be.visible');
  });
  
  it('should copy invitation link', () => {
    cy.contains('Public Signup').click();
    cy.contains('Copy').click();
    cy.contains('Link copied!').should('be.visible');
  });
});
