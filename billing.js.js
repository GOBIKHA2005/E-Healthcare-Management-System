document.addEventListener('DOMContentLoaded', function() {
    const loadBillsBtn = document.getElementById('loadBillsBtn');
    const billsListDiv = document.getElementById('billsList');
    const patientIdViewBillsInput = document.getElementById('patientIdViewBills');
    const generateBillForm = document.getElementById('generateBillForm');
    const generateBillStatusDiv = document.getElementById('generateBillStatus');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const servicesDiv = document.getElementById('services');
    const totalAmountInput = document.getElementById('totalAmount');
    const markAsPaidBtn = document.getElementById('markAsPaidBtn');
    const billIdPaidInput = document.getElementById('billIdPaid');
    const markPaidStatusDiv = document.getElementById('markPaidStatus');

    loadBillsBtn.addEventListener('click', function() {
        const patientId = patientIdViewBillsInput.value;
        if (patientId) {
            fetch(`http://localhost:3000/api/patients/${patientId}/bills`)
            .then(response => response.json())
            .then(bills => {
                let html = '<ul>';
                bills.forEach(bill => {
                    html += `<li>ID: ${bill.id}, Date: ${new Date(bill.billingDate).toLocaleDateString()}, Amount: $${bill.totalAmount.toFixed(2)}, Status: ${bill.status}</li>`;
                });
                html += '</ul>';
                billsListDiv.innerHTML = html;
            })
            .catch(error => {
                billsListDiv.textContent = 'Error loading bills.';
                console.error('Error:', error);
            });
        } else {
            billsListDiv.textContent = 'Please enter a Patient ID.';
        }
    });

    addServiceBtn.addEventListener('click', function() {
        const serviceCount = servicesDiv.querySelectorAll('.service-item').length + 1;
        const newServiceItem = document.createElement('div');
        newServiceItem.classList.add('service-item');
        newServiceItem.innerHTML = `
            <label for="serviceName${serviceCount}">Service Name:</label>
            <input type="text" id="serviceName${serviceCount}" name="serviceName[]" required>
            <label for="serviceCost${serviceCount}">Cost:</label>
            <input type="number" id="serviceCost${serviceCount}" name="serviceCost[]" required>
        `;
        servicesDiv.appendChild(newServiceItem);
        updateTotalAmount();
    });

    servicesDiv.addEventListener('input', updateTotalAmount);

    function updateTotalAmount() {
        let total = 0;
        const costs = document.querySelectorAll('input[name="serviceCost[]"]');
        costs.forEach(costInput => {
            total += parseFloat(costInput.value) || 0;
        });
        totalAmountInput.value = total.toFixed(2);
    }

    generateBillForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const serviceNames = Array.from(document.querySelectorAll('input[name="serviceName[]"]')).map(input => input.value);
        const serviceCosts = Array.from(document.querySelectorAll('input[name="serviceCost[]"]')).map(input => parseFloat(input.value));
        const serviceDetails = serviceNames.map((name, index) => ({ name, cost: serviceCosts[index] }));

        const formData = {
            patientId: document.getElementById('patientIdGenerate').value,
            serviceDetails: serviceDetails,
            totalAmount: parseFloat(document.getElementById('totalAmount').value)
        };

        fetch('http://localhost:3000/api/bills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            generateBillStatusDiv.textContent = data.message || data.error || 'Bill generated.';
            if (data.billId) {
                generateBillForm.reset();
                // Optionally reload bills for the patient
                if (patientIdViewBillsInput.value === formData.patientId) {
                    loadBillsBtn.click();
                }
            }
        })
        .catch(error => {
            generateBillStatusDiv.textContent = 'Error generating bill.';
            console.error('Error:', error);
        });
    });

    markAsPaidBtn.addEventListener('click', function() {
        const billId = billIdPaidInput.value;
        if (billId) {
            fetch(`http://localhost:3000/api/bills/${billId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'paid' })
            })
            .then(response => response.json())
            .then(data => {
                markPaidStatusDiv.textContent = data.message || data.error || 'Bill marked as paid.';
                // Optionally reload bills
                if (patientIdViewBillsInput.value) {
                    loadBillsBtn.click();
                }
            })
            .catch(error => {
                markPaidStatusDiv.textContent = 'Error marking bill as paid.';
                console.error('Error:', error);
            });
        } else {
            markPaidStatusDiv.textContent = 'Please enter a Bill ID.';
        }
    });
});