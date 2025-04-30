
describe('Authentication Tests', () => {
  beforeEach(() => {
    // Reset any previous state
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });

  it('should successfully login with valid credentials', () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Login').click();
    
    // Check redirection to admin panel
    cy.url().should('include', '/admin');
    
    // Verify successful login toast
    cy.contains('Login successful').should('exist');
  });
  
  it('should show error with invalid login credentials', () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.contains('button', 'Login').click();
    
    // Verify error message
    cy.contains('Error').should('exist');
    cy.url().should('include', '/auth/login');
  });
  
  it('should successfully register with valid information', () => {
    cy.visit('/auth/register');
    
    // Fill out the registration form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('select[name="role"]').select('host');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    // Submit the form
    cy.contains('button', 'Create Account').click();
    
    // Check redirection to login page
    cy.url().should('include', '/auth/login');
    
    // Verify successful registration toast
    cy.contains('Registration successful').should('exist');
  });
  
  it('should show error when registering with invalid information', () => {
    cy.visit('/auth/register');
    
    // Submit without filling required fields
    cy.contains('button', 'Create Account').click();
    
    // Verify validation errors
    cy.contains('First name must be at least 2 characters').should('exist');
  });
  
  it('should navigate to forgot password page', () => {
    cy.visit('/auth/login');
    cy.contains('Forgot password?').click();
    cy.url().should('include', '/auth/forgot-password');
  });
  
  it('should send forgot password email', () => {
    cy.visit('/auth/forgot-password');
    cy.get('input[name="email"]').type('test@example.com');
    cy.contains('button', 'Send Reset Link').click();
    
    // Verify success message
    cy.contains('Email Sent').should('exist');
  });
  
  it('should navigate to 2FA verification page', () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('2fauser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Login').click();
    
    // Check redirection to 2FA page
    cy.url().should('include', '/auth/2fa');
  });
  
  it('should verify 2FA code and redirect to appropriate dashboard', () => {
    // Manually navigate to 2FA page with state
    cy.window().then((win) => {
      win.history.pushState({ email: 'admin@example.com' }, '', '/auth/2fa');
      cy.visit('/auth/2fa');
    });
    
    // Enter 2FA code (any 6 digits for demo)
    cy.get('input[data-slot]').each(($el, index) => {
      cy.wrap($el).type((index + 1).toString());
    });
    
    cy.contains('button', 'Verify').click();
    
    // Check redirection to admin dashboard
    cy.url().should('include', '/admin');
    
    // Verify successful verification toast
    cy.contains('Verification successful').should('exist');
  });
});
