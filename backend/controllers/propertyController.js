const { Property, User } = require('../models');

const createProperty = async (req, res) => {
  try {
    const { title, description, location, pricePerNight } = req.body;

    if (!title || !location || !pricePerNight) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const property = await Property.create({
      title,
      description,
      location,
      pricePerNight,
      ownerId: req.user.id,
    });

    res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, location, pricePerNight, availability } = req.body;
    await property.update({ title, description, location, pricePerNight, availability });

    res.json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await property.destroy();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};