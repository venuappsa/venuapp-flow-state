
describe('Profile Management Tests', () => {
  beforeEach(() => {
    // Simulate logged in state by setting up local storage
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              first_name: 'Test',
              last_name: 'User'
            }
          }
        }
      }));
    });
  });

  it('should display admin profile page', () => {
    cy.visit('/admin/profile');
    
    // Check profile page title
    cy.contains('Admin Profile').should('exist');
    
    // Verify profile information is displayed
    cy.get('input[name="firstName"]').should('exist');
    cy.get('input[name="lastName"]').should('exist');
    cy.get('input[name="email"]').should('exist');
  });
  
  it('should update admin profile information', () => {
    cy.visit('/admin/profile');
    
    // Update profile information
    cy.get('button').contains('Profile').click();
    cy.get('input[name="firstName"]').clear().type('Updated');
    cy.get('input[name="lastName"]').clear().type('Name');
    
    // Submit form
    cy.contains('button', 'Save Changes').click();
    
    // Verify success message
    cy.contains('Profile updated').should('exist');
  });
  
  it('should update admin password', () => {
    cy.visit('/admin/profile');
    
    // Go to password tab
    cy.get('button').contains('Password').click();
    
    // Fill password form
    cy.get('input[name="currentPassword"]').type('oldpassword');
    cy.get('input[name="newPassword"]').type('newpassword');
    cy.get('input[name="confirmPassword"]').type('newpassword');
    
    // Submit form
    cy.contains('button', 'Update Password').click();
    
    // Verify success message
    cy.contains('Password updated').should('exist');
  });
  
  it('should display host profile page', () => {
    cy.visit('/host/profile');
    
    // Check profile page title
    cy.contains('Host Profile').should('exist');
    
    // Verify profile information is displayed
    cy.get('input[name="firstName"]').should('exist');
    cy.get('input[name="lastName"]').should('exist');
    cy.get('input[name="email"]').should('exist');
  });
});
