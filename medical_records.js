document.addEventListener('DOMContentLoaded', function() {
    const loadRecordsBtn = document.getElementById('loadRecordsBtn');
    const medicalRecordsListDiv = document.getElementById('medicalRecordsList');
    const patientIdViewRecordsInput = document.getElementById('patientIdViewRecords');
    const addRecordForm = document.getElementById('addRecordForm');
    const addRecordStatusDiv = document.getElementById('addRecordStatus');

    loadRecordsBtn.addEventListener('click', function() {
        const patientId = patientIdViewRecordsInput.value;
        if (patientId) {
            fetch(`http://localhost:3000/api/patients/${patientId}/medical-records`)
            .then(response => response.json())
            .then(records => {
                let html = '<ul>';
                records.forEach(record => {
                    html += `<li>ID: ${record.id}, Date: ${new Date(record.recordDate).toLocaleDateString()}, Diagnosis: ${record.diagnosis || 'N/A'}, Treatment: ${record.treatment || 'N/A'}</li>`;
                });
                html += '</ul>';
                medicalRecordsListDiv.innerHTML = html;
            })
            .catch(error => {
                medicalRecordsListDiv.textContent = 'Error loading medical records.';
                console.error('Error:', error);
            });
        } else {
            medicalRecordsListDiv.textContent = 'Please enter a Patient ID.';
        }
    });

    addRecordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = {
            patientId: document.getElementById('patientIdAdd').value,
            doctorId: document.getElementById('doctorIdAdd').value,
            recordDate: document.getElementById('recordDate').value,
            diagnosis: document.getElementById('diagnosis').value,
            treatment: document.getElementById('treatment').value,
            notes: document.getElementById('notes').value
        };

        fetch('http://localhost:3000/api/medical-records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            addRecordStatusDiv.textContent = data.message || data.error || 'Medical record added.';
            if (data.recordId) {
                // Optionally clear the form after successful submission
                addRecordForm.reset();
                // Optionally reload the medical records for the patient
                if (patientIdViewRecordsInput.value === formData.patientId) {
                    loadRecordsBtn.click(); // Simulate clicking the load button
                }
            }
        })
        .catch(error => {
            addRecordStatusDiv.textContent = 'Error adding medical record.';
            console.error('Error:', error);
        });
    });
});
