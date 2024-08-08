import * as React from 'react';
import { useState, useEffect } from 'react';
import { IAllMyInquiriesProps } from './IAllMyInquiriesProps';
import { MyInquiriesService } from "../../../services/MyInquiriesService";
import { IInquiriesItem } from '../../../interfaces/IInquiriesItem';
import AllMyInquiriesUI from '../../../components/AllMyInquiries/AllMyInquiriesUI';
const AllMyInquiries: React.FC<IAllMyInquiriesProps> = (props) => {
  const {
    list,
    title,
    context
  } = props;

  const [inquiries, setInquiries] = useState<IInquiriesItem[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(true);

  useEffect(() => {
    setisLoading(true)
    MyInquiriesService.getMyInquiriesItems(context, list).then(response => {
      setInquiries(response);
      setisLoading(false);
    });

  }, []);
  if (!isLoading) {
    return (
      <AllMyInquiriesUI inquiries={inquiries} title={title} />
    );
  }
  return null;
}
export default AllMyInquiries;
