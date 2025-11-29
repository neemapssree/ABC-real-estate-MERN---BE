var express = require('express');
var router = express.Router();
const { addProperty, addTimeSlotData, deleteTimeSlotData, updatePropData } = require('../controllers/adminController');

const multer = require('multer');
const { adminAuth } = require('../middlewares/authorization');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'properties',
        allowed_formats: ['jpg', 'jpeg', 'webp', 'png', 'svg'],
    },
});

const upload = multer({ storage });


router.post('/addProperty',adminAuth,upload.single('image'), addProperty);      // before devaiting to addProeprty, will modify the image file using multer
//router.post('/addProperty', upload.single('image'), addProperty);
router.post('/addTimeSlotData',adminAuth,addTimeSlotData);
router.post('/deleteTimeSlot',adminAuth,deleteTimeSlotData);
router.post('/updatePropData',adminAuth, updatePropData);
module.exports=router;