import { Router } from "express"
import { consultProfessional,consultTarget,consultCategories, consultProfile } from "../controllers/catalogue.js";

export const CatalogueRouter = Router()

CatalogueRouter.get('/consultProfessionals',consultProfessional)
CatalogueRouter.get('/consultTarget',consultTarget)
CatalogueRouter.get('/consultCategories/:profession',consultCategories)
CatalogueRouter.get('/consultProfile/:email',consultProfile)