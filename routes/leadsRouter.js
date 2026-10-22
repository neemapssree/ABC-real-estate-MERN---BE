const transporter = require("../config/mailer");
var express = require('express');
const Lead = require("../controllers/Models/Lead");
const axios = require("axios");

var router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields' 
            });
        }

        // 1. Create and Save the MongoDB document
        const newLead = new Lead({
            firstName,
            lastName,
            email,
            phone,
            message
        });
        await newLead.save();

        // 2. Send the contact to HubSpot (with dedicated error catching for existing contacts)
        let hubspotId = null;
        try {
            const hubspotResponse = await axios.post(
            "https://api.hubapi.com/crm/v3/objects/contacts",
            {
                properties: {
                    firstname: firstName,
                    lastname: lastName,
                    email,
                    phone
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        hubspotId = hubspotResponse.data.id;
    } catch(hsError) {
        if(hsError.response && hsError.response.data && hsError.response.data.category === 'CONFLICT') {
            const messageStr = hsError.response.data.message;
            const match = messageStr.match(/Existing ID: (\d+)/);
            hubspotId = match ? match[1] : "EXISTING_CONTACT";
            console.log(`HubSpot contact already exists. Linked to ID: ${hubspotId}`);
        }else {
            console.error("HubSpot Error:", hsError.response?.data || hsError.message);
            hubspotId = "FAILED_TO_CREATE";
        }        
    }

        // 3. Send the Admin Email Notification
        let emailSent = false;
        try {
            await transporter.sendMail({
                from: process.env.SMTP_USER || "test@ethereal.email",
                to: process.env.ADMIN_EMAIL,
                subject: "New Lead Submitted",
                text: `
                A new lead has been submitted.
                Name: ${firstName} ${lastName}
                Email: ${email}
                Phone: ${phone}
                Message: ${message || "No message provided"}
                MongoDB ID: ${newLead._id}
                HubSpot ID: ${hubspotId}
                `
            });
            emailSent = true;
            console.log("Admin notification email sent successfully.");
        } catch (emailError) { 
            console.error("Failed to send admin email:", emailError.message);
        }

        // 4. Return success response
        return res.status(201).json({
            success: true,
            message: 'Lead processed successfully',
            mongoId: newLead._id,
            hubspotId: hubspotId,
            emailSent
        });
        
    } catch (error) {
        console.error(
            "Lead submission error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to complete lead submission."
        });
    }
});

module.exports = router;