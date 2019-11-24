const moongose = require('mongoose');

const campaignSchema = moongose.Schema({
  entity: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  date: Date,
  status: String,
  step: String,
  status_date: Date
});

const Campaign = moongose.model('Campaign', campaignSchema);

module.exports = { Campaign }
