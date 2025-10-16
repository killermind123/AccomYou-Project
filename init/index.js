const mongoose = require('mongoose');
const initdata = require('../init/data.js');
const Listing = require('../model/list.js');

async function main() {
    try {
        await mongoose.connect(process.env.ATLAS_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

const initdb = async () => {
    try {
        await Listing.deleteMany({});
        initdata.data = initdata.data.map((obj) => ({
            ...obj,
            owner: '68d6e09a5e38fabc91523959',
            geometry: { type: 'Point', coordinates: [ 74.054111, 15.325556 ]}

        }));
        await Listing.insertMany(initdata.data);
        console.log('✅ Database initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    } finally {
        mongoose.connection.close(); // Close connection after seeding
    }
};

(async () => {
    await main();
    await initdb();
})();
