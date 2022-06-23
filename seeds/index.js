const mongoose = require('mongoose');

const Campground = require('../models/campground')

const cities = require('./cities');

const {places, descriptors} = require('./seedsHelper');

//connecting mongoose to mongo db
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=> {
    console.log('Connection Open')
})
.catch((err)=>{
    console.log('Oh No Error!!')
    console.log(err);
})

//Picking a random element out of the array
const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 400; i++){
        const random1000 = Math.floor(Math.random() * 1000 )
        const price = Math.floor(Math.random() * 20 ) + 10
    const camp = new Campground({
        author: '6293ceea8bf04ba9a3c651c0',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto explicabo laborum molestiae quas, autem possimus quia minima corrupti ipsam molestias similique non tempore beatae modi quos ex consectetur sed harum?',
        price,
        geometry: {
            type: 'Point', 
            coordinates: [ cities[random1000].longitude,
                            cities[random1000].latitude,]
        },
        images: [
            {
              url: 'https://res.cloudinary.com/skyecamp/image/upload/v1654887238/SkyeCamp/ugrcrudodhacuymg7k1i.jpg',
              filename: 'SkyeCamp/ugrcrudodhacuymg7k1i'
            },
            {
              url: 'https://res.cloudinary.com/skyecamp/image/upload/v1654887241/SkyeCamp/y5supwazmdkazvxzkxx6.jpg',
              filename: 'SkyeCamp/y5supwazmdkazvxzkxx6'
            }
          ]
    })

    await camp.save()

    }

}

seedDB().then(()=>{
    mongoose.connection.close()
})