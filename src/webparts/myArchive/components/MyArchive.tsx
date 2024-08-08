import * as React from 'react';
import { IMyArchiveProps } from './IMyArchiveProps';
import { MyInquiriesService } from "../../../services/MyInquiriesService";
import { useState, useEffect } from 'react';
import { IArchiveInquiriesItem } from '../../../interfaces/IInquiriesItem';

import MyArchiveUI from '../../../components/MyArchiveUI/MyArchiveUI';

const MyArchive: React.FC<IMyArchiveProps> = (props) => {
  const {
    title,
    list,
    context
  } = props;
  const [myArchiveItems, setMyArchiveItems] = useState<IArchiveInquiriesItem[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let res = [];
      setisLoading(true);
      const inquiriesItems = await MyInquiriesService.getMyInquiriesItems(context, list, true);
      res = inquiriesItems;
      setMyArchiveItems(res);
      setisLoading(false);
    })();
  }, []);
  if (!isLoading) {
    return (
      <MyArchiveUI title={title} archiveItems={myArchiveItems} />
    );
  }
  return null;
}
export default MyArchive;

