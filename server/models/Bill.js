import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    billType: {
      type: String,
      enum: ['Consultation', 'Lab Test', 'Pharmacy', 'Surgery', 'Other'],
      required: true,
    },
    filePath: {
      type: String, // URL or relative path to the image/PDF
      required: true,
    },
    originalName: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Bill', billSchema);
