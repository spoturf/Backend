//controllers/admin.js
import { db } from "../../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AdminRegister = (req, res) => {
  const q = "SELECT * FROM admin WHERE username=?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User Already exist");
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO admin (`username`,`password`,`name`) VALUES (?)";
    const values = [
      req.body.username,
      hashedPassword,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Admin add successfully");
    });
  });
};

export const AdminLogin = (req, res) => {
  const q = "SELECT * FROM admin WHERE username=?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Admin Not found");

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkedPassword) {
      return res.status(400).json("Wrong username and Password");
    }
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const AdminLogout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("Logged out");
};

export const getAdmin = (req, res) => {
  const q = "SELECT * FROM admin";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const deleteAdmin = (req,res) => {
  const q = "SELECT * FROM admin WHERE `AID`=?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(409).json("Admin not found");
    const q = "DELETE FROM admin WHERE `AID`=?";
    db.query(q, [req.params.id], (err, data) => {
      return res.status(200).json("Admin deleted.");
    });
  });
}
export const updateAdmin = (req, res) => {
  const { name, username } = req.body;
  const q = "UPDATE admin SET name = ?, username = ? WHERE AID = ?";
  const values = [name, username, req.params.id];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Admin updated successfully");
  });
};

// Get admin details
export const getAdminDetails = (req, res) => {
  const q = "SELECT * FROM admin WHERE AID = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Admin not found.");
    return res.status(200).json(data[0]); // Return the first admin record
  });
};
