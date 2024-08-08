import { useEffect, useRef, useState } from 'react';
import { ISystemsProps } from './ISystemsProps';
import { SystemListItem } from '../../../interfaces/ISystemListItem';
import useOnClickOutside from '../../../util/useOnClickOutside';
import { SystemsService } from '../../../services/SystemsService';
import ChoiceOfSystems from '../../../components/ChoiceOfSystems/choiceOfSystems';
import EditSystemsModal from '../../../components/HeaderUI/EditSystemsModal/EditSystemsModal';
import * as React from 'react';
import SystemsUI from '../../../components/Systems/Systems';

const Systems = (props: ISystemsProps): React.ReactElement<ISystemsProps> => {
  const {
    context
  } = props;

  const [openSystemPopup, setOpenSystemPopup] = useState<boolean>(false);
  const [openSystemModal, setOpenSystemModal] = useState<boolean>(false);
  const [systemList, setSystemList] = useState<SystemListItem[]>([]);

  const popupRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSliderSystems = () => {
      SystemsService.getSystemsToSlider(context).then(data => {
        setSystemList(data);
      });
    };
    getSliderSystems();
  }, [context]);

  useOnClickOutside(popupRef, () => {
    setTimeout(() => setOpenSystemPopup(false), 100);
  });

  useOnClickOutside(modalRef, () => {
    setOpenSystemModal(false);
  });

  const closeSystemPopup = () => {
    setOpenSystemPopup(false);
  };

  const closeSystemModal = () => {
    setOpenSystemModal(false);
  };

  const onAllSystemButtonClick = () => {
    closeSystemPopup();
    setOpenSystemModal(true);
  };

  const onSystemsSave = () => {
    const getSliderSystems = () => {
      SystemsService.getSystemsToSlider(context).then(data => {
        setSystemList(data);
      });
    };
    getSliderSystems();
    closeSystemModal();
  };

  return (
    <section>
      <SystemsUI
        systemList={systemList}
        closeSystemModal={closeSystemPopup}
        systemPopupRef={popupRef}
        onAllSystemButtonClick={onAllSystemButtonClick}
        unfloat={true}
      />
      {openSystemModal && (
        <EditSystemsModal
          closeSystemModal={closeSystemModal}
          onSave={onSystemsSave}
          context={context}
          systemModalRef={modalRef}
        />
      )}
    </section>
  );
};

export default Systems;
