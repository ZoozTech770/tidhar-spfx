import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import ChoiceOfSystems from '../ChoiceOfSystems/choiceOfSystems';
import classes from './headerUI.module.scss';
import { SystemListItem } from '../../interfaces/ISystemListItem';
import useOnClickOutside from '../../util/useOnClickOutside';
import EditSystemsModal from './EditSystemsModal/EditSystemsModal';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SystemsService } from '../../services/SystemsService';
import useWindowSizeListener from '../../util/useWindowSizeListener';

type IHeaderProps = {
    context: WebPartContext;
}
const HeaderUI: React.FC<IHeaderProps> = ({ context }: IHeaderProps) => {

    const [openSystemPopup, setOpenSystemPopup] = useState<boolean>(false);
    const [openSystemModal, setOpenSystemModal] = useState<boolean>(false);
    const [systemList, setSystemList] = useState<SystemListItem[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const { isDesktopView } = useWindowSizeListener();

    useEffect(() => {
        getSliderSystems();
    }, []);

    useOnClickOutside(popupRef, () => {
        setTimeout(() => setOpenSystemPopup(false), 100);
    });

    useOnClickOutside(modalRef, () => {
        setOpenSystemModal(false);
    });

    const getSliderSystems = () => {
        SystemsService.getSystemsToSlider(context).then(data => {
            setSystemList(data);
        });
    }

    const onSystemBtnClick = () => {
        setOpenSystemPopup(!openSystemPopup)
    }

    const closeSystemPopup = () => {
        setOpenSystemPopup(false);
    }

    const closeSystemModal = () => {
        setOpenSystemModal(false);
    }

    const onAllSystemButtonClick = () => {
        closeSystemPopup();
        setOpenSystemModal(true);
    }

    const onSystemsSave = () => {
        getSliderSystems();
        closeSystemModal();
    }

    return (<div className={classes.header}>
        <button className={classes.btnSystems} onClick={onSystemBtnClick} ref={btnRef}>המערכות שלי</button>
        <button className={classes.btnSystemsMobile} onClick={onSystemBtnClick} ref={btnRef}></button>
        {openSystemPopup && <ChoiceOfSystems systemList={systemList} closeSystemModal={closeSystemPopup} systemPopupRef={popupRef} onAllSystemButtonClick={onAllSystemButtonClick}></ChoiceOfSystems>}
        {openSystemModal && <EditSystemsModal closeSystemModal={closeSystemModal} onSave={onSystemsSave} context={context} systemModalRef={modalRef} />}
    </div>);

}

export default HeaderUI;


