import dotenv from "dotenv";
import createApp from "./app";

dotenv.config();
const app = createApp();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
