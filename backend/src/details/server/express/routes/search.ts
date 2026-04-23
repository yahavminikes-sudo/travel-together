import { Router } from "express";
import { createSearchController } from "../controllers/searchController";

export const createSearchRouter = (
  searchController: ReturnType<typeof createSearchController>,
) => {
  const router = Router();

  router.get("/", searchController.search);

  return router;
};
