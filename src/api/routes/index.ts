import { Router } from "express";
import albums from "./albums";
import user from "./user";

const router = Router();
user(router);
albums(router);

export default router;
