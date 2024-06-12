const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 2830;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mydatabase');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  title: String,
  releasedate: String,
  director: String,
  budget: String,
  ticketprice: Number,
  image: String,
  description:String
});

const Item = mongoose.model('Item', itemSchema);

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/items/:_id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params._id);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
