import { Medicine, Purchase } from '../models/index.js';

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const purchaseEntry = async (req, res) => {
  try {
    const { invoiceNo, invoiceDate, vendor, items, summary } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const newPurchase = await Purchase.create({
      _id: 'inv_' + Date.now() + Math.floor(Math.random() * 1000),
      invoiceNo: invoiceNo || '',
      invoiceDate: invoiceDate || new Date().toISOString(),
      vendor: vendor || 'Unknown',
      items,
      summary: summary || {},
      createdAt: new Date().toISOString()
    });

    for (const item of items) {
      const qty = parseInt(item.qty || 0);
      const free = parseInt(item.free || 0);
      const totalQty = qty + free;
      
      if (totalQty <= 0) continue;

      // Find exact same name and batch (case-insensitive for name)
      const existingMed = await Medicine.findOne({ 
        name: { $regex: new RegExp('^' + item.name + '$', 'i') },
        batch: item.batch || ''
      });
      
      if (existingMed) {
        existingMed.stock = (existingMed.stock || 0) + totalQty;
        existingMed.vendor = vendor || existingMed.vendor;
        existingMed.lastRestocked = new Date().toISOString();
        await existingMed.save();
      } else {
        await Medicine.create({
          _id: 'med_' + Date.now() + Math.floor(Math.random() * 1000),
          name: item.name,
          vendor: vendor || 'Unknown',
          stock: totalQty,
          batch: item.batch || '',
          exp: item.exp || '',
          mrp: item.mrp || '',
          rate: item.rate || '',
          pack: item.pack || '',
          sgstPercent: item.sgstPercent || 0,
          cgstPercent: item.cgstPercent || 0,
          lastRestocked: new Date().toISOString()
        });
      }
    }

    const updatedMedicines = await Medicine.find().sort({ name: 1 });
    res.status(201).json({ medicines: updatedMedicines, purchase: newPurchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { name, stock } = req.body;
    
    const med = await Medicine.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (!med) return res.status(404).json({ message: 'Medicine not found' });

    med.stock = parseInt(stock);
    await med.save();
    
    const allMeds = await Medicine.find().sort({ name: 1 });
    res.status(200).json(allMeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMedicine = async (req, res) => {
  try {
    const { name, pack, batch, exp, stock, mrp, sgstPercent, cgstPercent } = req.body;
    
    const existing = await Medicine.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Medicine with this name already exists' });
    }

    await Medicine.create({
      _id: 'med_' + Date.now() + Math.floor(Math.random() * 1000),
      name,
      pack: pack || '',
      batch: batch || '',
      exp: exp || '',
      stock: parseInt(stock) || 0,
      vendor: 'Manual Entry',
      mrp: mrp || '',
      rate: '',
      sgstPercent: parseFloat(sgstPercent) || 0,
      cgstPercent: parseFloat(cgstPercent) || 0,
      lastRestocked: new Date().toISOString()
    });
    
    const allMeds = await Medicine.find().sort({ name: 1 });
    res.status(201).json(allMeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);
    if (updateData.sgstPercent !== undefined) updateData.sgstPercent = parseFloat(updateData.sgstPercent);
    if (updateData.cgstPercent !== undefined) updateData.cgstPercent = parseFloat(updateData.cgstPercent);

    const updated = await Medicine.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Medicine not found' });

    const allMeds = await Medicine.find().sort({ name: 1 });
    res.status(200).json(allMeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markPurchasePaid = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByIdAndUpdate(id, { status: 'Paid' }, { new: true });
    
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
