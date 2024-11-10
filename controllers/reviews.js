import { db } from "../connect.js";

export const getReviewsByTurf = (req, res) => {
  const { TID } = req.params;
  const query = 'SELECT r.RID, r.message, r.rating, c.name, c.profilePic,r.createdAt FROM reviews r JOIN customers c ON r.CID = c.CID WHERE r.TID = ?';

  db.query(query, [TID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
};
export const addReview = (req, res) => {
  const { TID, CID, message, rating } = req.body;
  const query = 'INSERT INTO reviews (TID, CID, message, rating) VALUES (?, ?, ?, ?)';

  db.query(query, [TID, CID, message, rating], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.status(201).json({ message: 'Review added successfully', reviewId: results.insertId });
  });
};
export const deleteReview = (req, res) => {
  const { RID } = req.params;
  const query = 'DELETE FROM reviews WHERE RID = ?';

  db.query(query, [RID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  });
};
