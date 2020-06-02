import express from 'express';
import path from 'path';
import ItemController from './controllers/ItemController';
import SpotController from './controllers/SpotController';

const routes = express.Router()

routes.use("/uploads", express.static(path.resolve(__dirname, '..', 'uploads')))

routes.use('/items', ItemController.getAllItems)
routes.use('/spots/create', SpotController.RegisterSpot)
routes.use('/spots/getById', SpotController.getSpotById)
routes.use('/spots/getByFilters', SpotController.getSpotByFilters)

routes.post("/users", (req, res) =>{
    const { email, password } = req.body;
    res.json({ email, password })
})

export default routes;