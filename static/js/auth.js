// Handle authentication state across the site
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus(); // Initial check on page load

    // Add event listeners to protected links
    // This part needs to be re-evaluated based on Flask's redirect logic.
    // If Flask handles redirection for protected routes, this client-side check might become redundant
    // for initial page loads, but useful for client-side navigation.
    document.querySelectorAll('[data-protected]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the current user is logged in
            fetch('/check-auth')
                .then(response => response.json())
                .then(data => {
                    if (!data.loggedIn) {
                        e.preventDefault();
                        const redirectUrl = this.getAttribute('href');
                        window.location.href = `/login?next=${encodeURIComponent(redirectUrl)}`;
                    }
                })
                .catch(error => {
                    console.error('Error checking auth status:', error);
                    // Fallback in case of error, maybe redirect to login
                    e.preventDefault();
                    window.location.href = '/login';
                });
        });
    });

    // Handle logout
    document.querySelectorAll('.logout-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (!data.loggedIn) {
                    // Successfully logged out on server, update UI
                    updateUIForLoggedOutUser();
                    alert('You have been logged out.');
                    window.location.href = 'index.html'; // Redirect to public home
                } else {
                    alert('Logout failed.');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                alert('An error occurred during logout.');
            });
        });
    });
});

// This function will now check with the server
function checkAuthStatus() {
    fetch('/check-auth')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.body.classList.add('logged-in');
                updateUIForLoggedInUser();
                // Additionally, fetch user data for the account page if it's currently loaded
                if (window.location.pathname.includes('account.html')) {
                    fetch('/user-data')
                        .then(res => res.json())
                        .then(userData => {
                            if (userData.firstName) {
                                // Update profile display
                                document.querySelector('.account-profile h3').textContent = `${userData.firstName} ${userData.lastName}`;
                                document.querySelector('.account-profile p').textContent = userData.email;

                                // Update account details form
                                document.getElementById('first-name').value = userData.firstName;
                                document.getElementById('last-name').value = userData.lastName;
                                document.getElementById('email').value = userData.email;
                                document.getElementById('phone').value = userData.phone;

                                // Update address cards with user's name
                                document.querySelectorAll('.address-card h3').forEach(el => {
                                    el.textContent = `${userData.firstName} ${userData.lastName}`;
                                });
                            }
                        });
                }
            } else {
                document.body.classList.remove('logged-in');
                updateUIForLoggedOutUser();
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            // Handle network errors or server issues
            document.body.classList.remove('logged-in'); // Assume not logged in on error
            updateUIForLoggedOutUser();
        });
}

function updateUIForLoggedInUser() {
    const loginLinks = document.querySelectorAll('.login-link');
    const logoutLinks = document.querySelectorAll('.logout-link');
    const userActions = document.querySelectorAll('.user-actions'); // Assuming this selects elements that show user-specific actions

    loginLinks.forEach(link => link.style.display = 'none');
    logoutLinks.forEach(link => link.style.display = 'block');

    // Update buttons that were login/register to 'My Account'
    const authButtons = document.querySelectorAll('.auth-button'); // Assuming you have a class for these buttons
    authButtons.forEach(button => {
        button.textContent = 'My Account';
        button.href = '/account'; // Link to Flask /account route
    });
}

function updateUIForLoggedOutUser() {
    const loginLinks = document.querySelectorAll('.login-link');
    const logoutLinks = document.querySelectorAll('.logout-link');

    loginLinks.forEach(link => link.style.display = 'block');
    logoutLinks.forEach(link => link.style.display = 'none');

    const authButtons = document.querySelectorAll('.auth-button');
    authButtons.forEach(button => {
        button.textContent = 'Login';
        button.href = '/login'; // Link to Flask /login route
    });
}