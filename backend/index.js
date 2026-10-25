require("./config/env"); // keep your existing file: it must load .env before anything else
const app = require("./app");
const connectDB = require("./config/db");

const { PORT = 4000 } = process.env;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server is started on port ${PORT}`)))
  .catch((error) => {
    console.error("Error in MongoDB connection =", error);
    process.exit(1);
  });