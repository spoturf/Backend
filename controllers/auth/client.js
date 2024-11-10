import { db } from "../../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const ClientRegister = (req, res) => {
  const q = "SELECT * FROM turfs WHERE email=?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Client Already exist");
    const q =
      "INSERT INTO turfs (`turfName`, `ownerName`, `contactNo`, `email`, `password`, `address`, `price`, `startTime`, `endTime`, `image1`, `image2`, `image3`, `Status`) VALUES (?)";
    const values = [
      req.body.turfName,
      req.body.clientName,
      req.body.contactNo,
      req.body.email,
      req.body.password,
      req.body.address,
      req.body.price,
      req.body.startTime,
      req.body.endTime,
      req.body.img1,
      req.body.img2,
      req.body.img3,
      req.body.status,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Client add successfully");
    });
  });
};

export const ClientLogin = (req, res) => {
  const q = "SELECT * FROM turfs WHERE username=?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Client Not found");
    const checkedPassword = data[0].password === req.body.password
    if (!checkedPassword) {
      return res.status(400).json("Wrong email and password");
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

export const ClientLogout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("Logged out");
};

export const getClient = (req, res) => {
  const q = "SELECT * FROM turfs";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteClient = (req, res) => {
  const q = "SELECT * FROM turfs WHERE `TID`=?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(409).json("Client not found");
    const q = "DELETE FROM turfs WHERE `TID`=?";
    db.query(q, [req.params.id], (err, data) => {
      return res.status(200).json("Client deleted.");
    });
  });
};
