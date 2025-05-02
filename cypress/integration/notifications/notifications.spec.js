
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
});
