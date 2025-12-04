import * as React from 'react';
import { useState, useEffect } from 'react';
import MyInquiriesUI from '../../../components/myInquiriesUI/myInquiriesUI';
import { IFormItem } from '../../../interfaces/IformItem';
import { IInquiriesItem } from '../../../interfaces/IInquiriesItem';
import { LinkType } from '../../../interfaces/Types';
import { MyInquiriesService } from '../../../services/MyInquiriesService';
import { IMyInquiriesPanelProps } from './IMyInquiriesPanelProps';

const MyInquiriesPanel: React.FC<IMyInquiriesPanelProps> = (props) => {
  const {
    context,
    title,
    list,
    newInqTitle,
    newInqLinkUrl,
    newInqLinkNewTab,
    toAllLinkTitle,
    toAllLinkUrl,
    toAllLinkNewTab,
    showPendingApproval,
  } = props;

  const [myInquiries, setMyInquiries] = useState<IInquiriesItem[]>([]);
  const [allFormList, setAllFormList] = useState<IFormItem[]>([]);

  const newForm: LinkType = { Url: newInqLinkUrl, Text: newInqTitle, OpenURLInNewTab: newInqLinkNewTab };
  const allInquiries: LinkType = { Url: toAllLinkUrl, Text: toAllLinkTitle, OpenURLInNewTab: toAllLinkNewTab };

  useEffect(() => {
    (async () => {
      const rawResponse = await MyInquiriesService.getMyInquiriesItems(context, list);
      setMyInquiries(rawResponse);
      const allFormsItems = await MyInquiriesService.getAllFormsItems(context, list);
      setAllFormList(allFormsItems);
    })();
  }, []);

  return (
    <MyInquiriesUI
      title={title}
      inquiries={myInquiries}
      newForm={newForm}
      allInquiries={allInquiries}
      showPendingApproval={showPendingApproval}
      allFormList={allFormList}
    />
  );
};

export default MyInquiriesPanel;
