document.addEventListener('DOMContentLoaded', function() {
    const checkSymptomsBtn = document.getElementById('checkSymptomsBtn');
    const symptomsInput = document.getElementById('symptoms');
    const prescriptionRecommendationDiv = document.getElementById('prescriptionRecommendation');
    const availableDoctorsDiv = document.getElementById('availableDoctors');

    // --- Conceptual Symptom Checker and Recommendation ---
    const symptomPrescriptionMap = {
        "fever, cough": ["Paracetamol", "Cough Syrup (if needed)"],
        "headache, fatigue": ["Rest", "Hydration", "Pain reliever (if severe)"],
        "stomach ache, nausea": ["Avoid heavy meals", "Ginger ale"],
        // Add more symptom-prescription mappings (highly simplified)
    };

    checkSymptomsBtn.addEventListener('click', function() {
        const symptoms = symptomsInput.value.toLowerCase().trim();
        prescriptionRecommendationDiv.innerHTML = ''; // Clear previous recommendations

        if (symptoms) {
            const matchedSymptoms = Object.keys(symptomPrescriptionMap).find(key =>
                symptoms.includes(key) || key.includes(symptoms) // Basic keyword matching
            );

            if (matchedSymptoms) {
                const recommendations = symptomPrescriptionMap[matchedSymptoms].map(med => `<li>${med} (Requires Doctor's Approval)</li>`).join('');
                prescriptionRecommendationDiv.innerHTML = `
                    <h4>Possible Recommendations (Conceptual - Requires Doctor's Approval):</h4>
                    <ul>${recommendations}</ul>
                    <p><strong>Important:</strong> These are only suggestions and require a doctor's evaluation and approval for a valid prescription.</p>
                `;
            } else {
                prescriptionRecommendationDiv.innerHTML = `<p>No immediate recommendations found based on the symptoms. Please consult a doctor.</p>`;
            }
        } else {
            prescriptionRecommendationDiv.innerHTML = `<p>Please enter your symptoms.</p>`;
        }
    });

    // --- Doctor Availability (Static Data for Frontend) ---
    const availableDoctorsData = [
        { name: "Dr. Anya Sharma", specialty: "General Physician", availability: "Mon-Fri, 9 AM - 5 PM" },
        { name: "Dr. Ben Carter", specialty: "Cardiologist", availability: "Tue, Thu, 10 AM - 3 PM" },
        { name: "Dr. Chloe Davis", specialty: "Pediatrician", availability: "Mon, Wed, Fri, 1 PM - 6 PM" },
        { name: "Dr. David Evans", specialty: "Dermatologist", availability: "Wed, Fri, 9 AM - 12 PM" },
        // Add more doctors and their availability
    ];

    function displayAvailableDoctors() {
        if (availableDoctorsData.length > 0) {
            const doctorsList = availableDoctorsData.map(doctor => `
                <div class="doctor-info">
                    <p><strong>Name:</strong> ${doctor.name}</p>
                    <p><strong>Specialty:</strong> ${doctor.specialty}</p>
                    <p><strong>Availability:</strong> ${doctor.availability}</p>
                    <button class="book-appointment-btn">Book Appointment</button>
                </div>
            `).join('');
            availableDoctorsDiv.innerHTML = `
                <h4>Available Doctors:</h4>
                ${doctorsList}
            `;

            // Add event listeners to the "Book Appointment" buttons (basic functionality)
            const bookButtons = document.querySelectorAll('.book-appointment-btn');
            bookButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const doctorName = this.parentNode.querySelector('p:first-child').textContent.split(': ')[1];
                    alert(`Request sent to book an appointment with ${doctorName}. Further confirmation will be provided.`);
                    // In a real system, this would trigger a booking process
                });
            });

        } else {
            availableDoctorsDiv.innerHTML = `<p>No doctors currently available.</p>`;
        }
    }

    displayAvailableDoctors(); // Initial display of available doctors
});