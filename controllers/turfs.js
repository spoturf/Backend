import { db } from "../connect.js";

// Create a new turf
export const createTurf = (req, res) => {
  const {
    turfName,
    area,
    address,
    price,
    maps,
    startTime,
    endTime,
    gamesAvailable,
    amenities,
    images,
    username,
    password,
    status,
    ownerName, // New attribute
    mobileNo, // New attribute
  } = req.body;

  const q =
    "INSERT INTO turfs (turfName, area, address, price, maps, startTime, endTime, gamesAvailable, amenities, images, username, password, ownerName, mobileNo, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

  const values = [
    turfName,
    area,
    address,
    price,
    maps,
    startTime,
    endTime,
    JSON.stringify(gamesAvailable),
    JSON.stringify(amenities),
    JSON.stringify(images),
    username,
    password,
    ownerName, // New value
    mobileNo, // New value
    status,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({
      TID: data.insertId,
      turfName,
      area,
      address,
      price,
      maps,
      startTime,
      endTime,
      gamesAvailable,
      amenities,
      images,
      username,
      password,
      ownerName,
      mobileNo,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });
};

// Get all turfs
export const getTurfs = (req, res) => {
  const q =
    "SELECT TID, turfName, area, address, price, maps, startTime, endTime, gamesAvailable, amenities, images, username, password, ownerName, mobileNo, status, created_at, updated_at, rating FROM turfs"; // Added new columns

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Get a turf by TID
export const getTurfByTID = (req, res) => {
  const q =
    "SELECT TID, rating, turfName, area, address, price, maps, startTime, endTime, gamesAvailable, amenities, images, username, password, ownerName, mobileNo, status, created_at, updated_at FROM turfs WHERE TID = ?"; // Added new columns

  db.query(q, [req.params.TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("Turf not found");
    return res.status(200).json(data[0]);
  });
};

// Update a turf
export const updateTurf = (req, res) => {
  const {
    turfName,
    area,
    address,
    price,
    maps,
    startTime,
    endTime,
    gamesAvailable,
    amenities,
    images,
    status,
  } = req.body;

  const q = `UPDATE turfs SET turfName = ?, area = ?, address = ?, price = ?, maps = ?, startTime = ?, endTime = ?, gamesAvailable = ?, amenities = ?, images = ?, status = ?, updated_at = NOW() WHERE TID = ?`;

  const values = [
    turfName,
    area,
    address,
    price,
    maps,
    startTime,
    endTime,
    JSON.stringify(gamesAvailable),
    JSON.stringify(amenities),
    JSON.stringify(images),
    status,
    req.params.TID,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0) return res.status(404).json("Turf not found");
    return res.status(200).json("Turf updated successfully");
  });
};
export const updateClient = (req, res) => {
  const { ownerName, mobileNo } = req.body;

  const q = `UPDATE turfs SET ownerName = ?, mobileNo=? WHERE TID = ?`;

  const values = [ownerName, mobileNo, req.params.TID];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0) return res.status(404).json("Turf not found");
    return res.status(200).json("Turf updated successfully");
  });
};
export const updateStatus = (req, res) => {
  const { status } = req.body;

  const q = `UPDATE turfs SET status = ? WHERE TID = ?`;

  const values = [status, req.params.TID];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0) return res.status(404).json("Turf not found");
    return res.status(200).json("Turf updated successfully");
  });
};

// Delete a turf
export const deleteTurf = (req, res) => {
  const q = "DELETE FROM turfs WHERE TID = ?";

  db.query(q, [req.params.TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0) return res.status(404).json("Turf not found");
    return res.status(200).json("Turf deleted successfully");
  });
};
