import { Service, Container } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CONSTANT } from "../../constant";
import { Exception } from "../../exception";
import { Albums } from '../../models/Albums';
import { IAlbum } from '../../models/Albums'
import { User } from '../../models/User'

@Service()
export default class AlbumServices {
    constructor(
        @InjectRepository(Albums) private readonly repository: Repository<Albums>
    ) { }
    public async albumName(reqData: IAlbum, user: User) {
        try {
            let admin = await this.repository.find({
                where: {
                    role: reqData.role
                }
            })
            if (!admin) {
                throw new Exception(CONSTANT.ADMIN_ADD_ALBUMNAME, 404);
            }
            let album = new Albums();
            album.albumsName = reqData.albumsName;
            user = user
            await this.repository.save(user);
            return
        } catch (error) {
            console.log(error);
            throw Error;
        }
    }
}