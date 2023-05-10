const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      sparse: true,
    },
    lName: {
      type: String,
      required: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      sparse: true,
    },
    companyName: {
      type: String,
      sparse: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid'],
      default: 'unpaid',
    },
    subscriptionId: {
      type: String,
      default: null,
    },
    subscriptionPlanName: {
      type: String,
      default: null,
    },
    subscriptionPlanId: {
      type: String,
      default: null,
    },
    verifiedStatus: {
      type: Boolean,
      default: false,
      sparse: true,
    },
    otp: {
      type: Number,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
