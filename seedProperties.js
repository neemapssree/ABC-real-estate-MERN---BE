// const mongoose = require("mongoose");
// const PROPS = require('./controllers/Models/propSchema');

// mongoose.connect('mongodb+srv://neemapssree:neema123@cluster0.vyhgbbe.mongodb.net/test?retryWrites=true&w=majority')
// .then(() => console.log("Mongodb connected"))
// .catch((error) => console.log(error));

// async function seedProperties() {

//     const sampleProperties = [
//         {
//             propname: "Luxury Villa",
//             state: "Kerala",
//             type: "Villa",
//             propcount: 2,
//             propaddress: "Kochi Beach Road",
//             propImg: "villa1.jpg"
//         },
//         {
//             propname: "City Apartment",
//             state: "Kerala",
//             type: "Apartment",
//             propcount: 3,
//             propaddress: "MG Road, Kochi",
//             propImg: "apartment1.jpg"
//         }
//     ];

//     await PROPS.insertMany(sampleProperties);
//     console.log("Sample properties added!");
//     mongoose.disconnect();
    
// }

// seedProperties();