// ... (MySQL connection setup) ...

    // Appointments - Create
    app.post('/api/appointments', (req, res) => {
        const { patientId, doctorId, dateTime, reason } = req.body;
        const sql = 'INSERT INTO appointments (patientId, doctorId, dateTime, reason) VALUES (?, ?, ?, ?)';
        db.query(sql, [patientId, doctorId, dateTime, reason], (err, result) => {
            if (err) {
                console.error('Error booking appointment:', err);
                res.status(500).json({ error: 'Failed to book appointment' });
                return;
            }
            res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
        });
    });

    // Appointments - Get for a patient
    app.get('/api/patients/:patientId/appointments', (req, res) => {
        const patientId = req.params.patientId;
        const status = req.query.status; // e.g., 'upcoming', 'past'
        let sql = 'SELECT * FROM appointments WHERE patientId = ?';
        const params = [patientId];
        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }
        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Error fetching appointments:', err);
                res.status(500).json({ error: 'Failed to fetch appointments' });
                return;
            }
            res.json(results);
        });
    });

    // Appointments - Delete (Cancel)
    app.delete('/api/appointments/:appointmentId', (req, res) => {
        const appointmentId = req.params.appointmentId;
        const sql = 'DELETE FROM appointments WHERE id = ?';
        db.query(sql, [appointmentId], (err, result) => {
            if (err) {
                console.error('Error cancelling appointment:', err);
                res.status(500).json({ error: 'Failed to cancel appointment' });
                return;
            }
            if (result.affectedRows > 0) {
                res.json({ message: 'Appointment cancelled successfully' });
            } else {
                res.status(404).json({ error: 'Appointment not found' });
            }
        });
    });

    // Appointments - Update (Reschedule)
    app.put('/api/appointments/:appointmentId', (req, res) => {
        const appointmentId = req.params.appointmentId;
        const { dateTime } = req.body;
        const sql = 'UPDATE appointments SET dateTime = ? WHERE id = ?';
        db.query(sql, [dateTime, appointmentId], (err, result) => {
            if (err) {
                console.error('Error rescheduling appointment:', err);
                res.status(500).json({ error: 'Failed to reschedule appointment' });
                return;
            }
            if (result.affectedRows > 0) {
                res.json({ message: 'Appointment rescheduled successfully' });
            } else {
                res.status(404).json({ error: 'Appointment not found' });
            }
        });
    });

    // ... (rest of your server.js) ...