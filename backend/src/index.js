import dotenv from "dotenv";
import app from "./app.js";
import { initScheduler } from "./jobs/expiryNotifier.js";

dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
  initScheduler();
});
