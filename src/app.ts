import express from "express";
import mongoose from "mongoose";
import usersRoutes from "./routes/users";
import cardsRoutes from "./routes/cards";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());
app.use((req: any, res, next) => {
  req.user = {
    _id: "631434bf39d0035c15a1f603",
  };
  next();
});
app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
