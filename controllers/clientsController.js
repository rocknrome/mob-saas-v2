
export function getAllClients({ pool }) {
    return async (req, res) => {
      try {
        const result = await pool.query('SELECT * FROM clients');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    };
  }
  
  export function createClient({ pool, producer, io }) {
    return async (req, res) => {
      const {
        last_name,
        first_name,
        street_address,
        city,
        state,
        zip,
        tags,
        phone,
        email,
        tax_exempt,
        admin_notes,
        team_notes,
        latitude,
        longitude,
        plantation_id,
        weekly,
        client_type,
        payment_method,
        credit_card_number,
        credit_card_expiry,
        credit_card_cvv,
        billing_address_same,
        billing_street_address,
        billing_city,
        billing_state,
        billing_zip
      } = req.body;
  
      try {
        const result = await pool.query(
          `INSERT INTO clients (
            last_name, first_name, street_address, city, state, zip, tags, phone, email, tax_exempt,
            admin_notes, team_notes, latitude, longitude, plantation_id, weekly, client_type,
            payment_method, credit_card_number, credit_card_expiry, credit_card_cvv,
            billing_address_same, billing_street_address, billing_city, billing_state, billing_zip
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *`,
          [
            last_name, first_name, street_address, city, state, zip, tags, phone, email, tax_exempt,
            admin_notes, team_notes, latitude, longitude, plantation_id, weekly, client_type,
            payment_method, credit_card_number, credit_card_expiry, credit_card_cvv,
            billing_address_same, billing_street_address, billing_city, billing_state, billing_zip
          ]
        );
  
        const client = result.rows[0];
        const payloads = [{ topic: 'client_events', messages: JSON.stringify({ event: 'CREATE', data: client }), partition: 0 }];
        producer.send(payloads, (err, data) => {
          if (err) {
            console.error('Failed to send message to Kafka', err);
          } else {
            console.log('Message sent to Kafka', data);
          }
        });
  
        io.emit('client_created', client); // Broadcasting the new client to all WebSocket clients
  
        res.status(201).json(client); // Ensure the status code is set to 201
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    };
  }
  
  export function updateClient({ pool, producer, io }) {
    return async (req, res) => {
      const { id } = req.params;
      const {
        last_name,
        first_name,
        street_address,
        city,
        state,
        zip,
        tags,
        phone,
        email,
        tax_exempt,
        admin_notes,
        team_notes,
        latitude,
        longitude,
        plantation_id,
        weekly,
        client_type,
        payment_method,
        credit_card_number,
        credit_card_expiry,
        credit_card_cvv,
        billing_address_same,
        billing_street_address,
        billing_city,
        billing_state,
        billing_zip
      } = req.body;
  
      try {
        const result = await pool.query(
          `UPDATE clients SET
            last_name = $1, first_name = $2, street_address = $3, city = $4, state = $5, zip = $6,
            tags = $7, phone = $8, email = $9, tax_exempt = $10, admin_notes = $11, team_notes = $12,
            latitude = $13, longitude = $14, plantation_id = $15, weekly = $16, client_type = $17,
            payment_method = $18, credit_card_number = $19, credit_card_expiry = $20, credit_card_cvv = $21,
            billing_address_same = $22, billing_street_address = $23, billing_city = $24, billing_state = $25, billing_zip = $26,
            updated_at = CURRENT_TIMESTAMP WHERE id = $27 RETURNING *`,
          [
            last_name, first_name, street_address, city, state, zip, tags, phone, email, tax_exempt,
            admin_notes, team_notes, latitude, longitude, plantation_id, weekly, client_type,
            payment_method, credit_card_number, credit_card_expiry, credit_card_cvv,
            billing_address_same, billing_street_address, billing_city, billing_state, billing_zip, id
          ]
        );
  
        const client = result.rows[0];
        const payloads = [{ topic: 'client_events', messages: JSON.stringify({ event: 'UPDATE', data: client }), partition: 0 }];
        producer.send(payloads, (err, data) => {
          if (err) {
            console.error('Failed to send message to Kafka', err);
          } else {
            console.log('Message sent to Kafka', data);
          }
        });
  
        io.emit('client_updated', client); // Broadcasting the updated client to all WebSocket clients
  
        res.json(client);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    };
  }
  
  export function deleteClient({ pool, producer, io }) {
    return async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
  
        const client = result.rows[0];
        const payloads = [{ topic: 'client_events', messages: JSON.stringify({ event: 'DELETE', data: client }), partition: 0 }];
        producer.send(payloads, (err, data) => {
          if (err) {
            console.error('Failed to send message to Kafka', err);
          } else {
            console.log('Message sent to Kafka', data);
          }
        });
  
        io.emit('client_deleted', client); // Broadcasting the deleted client to all WebSocket clients
  
        res.sendStatus(204);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    };
  }
  