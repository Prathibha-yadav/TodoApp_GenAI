require("dotenv").config();
const app = require("./app");
app.listen(process.env.PORT, () => {
  console.log("Started express server at 3300");
});
