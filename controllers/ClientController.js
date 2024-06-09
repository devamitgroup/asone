const Client = require("../models/Client");

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get client by slug
exports.getClientBySlug = async (req, res, next) => {
  try {
    const client = await Client.findOne({ slug: req.params.slug });
    if (!client) {
      next();
      return;
    }
    res.locals.client = client;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add client
exports.addClient = async (req, res) => {
  try {
    const { name } = req.body;
    const avt = req.file.path;
    const client = new Client({
      name,
      avt,
    });
    await client.save();
    res.status(200).json({ message: "Client added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update client by id
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    client.name = req.body.name || client.name;
    if (req.file) {
      client.avt = req.file.path;
    }
    await client.save();
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete client by id
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
