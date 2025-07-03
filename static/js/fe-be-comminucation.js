// Example: User Registration
document.querySelector('.auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch('https://your-ec2-instance/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful
            window.location.href = 'account.html';
        } else {
            // Show error message
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
    }
});

// Example: Add to Cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.closest('.product-card').dataset.productId;
        
        try {
            const response = await fetch('https://your-ec2-instance/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update cart count
                document.querySelector('.cart-count').textContent = data.cartCount;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});