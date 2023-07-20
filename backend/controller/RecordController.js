const Record = require('../model/RecordModel');

module.exports = {

  async store(req, res) {
    const ranking = await Record.create(req.body);

    return res.json(ranking);
  },

  async get(req, res) {
    let ranking = await Record.find();
    return res.json(ranking);
  }

};