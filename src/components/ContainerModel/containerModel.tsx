import * as React from 'react';
import Modal from 'react-modal';
import classes from './containerModel.module.scss';
import { ReactChild } from 'react';
import './react-modal.scss';

type ContainerModelProps = {
    isOpen: boolean,
    onClose: Function,
    childern: ReactChild | null,
    title?:string;
    panelViewOnMobile?: boolean,
    topViewOnMobile?: boolean,
    hideCloseButton?: boolean,
};
const ContainerModel: React.FC<ContainerModelProps> = ({ isOpen, onClose, childern, panelViewOnMobile, topViewOnMobile, hideCloseButton ,title}) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={() => onClose()} shouldCloseOnOverlayClick={true} className={`${classes.containerModel} ${panelViewOnMobile ? 'panel' : ''} ${topViewOnMobile ? 'top' : ''}`}>
            <div className={classes.header}>
                <span>{title}</span>
                {!hideCloseButton && <button id="closeBtn" className={classes.close} onClick={() => onClose()} aria-label='סגירה' />}
            </div>
            
            {childern}
        </Modal>
    );
};

export default ContainerModel;