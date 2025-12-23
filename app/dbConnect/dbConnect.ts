import mongoose from "mongoose";
interface connection {
  connected?: boolean;
}
let connection: connection = {};

export async function dbConnect() {
  if (connection.connected) {
    return;
  }
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI!);

    if (connect.connection.readyState == 1) {
      connection.connected = true;
    }
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
}
