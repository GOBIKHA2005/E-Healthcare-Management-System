document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const userDetailsDiv = document.getElementById('userDetails');

    userForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const role = document.getElementById('userRole').value;

        userDetailsDiv.innerHTML = `
            <h3>User Details:</h3>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Role:</strong> ${role}</p>
        `;

        console.log('User data submitted:', { username, email, password, role });
        userForm.reset();
    });
})