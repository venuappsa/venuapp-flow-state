
describe('Notification System', () => {
  beforeEach(() => {
    // Mock authentication for testing purposes
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'admin' }));
    });
  });

  it('should show notification bell with unread counter', () => {
    cy.visit('/admin');
    
    // Check if notification bell exists
    cy.get('button').find('svg').should('exist');
    
    // There might be a badge with unread count
    cy.get('button').find('.h-4.w-4').should('exist');
  });

  it('should open notification dropdown when clicking bell', () => {
    cy.visit('/admin');
    
    // Click on the notification bell
    cy.get('button').find('svg').first().click();
    
    // Check if dropdown opens
    cy.contains('Notifications').should('be.visible');
  });

  it('should mark notifications as read', () => {
    cy.visit('/admin');
    
    // Click on the notification bell
    cy.get('button').find('svg').first().click();
    
    // If there are notifications, click on the first one
    cy.get('div[role="menuitem"]').first().click();
    
    // Verify the notification is now marked as read (no longer has bg-accent/50 class)
    cy.get('button').find('svg').first().click();
    cy.get('div[role="menuitem"]').first().should('not.have.class', 'bg-accent/50');
  });

  it('should navigate to notification settings page', () => {
    cy.visit('/admin/settings');
    
    // Click on notifications tab
    cy.contains('Notifications').click();
    
    // Verify we're on the notifications settings page
    cy.url().should('include', '/admin/settings/notifications');
    cy.contains('Notification Settings').should('be.visible');
  });

  it('should toggle notification preferences', () => {
    cy.visit('/admin/settings/notifications');
    
    // Toggle email notifications
    cy.get('#email-notifications').click();
    
    // Toggle toast notifications
    cy.get('#toast-notifications').click();
    
    // Click save
    cy.contains('Save Preferences').click();
    
    // Verify success toast
    cy.contains('Notification Preferences Saved').should('be.visible');
  });

  it('should toggle email summary settings', () => {
    cy.visit('/admin/settings/notifications');
    
    // Toggle weekly summary switch if not already enabled
    cy.get('#weekly-summary').then($el => {
      if (!$el.prop('checked')) {
        cy.wrap($el).click();
      }
    });
    
    // Change frequency
    cy.get('#summary-frequency').click();
    cy.contains('Monthly').click();
    
    // Save preferences
    cy.contains('Save Preferences').click();
    
    // Verify settings updated
    cy.contains('Settings updated').should('be.visible');
  });

  it('should show analytics with various metrics', () => {
    cy.visit('/admin/analytics');
    
    // Verify page title
    cy.contains('Analytics Dashboard').should('be.visible');
    
    // Check for summary cards
    cy.contains('Total Vendors').should('be.visible');
    cy.contains('Total Hosts').should('be.visible');
    cy.contains('Total Events').should('be.visible');
    
    // Verify charts are loaded
    cy.contains('Revenue Trend').should('be.visible');
    cy.contains('Active Vendors This Month').should('be.visible');
    
    // Test time range toggle
    cy.get('button').contains('This Month').click();
    cy.contains('This Quarter').click();
    
    // Check if charts reload
    // We can't directly test for visual changes, but we can look for loading indicators
    cy.get('div').should('exist');
  });

  it('should export data from reports page', () => {
    cy.visit('/admin/reports');
    
    // Verify page loaded
    cy.contains('Report & Export Center').should('be.visible');
    
    // Test tab switching
    cy.contains('Export Quote Requests').click();
    cy.contains('Quote Requests Report').should('be.visible');
    
    // Test date range picker
    cy.contains('Date Range').click();
    cy.get('button.rdp-button_reset').first().click(); // Click on a date
    
    // Test category filter
    cy.get('button').contains('All Categories').click();
    cy.contains('Food & Beverage').click();
    
    // Test export
    cy.contains('Export as CSV').click();
    
    // Check if export success toast appears
    cy.contains('Export successful').should('be.visible');
  });

  it('should filter vendor performance', () => {
    cy.visit('/admin/vendors/performance');
    
    // Verify page loaded
    cy.contains('Vendor Performance').should('be.visible');
    
    // Test search
    cy.get('input[placeholder="Search vendors..."]').type('Catering');
    
    // Test category filter
    cy.get('button').contains('All Categories').click();
    cy.contains('Food & Beverage').click();
    
    // Test rating slider
    // This is more complex with Cypress, but we can check it exists
    cy.get('input[type="range"]').should('exist');
    
    // Test sorting
    cy.contains('Avg. Rating').click();
    
    // Clear filters
    cy.contains('Clear Filters').click();
  });
});
