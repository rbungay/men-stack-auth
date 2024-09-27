import { Router } from "express";
const router = Router();

// build out routes here

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

export default router;
