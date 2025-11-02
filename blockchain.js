const express = require('express');
const router = express.Router();
const { MedicalBlockchain } = require('../blockchain/MedicalBlockchain');
const Blockchain = require('../models/Blockchain');
const Patient = require('../models/Patient');

// Initialize blockchain for a patient
router.post('/init', async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    // Check if blockchain already exists
    const existing = await Blockchain.findOne({ patientId });
    if (existing) {
      return res.status(400).json({ 
        error: 'Blockchain already exists for this patient',
        blockchainId: existing._id
      });
    }

    // Create new blockchain
    const medicalBlockchain = new MedicalBlockchain(patientId);
    
    // Save to database
    const blockchainDoc = new Blockchain({
      patientId,
      chain: medicalBlockchain.chain,
      isValid: true
    });

    await blockchainDoc.save();

    res.status(201).json({
      success: true,
      message: 'Blockchain initialized successfully',
      blockchainId: blockchainDoc._id,
      genesisBlock: medicalBlockchain.chain[0]
    });

  } catch (error) {
    console.error('Blockchain init error:', error);
    res.status(500).json({ error: 'Failed to initialize blockchain' });
  }
});

// Add a new block to patient's blockchain
router.post('/add-block', async (req, res) => {
  try {
    const { patientId, recordType, data, updatedBy } = req.body;

    if (!patientId || !recordType || !updatedBy) {
      return res.status(400).json({ 
        error: 'Patient ID, record type, and updatedBy are required' 
      });
    }

    // Find blockchain
    let blockchainDoc = await Blockchain.findOne({ patientId });

    if (!blockchainDoc) {
      // Initialize if doesn't exist
      const medicalBlockchain = new MedicalBlockchain(patientId);
      blockchainDoc = new Blockchain({
        patientId,
        chain: medicalBlockchain.chain,
        isValid: true
      });
    }

    // Load blockchain
    const medicalBlockchain = new MedicalBlockchain(patientId, blockchainDoc.chain);

    // Add new block
    const blockData = {
      patientId,
      recordType,
      updatedBy,
      ...data
    };

    const newBlock = medicalBlockchain.addBlock(blockData);

    // Update database
    blockchainDoc.chain = medicalBlockchain.chain;
    blockchainDoc.isValid = medicalBlockchain.validateChain();
    await blockchainDoc.save();

    res.status(201).json({
      success: true,
      message: 'Block added successfully',
      block: newBlock,
      chainLength: medicalBlockchain.getChainLength(),
      isValid: blockchainDoc.isValid
    });

  } catch (error) {
    console.error('Add block error:', erro