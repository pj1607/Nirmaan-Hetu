import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" MongoDB Atlas Connected Successfully");
    } catch (err) {
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
    }
};

export default connectDB;
