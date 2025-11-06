const Visitor = require('../models/visitor.model');
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const streamToBuffer = require('../utils/streamToBuffer');
const dotenv = require('dotenv');
const axios = require('axios');
const FormData = require('form-data');

dotenv.config();

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  }
});

exports.registerVisitor = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${command.input.Key}`;

    const visitor = new Visitor({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      scheduledAt: req.body.scheduledAt,
      imageUrl,
    });
    await visitor.save();
    res.status(201).json(visitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register visitor' });
  }
};

exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Not found' });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getVisitorsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const visitors = await Visitor.find({
      scheduledAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    res.json(visitors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyVisitor = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Visitor ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const fc_image = req.file.buffer;
    console.log('Face capture image loaded, size:', fc_image.length, 'bytes');

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    const imageUrl = visitor.imageUrl;
    const bucketName = process.env.BUCKET_NAME;
    const bucketRegion = process.env.BUCKET_REGION;

    // Extract the object key from the S3 URL
    const urlParts = imageUrl.split('.amazonaws.com/');
    if (urlParts.length < 2) {
      throw new Error('Invalid S3 URL format');
    }
    const objectKey = urlParts[1];

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey
    });

    const s3Response = await s3Client.send(command);
    const pv_image = await streamToBuffer(s3Response.Body);

    console.log('Pre-visit image loaded, size:', pv_image.length, 'bytes');

    // 🔁 Prepare request to Python
    const form = new FormData();
    form.append('image1', pv_image, { filename: 'previsit.jpg' });
    form.append('image2', fc_image, { filename: 'facecapture.jpg' });

    const pythonResponse = await axios.post(`${process.env.PYTHON_SERVICE_URL}/compare`, form, {
      headers: form.getHeaders(),
    });

    const { match, confidence } = pythonResponse.data;
    console.log(`Verification result for visitor ID ${id}: match=${match}, confidence=${confidence}`);

    res.status(200).json({
      match,
      confidence,
      visitorId: id,
      visitorName: visitor.fullName,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify visitor' });
  }
};
