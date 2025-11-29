const { json } = require('express');
const PROPS = require('./Models/propSchema');
const   PROP_SCHEDULES = require('./Models/propSchedules');
const { response } = require('../app');
const properties = require('./Models/propSchema');


const addProperty = async (req,res) => {
    try{         
        console.log("Property data:", req.body);
        console.log("Property file:", req.file);
        const imageUrl = req.file?.path;

        const newProperty = PROPS({
            propname: req.body.propname,
            state: req.body.state,
            type: req.body.type,
            propcount: req.body.propcount,
            propaddress: req.body.propaddress,
            propImg: imageUrl,
        });

        await newProperty.save();    
        res.status(201).json({
            success: true,
            message: 'Property added successfully',
            imageUrl,
        });
    } catch(error){
        console.error(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
};

const addTimeSlotData = async (req,res) => {
    try{
        // console.log(req.body, '');
        const {startDate, endDate, selectedTimings, propId} = req.body;   //Destructuring method
        // console.log(startDate, endDate, selectedTimings, propId);
        let firstDate = new Date(startDate);
        const lastDate = new Date(endDate);
        const slotObject = [];
        const omittedSlots = [];

        while(firstDate <= lastDate) {
            for (let data of selectedTimings) {
                console.log(firstDate, "first date");

                const existingSlot = await PROP_SCHEDULES.findOne({
                    date: firstDate,
                    'slot.name':data.name,
                    propId,
                });
                
                if(!existingSlot){
                    slotObject.push({
                        date:JSON.parse(JSON.stringify(firstDate)),    //To pass the date as value instead od reference use json parse
                        slot:{
                            name:data.name,
                            id:data.id,
                        },
                        propId,
                    });
                } else{
                    omittedSlots.push({
                        date:JSON.parse(JSON.stringify(firstDate)),    //To pass the date as value instead od reference use json parse
                        slot:{
                            name:data.name,
                            id:data.id,
                        },
                    });
                }
            }
            firstDate.setDate(firstDate.getDate()+1);
        }
        if(slotObject.length > 0) {
            PROP_SCHEDULES.insertMany(slotObject).then((resp)=>{            
                res.status(200).json('Time slots created Successfully');
            })
        }
        if(slotObject.length === 0 && omittedSlots.length >1) {
            res.status(200).json('These slots are already added');
        }
        if(slotObject.length === 0 && omittedSlots.length == 1) {
            res.status(200).json('These slot is already added');
        }
        console.log('Omitted slots:', omittedSlots);
        console.log('Added slots:', slotObject);
        }catch (error) {
            console.error(error);
            res.status(500).json('Internal Server Error'); 
        }
    };

const deleteTimeSlotData = async (req,res) => {
    try {
        console.log(req.body, "Request is:");
        const {selectedSlotIds} = req.body;        

        const deleteData = await PROP_SCHEDULES.deleteMany({
            _id: { $in : selectedSlotIds},
        });

        if(deleteData.deletedCount > 0){
            res.status(200).json("Slots deleted successfully");
            console.log(deleteData.deletedCount, " slots Deleted");
        }else {
            res.status(404).json("No slots found for deletion");
        } 
    }catch (err){
        console.log(err);
    }
};

const updatePropData = (req,res) => {
    try {
        console.log(req.body, "update is:");
        PROPS.updateOne({_id:req.body._id},
            {$set:{propname:req.body.propname,
                state:req.body.state,
                type:req.body.type,
                propcount:req.body.propcount,
                propaddress:req.body.propaddress}}).then((response)=>{
            res.status(200).json(response);
        })
         
    }catch (err){
        console.log(err);
    }
};
 
module.exports= {addProperty,addTimeSlotData,deleteTimeSlotData,updatePropData}