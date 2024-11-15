import { db } from "../connect.js";

// Create a new booking
export const createBooking = (req, res) => {
  const {
    CID,
    TID,
    date,
    slot,
    game,
    court,
    paymentAmount,
    paymentMethod,
    status,
  } = req.body;

  const query = `
    INSERT INTO bookings (CID, TID, date, slot, game, court, paymentAmount, paymentMethod, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  const values = [
    CID,
    TID,
    date,
    JSON.stringify(slot),
    game,
    court,
    paymentAmount,
    paymentMethod,
    status,
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({
      BID: data.insertId,
      CID,
      TID,
      date,
      slot,
      game,
      court,
      paymentAmount,
      paymentMethod,
      status,
    });
  });
};

// Get all bookings for a customer by CID
export const getBookingsByCID = (req, res) => {
  const query = `
    SELECT b.*,t.turfName 
    FROM bookings b JOIN turfs t ON t.TID=b.TID WHERE CID = ? ORDER BY date DESC`;

  db.query(query, [req.params.CID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const getBookings = (req, res) => {
  const query = `
    SELECT * 
    FROM bookings ORDER BY date DESC`;

  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Get a booking by BID
export const getBookingByBID = (req, res) => {
  const query = `
    SELECT * 
    FROM bookings WHERE BID = ? ORDER BY date DESC`;

  db.query(query, [req.params.BID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("Booking not found");
    return res.status(200).json(data);
  });
};
export const getBookingByTID = (req, res) => {
  const query = `
    SELECT * 
    FROM bookings WHERE TID = ? ORDER BY date DESC`;

  db.query(query, [req.params.TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("Booking not found");
    return res.status(200).json(data);
  });
};
export const getBookingAll = (req, res) => {
  const query = `
    SELECT b.*,c.*
    FROM bookings b JOIN customers c ON c.CID=b.CID WHERE TID = ? ORDER BY date DESC`;

  db.query(query, [req.params.TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("Booking not found");
    return res.status(200).json(data);
  });
};

// Get a booking by CID and TID
export const getBookingByCIDTID = (req, res) => {
  const query = `
    SELECT * FROM bookings WHERE CID = ? AND TID = ? ORDER BY date DESC`;

  db.query(query, [req.params.CID, req.params.TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("No bookings");
    return res.status(200).json(data);
  });
};

// Update a booking
export const updateBooking = (req, res) => {
  const { date, slot, game, court, paymentAmount, paymentMethod, status } =
    req.body;
  const query = `
    UPDATE bookings SET date = ?, slot = ?, game = ?, court = ?, paymentAmount = ?, paymentMethod = ?, status = ? WHERE BID = ?`;

  const values = [
    date,
    JSON.stringify(slot),
    game,
    court,
    paymentAmount,
    paymentMethod,
    status,
    req.params.BID,
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json("Booking not found");
    return res.status(200).json("Booking updated successfully");
  });
};
// Update a Status
export const updateStatus = (req, res) => {
  const { status } = req.body;
  const query = `
    UPDATE bookings SET status = ? WHERE BID = ?`;

  const values = [status, req.params.BID];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json("Booking not found");
    return res.status(200).json("Booking updated successfully");
  });
};

// Delete a booking
export const deleteBooking = (req, res) => {
  const query = `DELETE FROM bookings WHERE BID = ?`;

  db.query(query, [req.params.BID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json("Booking not found");
    return res.status(200).json("Booking deleted successfully");
  });
};

export const getBookingsByDate = (req, res) => {
  const { date } = req.params;

  const query = `
    SELECT b.*,c.*
    FROM bookings b JOIN customers c ON b.CID=c.CID WHERE date = ? ORDER BY date DESC`;

  db.query(query, [date], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length)
      return res.status(404).json("No bookings found for this date");
    return res.status(200).json(data);
  });
};

export const getBookingsByDateAndTID = (req, res) => {
  const { date, TID } = req.params;

  const query = `
    SELECT b.*,c.*
    FROM bookings b JOIN customers c ON b.CID=c.CID WHERE b.date = ? AND b.TID=? ORDER BY date DESC`;

  db.query(query, [date, TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length)
      return res.status(404).json("No bookings found for this date");
    return res.status(200).json(data);
  });
};
