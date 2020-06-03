import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemController {
    public async getAllItems (req: Request, res: Response): Promise<Response> {
        const items = await knex('items').select('*');
        const serializedItems = items.map(items => {
            return {
                id: items.id,
                title: items.title,
                imageUrl: `http://localhost:3333/uploads/${items.image}`
            }
        })
        return res.json(serializedItems)
    }
}

export default new ItemController()