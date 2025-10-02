import mongoose from "mongoose";

const uri = "your_mongodb_uri_here";

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  passwordHash: String,
  favorites: { type: [Number], default: [] },
});

const User = mongoose.model("User", UserSchema);

async function addFavoritesFieldToUsers() {
  try {
    await mongoose.connect(uri);

    const result = await User.updateMany(
      { favorites: { $exists: false } },
      { $set: { favorites: [] } }
    );

    console.log(`Added favorites field to ${result.modifiedCount} user(s).`);
  } catch (err) {
    console.error("Error updating users: ", err);
  } finally {
    await mongoose.disconnect();
  }
}

addFavoritesFieldToUsers();
