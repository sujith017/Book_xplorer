import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        const conn = await mongoose.connect();

        console.log(`connected to db successfully  : ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}