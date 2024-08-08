export interface IGalleries {
  month: number;
  events: IGallery[];
}

export interface IGalleriesByYears {
  year: number;
  months: IGalleries[]
}

export interface IGallery {
  title: string,
  bigCubePicture: string,
  bigRectanglePicture: string,
  smallCubePicture: string,
  smallRectanglePicture: string,
  date: Date,
  albumUrl: string
}
export interface IRawGallery {
  Id: number;
  Title: string;
  eldAlbumUrl: IHyperLink;
  eldAlbumPictureBigCube: IHyperLink;
  eldAlbumPictureBigRectangle: IHyperLink;
  eldAlbumPictureLittleCube: IHyperLink;
  eldAlbumPictureLittleRectangle: IHyperLink;
  eldDate: Date;
  eldDisplayOnHomePage: boolean;
}

interface IHyperLink {
  Description: string;
  Url: string;
}
