
describe('Host Dashboard', () => {
  beforeEach(() => {
    cy.visit('/host/dashboard');
    // Mock authentication - in a real test we would use a test account
    cy.window().then((window) => {
      window.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'host' }));
    });
  });

  it('should render dashboard cards correctly', () => {
    // Test Listing Summary card
    cy.contains('Listings Summary').should('be.visible');
    cy.contains('Upcoming').should('be.visible');
    cy.contains('Pending').should('be.visible');
    cy.contains('Cancelled').should('be.visible');
    cy.contains('Completed').should('be.visible');
    
    // Test Earnings Summary card
    cy.contains('Earnings Summary').should('be.visible');
    cy.contains('Monthly Revenue').should('be.visible');
    cy.contains('Total Revenue').should('be.visible');
    cy.contains('Pending Payouts').should('be.visible');
    
    // Test Vendor & Merchants card
    cy.contains('Vendors & Merchants').should('be.visible');
    cy.contains('Active Vendors').should('be.visible');
    cy.contains('Pending Invitations').should('be.visible');
    cy.contains('Total Invited').should('be.visible');
    cy.contains('Acceptance Rate').should('be.visible');
    
    // Test Support Tickets card
    cy.contains('Support Tickets').should('be.visible');
    cy.contains('Open Tickets').should('be.visible');
    cy.contains('In Progress').should('be.visible');
    cy.contains('Resolved').should('be.visible');
    cy.contains('Avg. Response Time').should('be.visible');
    
    // Test Recent Activities section
    cy.contains('Recent Activities').should('be.visible');
    cy.contains('New event listing confirmed').should('be.visible');
    cy.contains('New vendor accepted invitation').should('be.visible');
    cy.contains('Support ticket updated').should('be.visible');
  });

  it('should navigate to events page when clicking "View All Events"', () => {
    cy.contains('View All Events').first().click();
    cy.url().should('include', '/host/events');
  });
  
  it('should navigate to financials page when clicking "View Finances"', () => {
    cy.contains('View Finances').first().click();
    cy.url().should('include', '/host/finance');
  });
  
  it('should navigate to invitations page when clicking "Manage Invitations"', () => {
    cy.contains('Manage Invitations').first().click();
    cy.url().should('include', '/host/invitations');
  });
});
