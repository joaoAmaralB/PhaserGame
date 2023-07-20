const mongoose = require('mongoose');

const RankingSchema = new mongoose.Schema(
  {
    record: Number,
    old_record: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ranking', RankingSchema);