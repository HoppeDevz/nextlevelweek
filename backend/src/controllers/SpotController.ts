import { Request, Response } from 'express';
import knex from '../database/connection';
import { stringify } from 'querystring';

class SpotController {
    public async RegisterSpot (req: Request, res: Response) : Promise<Response> {
        const { image, name, email, whatsapp, latitude, longitude, city, uf, items } = req.body
        const ids = await knex('points').insert([
            { image, name, email, whatsapp, latitude, longitude, city, uf }
        ])

        // não mexer nesse erro =)
        const pointItems = items.map((itemId:number)=>{
            return {
                item_id: itemId,
                point_id: ids[0]
            }
        })

        await knex('point_items').insert(pointItems)
        return res.json({ sucess: true })
    }

    public async getSpotByFilters (req: Request, res: Response): Promise<Response> {
        const { city, uf, items } = req.query;
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
          .join('point_items', 'points.id', '=', 'point_items.point_id')
          .whereIn('point_items.item_id', parsedItems)
          .where('city', String(city))
          .where('uf', String(uf))

        return res.json(points)
    }

    public async getSpotById (req:Request, res:Response): Promise<Response> {
        const { id } = req.body
        const result = await knex('points').select('*').where('id', id).first()

        const itemsSpecify = await knex('point_items').select('*').where('point_id', id)

        const items = await knex('items').select('*')

        const data = []
        for (let k = 0; k <= itemsSpecify.length; k++) {
            if (itemsSpecify[k]) {
                for (let j = 0; j <= items.length; j++) {
                    if (items[j]) {
                        if (itemsSpecify[k].item_id == items[j].id) {
                            data.push(items[j])
                        }
                    }
                }
            }
        }

        if (!result) {
            return res.status(400).json({ error: true, reason: "Point not found" })
        } else {
            return res.status(200).json({ result, items: data })
        }
    }
}

export default new SpotController()