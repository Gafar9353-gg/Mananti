import { db } from './authController.js';

export const getMedicines = async (req, res) => {
  // Ensure array exists
  if (!db.medicines) db.medicines = [];
  res.json(db.medicines);
};

export const getPurchases = async (req, res) => {
  if (!db.purchases) db.purchases = [];
  res.json(db.purchases);
};

export const purchaseEntry = async (req, res) => {
  const { invoiceNo, invoiceDate, vendor, items, summary } = req.body;
  if (!db.medicines) db.medicines = [];
  if (!db.purchases) db.purchases = [];
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items array is required' });
  }

  // Save full invoice to purchases history
  const newPurchase = {
    _id: 'inv_' + Date.now() + Math.floor(Math.random() * 1000),
    invoiceNo: invoiceNo || '',
    invoiceDate: invoiceDate || new Date().toISOString(),
    vendor: vendor || 'Unknown',
    items,
    summary: summary || {},
    createdAt: new Date().toISOString()
  };
  db.purchases.push(newPurchase);

  items.forEach(item => {
    const qty = parseInt(item.qty || 0);
    const free = parseInt(item.free || 0);
    const totalQty = qty + free;
    
    if (totalQty <= 0) return;

    // Find if the medicine with the exact same name AND same batch exists
    const existingIndex = db.medicines.findIndex(m => 
      m.name.toLowerCase() === item.name.toLowerCase() && 
      (m.batch || '') === (item.batch || '')
    );
    
    if (existingIndex !== -1) {
      // Update existing medicine stock (same batch)
      db.medicines[existingIndex].stock += totalQty;
      db.medicines[existingIndex].vendor = vendor || db.medicines[existingIndex].vendor;
      // We don't overwrite mrp/exp because it's the same batch
      db.medicines[existingIndex].lastRestocked = new Date().toISOString();
    } else {
      // Add new medicine (or new batch of existing medicine)
      const newMed = {
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
      };
      db.medicines.push(newMed);
    }
  });

  res.status(201).json({ medicines: db.medicines, purchase: newPurchase });
};

export const adjustStock = async (req, res) => {
  const { name, stock } = req.body;
  if (!db.medicines) db.medicines = [];

  const existingIndex = db.medicines.findIndex(m => m.name.toLowerCase() === name.toLowerCase());
  if (existingIndex === -1) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  db.medicines[existingIndex].stock = parseInt(stock);
  res.status(200).json(db.medicines);
};

export const addMedicine = async (req, res) => {
  const { name, pack, batch, exp, stock, mrp, sgstPercent, cgstPercent } = req.body;
  if (!db.medicines) db.medicines = [];
  
  const existing = db.medicines.find(m => m.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Medicine with this name already exists' });
  }

  const newMed = {
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
  };
  
  db.medicines.unshift(newMed);
  res.status(201).json(db.medicines);
};

export const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const { name, pack, batch, exp, stock, mrp, sgstPercent, cgstPercent } = req.body;
  if (!db.medicines) db.medicines = [];

  const index = db.medicines.findIndex(m => m._id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  db.medicines[index] = {
    ...db.medicines[index],
    name: name || db.medicines[index].name,
    pack: pack || db.medicines[index].pack,
    batch: batch || db.medicines[index].batch,
    exp: exp || db.medicines[index].exp,
    stock: stock !== undefined ? parseInt(stock) : db.medicines[index].stock,
    mrp: mrp !== undefined ? mrp : db.medicines[index].mrp,
    sgstPercent: sgstPercent !== undefined ? parseFloat(sgstPercent) : db.medicines[index].sgstPercent,
    cgstPercent: cgstPercent !== undefined ? parseFloat(cgstPercent) : db.medicines[index].cgstPercent
  };

  res.status(200).json(db.medicines);
};

export const markPurchasePaid = async (req, res) => {
  const { id } = req.params;
  if (!db.purchases) db.purchases = [];

  const index = db.purchases.findIndex(p => p._id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Purchase not found' });
  }

  db.purchases[index].status = 'Paid';
  res.status(200).json(db.purchases[index]);
};

