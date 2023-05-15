const mongoose = require('mongoose');

const namespaceSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: false
  }
});

const Namespace = mongoose.models.Namespace
  ? mongoose.model('Namespace')
  : mongoose.model('Namespace', namespaceSchema);

module.exports = Namespace;
