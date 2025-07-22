document.addEventListener('DOMContentLoaded', function() {
    const bookAppointmentForm = document.getElementById('bookAppointmentForm');
    const bookingStatusDiv = document.getElementById('bookingStatus');
    const upcomingAppointmentsDiv = document.getElementById('upcomingAppointments');
    const loadAppointmentsBtn = document.getElementById('loadAppointmentsBtn');
    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');
    const cancellationStatusDiv = document.getElementById('cancellationStatus');
    const rescheduleAppointmentBtn = document.getElementById('rescheduleAppointmentBtn');
    const rescheduleStatusDiv = document.getElementById('rescheduleStatus');
    const appointmentToModifyInput = document.getElementById('appointmentToModify');
    const rescheduleDateTimeInput = document.getElementById('rescheduleDateTime');
    const patientIdForAppointments = '123'; // Replace with actual patient ID (e.g., from login session)

    bookAppointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = {
            patientId: document.getElementById('patientId').value,
            doctorId: document.getElementById('doctorId').value,
            dateTime: document.getElementById('appointmentDateTime').value,
            reason: document.getElementById('reason').value
        };

        fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            bookingStatusDiv.textContent = data.message || data.error || 'Appointment request submitted.';
            if (data.appointmentId) {
                loadAppointments(); // Reload appointments after booking
            }
        })
        .catch(error => {
            bookingStatusDiv.textContent = 'Error booking appointment.';
            console.error('Error:', error);
        });
    });

    loadAppointmentsBtn.addEventListener('click', loadAppointments);

    function loadAppointments() {
        fetch(`http://localhost:3000/api/patients/${patientIdForAppointments}/appointments?status=upcoming`)
        .then(response => response.json())
        .then(appointments => {
            let html = '<ul>';
            appointments.forEach(appt => {
                html += `<li>ID: ${appt.id}, Doctor: ${appt.doctorId}, Date: ${new Date(appt.dateTime).toLocaleString()}, Reason: ${appt.reason || 'N/A'} <button class="cancel-btn" data-id="${appt.id}">Cancel</button> <button class="reschedule-btn" data-id="${appt.id}">Reschedule</button></li>`;
            });
            html += '</ul>';
            upcomingAppointmentsDiv.innerHTML = html;

            // Add event listeners to dynamically created cancel and reschedule buttons
            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const apptId = this.dataset.id;
                    cancelAppointment(apptId);
                });
            });
            document.querySelectorAll('.reschedule-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const apptId = this.dataset.id;
                    // You might want to show a modal or inline input for the new date/time here
                    const newDateTime = prompt('Enter new date and time (YYYY-MM-DDTHH:mm):');
                    if (newDateTime) {
                        rescheduleAppointment(apptId, newDateTime);
                    }
                });
            });
        })
        .catch(error => {
            upcomingAppointmentsDiv.textContent = 'Error loading appointments.';
            console.error('Error:', error);
        });
    }

    function cancelAppointment(appointmentId) {
        fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            cancellationStatusDiv.textContent = data.message || data.error || 'Appointment cancelled.';
            loadAppointments(); // Reload appointments after cancellation
        })
        .catch(error => {
            cancellationStatusDiv.textContent = 'Error cancelling appointment.';
            console.error('Error:', error);
        });
    }

    function rescheduleAppointment(appointmentId, newDateTime) {
        fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dateTime: newDateTime })
        })
        .then(response => response.json())
        .then(data => {
            rescheduleStatusDiv.textContent = data.message || data.error || 'Appointment rescheduled.';
            loadAppointments(); // Reload appointments after rescheduling
        })
        .catch(error => {
            rescheduleStatusDiv.textContent = 'Error rescheduling appointment.';
            console.error('Error:', error);
        });
    }

    // Initial load of appointments
    loadAppointments();
});