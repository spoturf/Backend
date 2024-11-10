import express from 'express';
import { createCustomer, getCustomers, getCustomerByCID, updateCustomer, deleteCustomer, getCustomerByTID } from '../controllers/customers.js';

const router = express.Router();

router.post('/', createCustomer);                // Create a new customer
router.get('/', getCustomers);                   // Get all customers
router.get('/customer/:CID', getCustomerByCID);           // Get a customer by CID
router.get('/turf/:TID', getCustomerByTID);           // Get a customer by CID
router.put('/:CID', updateCustomer);             // Update a customer
router.delete('/:CID', deleteCustomer);          // Delete a customer

export default router;
