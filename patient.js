document.addEventListener('DOMContentLoaded', function() {
    const patientForm = document.getElementById('patientForm');
    const patientDetailsDiv = document.getElementById('patientDetails');

    patientForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('patientName').value;
        const dob = document.getElementById('patientDob').value;
        const gender = document.getElementById('patientGender').value;
        const contact = document.getElementById('patientContact').value;
        const address = document.getElementById('patientAddress').value;

        // Get the current timestamp
        const now = new Date();
        const timestamp = now.toLocaleString(); // Format it nicely

        // Update the patientDetails div to include the timestamp
        patientDetailsDiv.innerHTML = `
            <h3>Patient Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p class="last-updated">Last Updated: ${timestamp}</p>
        `;

        // In a real system, you would send this data to a backend server
        // for storage in a database.
        console.log('Patient data submitted:', { name, dob, gender, contact, address, timestamp });

        // Optionally, you can clear the form after submission
        patientForm.reset();
    });
});