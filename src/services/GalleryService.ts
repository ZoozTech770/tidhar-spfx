import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { IGalleries, IGalleriesByYears, IRawGallery } from "../interfaces/IGallery";


export default class galleryService {

  public async getGallery(context: ISPFXContext, listUrl: string): Promise<IGalleriesByYears[]> {
    const sp = spfi().using(SPFx(context));
    const items: IRawGallery[] = await sp.web.getList(listUrl).items
      .filter("eldDisplayOnHomePage eq 1")
      .orderBy("eldDate", false)();
    let galleries = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: []
    };

    let galleriesByYears = {}
    await Promise.all(items.map(async (gallery) => {
      const item: IItem = await sp.web.getList(listUrl).items.getById(gallery.Id);
      const info: IAttachmentInfo[] = await item.attachmentFiles();
      const hasPictures = gallery.eldAlbumPictureBigCube?.Url || gallery.eldAlbumPictureBigRectangle?.Url || gallery.eldAlbumPictureLittleCube?.Url || gallery.eldAlbumPictureLittleRectangle?.Url
      const formattedGallery = {
        Id: gallery.Id,
        title: gallery.Title,
        smallRectanglePicture: hasPictures ? gallery.eldAlbumPictureLittleRectangle.Url : info[0]?.ServerRelativeUrl,
        smallCubePicture: hasPictures ? gallery.eldAlbumPictureLittleCube.Url : info[1]?.ServerRelativeUrl,
        bigCubePicture: hasPictures ? gallery.eldAlbumPictureBigCube.Url : info[2]?.ServerRelativeUrl,
        bigRectanglePicture: hasPictures ? gallery.eldAlbumPictureBigRectangle.Url : info[3]?.ServerRelativeUrl,
        date: new Date(gallery.eldDate),
        albumUrl: gallery.eldAlbumUrl.Url
      }
      const galleryYear = formattedGallery.date.getFullYear();
      const galleryMonth = formattedGallery.date.getMonth();
      if (!galleriesByYears[galleryYear]) {
        galleriesByYears[galleryYear] = { ...galleries };
      }
      galleriesByYears[galleryYear][galleryMonth] = [...galleriesByYears[galleryYear][galleryMonth], formattedGallery];
      return gallery;
    }));

    return Object.keys(galleriesByYears).map(year => {
      return {
        year: Number.parseInt(year),
        months: Object.keys(galleriesByYears[year]).map(month => ({
          month: Number.parseInt(month),
          events: galleriesByYears[year][month].sort((event1, event2) => event1.date.getDate() - event2.date.getDate()).slice(0, 3)
        }))
      }
    }).reverse();
  }
}
export const GalleryService = new galleryService()
