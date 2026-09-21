import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    gender: String,
    contact: String,
    address: String,
    disease: String,
    notes: String,
    dateOfVisit: Date,
    remarks: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevent generating ObjectId for each history entry
);

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String },
    disease: { type: String, required: true },
    notes: { type: String },
    dateOfVisit: { type: Date, required: true },
    remarks: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    history: [historySchema],
    bills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to push current state to history before saving if modifying
patientSchema.pre('save', function (next) {
  // If the document is modified (not new), push the OLD state to history
  if (!this.isNew && this.isModified()) {
    // Only capture fields we want in history
    // Since we are inside pre('save'), we have to capture the original values or we can do it in the controller.
    // It's often safer and easier to handle history in the controller to get exactly what the user updated,
    // but doing it carefully here works too. For this app, doing it explicitly in the controller is more flexible.
  }
  next();
});

export default mongoose.model('Patient', patientSchema);
