import { NextFunction, Request, Response, Router } from 'express'
import middleware from '../../middleware'
import { celebrate, Joi } from 'celebrate'
import AlbumServices from '../../services/albums'
import { IAlbum } from '../../../models/Albums'
import config from '../../../config';
import { CONSTANT } from '../../../constant';
import Container from 'typedi';

const route = Router();


export default (app: Router) => {
    app.use('/album', route);

    route.post(
        '/add-albumName',
        middleware.isAuth,
        middleware.attachCurrentUser,
        celebrate({
            body: Joi.object({
                albumsName: Joi.string().required(),
                role: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userObj = req.currentUser;
                const payload = req.body as IAlbum;
                const albumServicesInstance = Container.get(AlbumServices);
                const data = await albumServicesInstance.albumName(payload, userObj);
                return res.json({ data, message: `Add ${CONSTANT.ADD}` }).status(200);
            } catch (error) {
                console.log(error);
                return next(error);
            }
        }
    )
}

