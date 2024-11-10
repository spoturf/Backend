import { db } from "../connect.js";

// Create a new customer
export const createCustomer = (req, res) => {
  const { name, mobileNo, area, profilePic, email, address } = req.body;

  const query = `
    INSERT INTO customers (name, mobileNo, area, profilePic, email, address)
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [name, mobileNo, area, profilePic, email, address];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(201)
      .json({
        CID: data.insertId,
        name,
        mobileNo,
        area,
        profilePic,
        email,
        address,
      });
  });
};

// Get all customers
export const getCustomers = (req, res) => {
  const query = `SELECT CID, name, mobileNo, area, profilePic, email, address FROM customers`;

  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Get a customer by CID
export const getCustomerByCID = (req, res) => {
  const query = `SELECT CID, name, mobileNo, area, profilePic, email, address FROM customers WHERE CID = ?`;

  db.query(query, [req.params.CID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("Customer not found");
    return res.status(200).json(data[0]);
  });
};
// Get a customer by TID
export const getCustomerByTID = (req, res) => {
  const query = `
    SELECT 
      c.CID, c.name, c.mobileNo, c.area, c.profilePic, c.email, c.address, 
      b.BID, b.date, b.slot, b.game, b.teamMembers, b.court 
    FROM 
      customers c 
    LEFT JOIN 
      bookings b 
    ON 
      c.CID = b.CID 
    WHERE 
      b.TID = ?
    ORDER BY b.date
    DESC
  `;

  db.query(query, [req.params.TID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("No customers found for this TID");

    const customers = {};

    data.forEach(row => {
      const {
        CID, name, mobileNo, area, profilePic, email, address,
        BID, date, slot, game, teamMembers, court
      } = row;

      // If customer is not already added, initialize customer details with an empty bookings array
      if (!customers[CID]) {
        customers[CID] = {
          CID,
          name,
          mobileNo,
          area,
          profilePic,
          email,
          address,
          bookings: []
        };
      }

      // Add each booking to the customer's bookings array
      customers[CID].bookings.push({
        BID,
        date,
        slot,
        game,
        teamMembers,
        court
      });
    });

    // Convert the customers object to an array of customer objects
    const result = Object.values(customers);

    return res.status(200).json(result);
  });
};


// Update a customer
export const updateCustomer = (req, res) => {
  const { name, mobileNo, area, profilePic, email, address } = req.body;
  const query = `
    UPDATE customers SET name = ?, mobileNo = ?, area = ?, profilePic = ?, email = ?, address = ? 
    WHERE CID = ?`;

  const values = [
    name,
    mobileNo,
    area,
    profilePic,
    email,
    address,
    req.params.CID,
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json("Customer not found");
    return res.status(200).json("Customer updated successfully");
  });
};

// Delete a customer
export const deleteCustomer = (req, res) => {
  const query = `DELETE FROM customers WHERE CID = ?`;

  db.query(query, [req.params.CID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json("Customer not found");
    return res.status(200).json("Customer deleted successfully");
  });
};
