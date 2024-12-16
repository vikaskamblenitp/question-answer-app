import express from "express";
import routes from "./api/index.js";
import { pinoHttpLogger } from "#helpers";
import { jsend } from "#utils";
import { errorMiddleware } from "#middlewares";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(pinoHttpLogger);
app.use(jsend());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

app.use(((err, req, res, next) => {
	errorMiddleware(err, req, res);
}) as express.ErrorRequestHandler);

export { app };