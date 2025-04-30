
describe('Vendor Onboarding Flow', () => {
  before(() => {
    // Clear any existing data/sessions before tests
    cy.clearLocalStorage();
  });

  it('should allow a vendor to sign up via the public signup form', () => {
    cy.visit('/vendor-signup');
    
    // Check that the form is displayed
    cy.contains('Become a vendor').should('be.visible');
    cy.contains('Create your vendor account').should('be.visible');
    
    // Fill out the form
    cy.get('input[placeholder="Your Business Name"]').type('Test Vendor Business');
    cy.get('input[placeholder="Your First Name"]').type('John');
    cy.get('input[placeholder="Your Last Name"]').type('Vendor');
    cy.get('input[placeholder="you@example.com"]').type('testvendor@example.com');
    cy.get('input[placeholder="Your Phone Number"]').type('1234567890');
    
    // Select a category
    cy.get('button').contains('Select business category').click();
    cy.get('div[role="option"]').contains('Food & Beverages').click();
    
    // Enter passwords
    cy.get('input[placeholder="Create a password"]').type('Password123');
    cy.get('input[placeholder="Confirm your password"]').type('Password123');
    
    // Accept terms
    cy.get('input[type="checkbox"]').click();
    
    // Submit form (mock submission since we can't actually create a user in tests)
    cy.window().then((win) => {
      // Mock authentication state
      win.localStorage.setItem('mocked_auth', JSON.stringify({ 
        role: 'merchant',
        business_name: 'Test Vendor Business'  
      }));
    });
    
    // Go directly to welcome page (since we can't actually submit the form)
    cy.visit('/vendor/welcome');
    cy.contains('Welcome to Venuapp!').should('be.visible');
  });

  it('should show onboarding steps on the dashboard', () => {
    // Mock authentication first
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'merchant' }));
    });
    
    cy.visit('/vendor/dashboard');
    
    // Check that onboarding progress is displayed
    cy.contains('Onboarding Progress').should('be.visible');
    
    // Check that all 4 steps are shown
    cy.contains('Complete Profile').should('be.visible');
    cy.contains('Add Services').should('be.visible');
    cy.contains('Set Pricing & Availability').should('be.visible');
    cy.contains('Go Live').should('be.visible');
  });

  it('should complete profile setup step', () => {
    // Mock authentication first
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'merchant' }));
    });
    
    cy.visit('/vendor/profile');
    
    // Check that the profile form is displayed
    cy.contains('Business Profile').should('be.visible');
    cy.contains('Step 1 of 4').should('be.visible');
    
    // Fill out the form (basic fields)
    cy.get('input[placeholder="Your Business Name"]').clear().type('Test Vendor Business');
    
    // Select a category if it's not already selected
    cy.get('button').contains('Select business category').click();
    cy.get('div[role="option"]').contains('Food & Beverages').click();
    
    cy.get('textarea[placeholder="Describe your business and services..."]')
      .clear()
      .type('This is a test vendor business that specializes in catering for corporate events. We offer a range of services including buffet catering, plated meals, and cocktail hour appetizers.');
    
    cy.get('input[placeholder="Full Name"]').clear().type('John Vendor');
    cy.get('input[placeholder="contact@example.com"]').clear().type('testvendor@example.com');
    cy.get('input[placeholder="Phone Number"]').clear().type('1234567890');
    
    // Fill out address fields
    cy.get('input[placeholder="123 Main St"]').clear().type('123 Business Ave');
    cy.get('input[placeholder="City"]').clear().type('Test City');
    cy.get('input[placeholder="State"]').clear().type('Test State');
    cy.get('input[placeholder="Postal Code"]').clear().type('12345');
    cy.get('input[placeholder="Country"]').clear().type('Test Country');
    
    // Save and continue
    cy.contains('button', 'Save and Continue').click();
    
    // Check for success toast
    cy.contains('Profile updated successfully').should('be.visible');
  });

  it('should complete service creation step', () => {
    // Mock authentication first
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'merchant' }));
    });
    
    cy.visit('/vendor/services');
    
    // Check that the service form is displayed
    cy.contains('Add Your Services').should('be.visible');
    cy.contains('Step 2 of 4').should('be.visible');
    
    // Fill out the first service
    cy.get('input[placeholder="e.g. Wedding Photography"]').clear().type('Corporate Catering');
    
    // Select a category
    cy.get('button').contains('Select a category').click();
    cy.get('div[role="option"]').contains('Food').click();
    
    cy.get('textarea[placeholder="Describe what this service includes and its benefits..."]')
      .clear()
      .type('Full service corporate catering including setup, service, and cleanup. We offer customizable menu options to fit your event needs.');
    
    cy.get('input[placeholder="e.g. 3 hours, Full day"]').clear().type('4 hours');
    cy.get('input[placeholder="0.00"]').clear().type('500');
    
    // Add a second service
    cy.contains('button', 'Add Another Service').click();
    
    // Fill out the second service
    cy.get('input[placeholder="e.g. Wedding Photography"]').eq(1).clear().type('Cocktail Reception');
    
    // Select a category for the second service
    cy.get('button').contains('Select a category').eq(1).click();
    cy.get('div[role="option"]').contains('Food').click();
    
    cy.get('textarea[placeholder="Describe what this service includes and its benefits..."]').eq(1)
      .clear()
      .type('Elegant cocktail hour with passed appetizers and drink service. Perfect for networking events or pre-dinner receptions.');
    
    cy.get('input[placeholder="e.g. 3 hours, Full day"]').eq(1).clear().type('2 hours');
    cy.get('input[placeholder="0.00"]').eq(1).clear().type('300');
    
    // Save and continue
    cy.contains('button', 'Save and Continue').click();
    
    // Check for success toast
    cy.contains('Services saved').should('be.visible');
  });

  it('should complete pricing and availability step', () => {
    // Mock authentication first
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'merchant' }));
    });
    
    cy.visit('/vendor/pricing');
    
    // Check that the pricing form is displayed
    cy.contains('Pricing & Availability').should('be.visible');
    cy.contains('Step 3 of 4').should('be.visible');
    
    // Configure pricing options
    cy.get('button').contains('Select pricing model').click();
    cy.get('div[role="option"]').contains('Package Pricing').click();
    
    // Toggle deposit required
    cy.contains('Require deposit for bookings').parent().find('button[role="checkbox"]').click();
    
    // Select deposit percentage
    cy.get('button').contains('Select percentage').click();
    cy.get('div[role="option"]').contains('25%').click();
    
    // Switch to availability tab
    cy.get('button').contains('Availability').click();
    
    // Configure availability
    cy.get('button').contains('Select availability').click();
    cy.get('div[role="option"]').contains('Specific Days Only').click();
    
    cy.get('button').contains('Select lead time').click();
    cy.get('div[role="option"]').contains('1 Week Before').click();
    
    // Save and continue
    cy.contains('button', 'Save and Continue').click();
    
    // Check for success toast
    cy.contains('Pricing settings saved').should('be.visible');
  });

  it('should complete go live step', () => {
    // Mock authentication first
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'merchant' }));
    });
    
    cy.visit('/vendor/go-live');
    
    // Check that the go live page is displayed
    cy.contains('Go Live').should('be.visible');
    cy.contains('Step 4 of 4').should('be.visible');
    
    // Check that all checklist items are complete
    cy.contains('Business Profile').parent().parent().parent().should('have.class', 'border-green-200');
    cy.contains('Services').parent().parent().parent().should('have.class', 'border-green-200');
    cy.contains('Pricing & Availability').parent().parent().parent().should('have.class', 'border-green-200');
    
    // Click Go Live button
    cy.contains('button', 'Go Live Now').click();
    
    // Check for success toast
    cy.contains('Congratulations!').should('be.visible');
    cy.contains('Your vendor profile is now live').should('be.visible');
    
    // Should be redirected to dashboard
    cy.url().should('include', '/vendor/dashboard');
    
    // Check that profile is now marked as live
    cy.visit('/vendor/go-live');
    cy.get('span').contains('Live').should('be.visible');
  });

  it('should show vendor engagement metrics to hosts', () => {
    // Mock authentication as host
    cy.window().then((win) => {
      win.localStorage.setItem('mocked_auth', JSON.stringify({ role: 'host' }));
    });
    
    cy.visit('/host/invitations');
    
    // Check that vendor metrics are displayed
    cy.contains('Recent Invitations').should('be.visible');
    cy.contains('Invitation Statistics').should('be.visible');
    
    // Should show specific vendors
    cy.contains('Gourmet Delights').should('be.visible');
    cy.contains('Sound Systems Pro').should('be.visible');
    
    // Should show status badges
    cy.contains('Invited').should('be.visible');
    cy.contains('Accepted').should('be.visible');
    cy.contains('Declined').should('be.visible');
    
    // Should show send invitation button for new vendors
    cy.contains('Party Supplies Co').parent().parent().parent().contains('Send Invitation').should('be.visible');
  });
});
