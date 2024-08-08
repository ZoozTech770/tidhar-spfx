import * as React from 'react';
import { useEffect, useState } from 'react';
import './EditSystemsModal.scss';
import { SystemListItem } from '../../../interfaces/ISystemListItem';
import { SystemsService } from '../../../services/SystemsService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

const closeIcon = require('../../../assets/icons/closeIcon.svg');

type EditSystemsModalProps = {
    onSave: Function;
    closeSystemModal: Function;
    context: WebPartContext;
    systemModalRef: React.MutableRefObject<HTMLDivElement>;
}

const EditSystemsModal = ({ onSave, closeSystemModal, context, systemModalRef }: EditSystemsModalProps) => {

    const [allSystems, setAllSystems] = useState<SystemListItem[]>([]);
    const [selectedSystems, setSelectedSystems] = useState<number[]>([]);

    useEffect(() => {

        getAllSystems().then(data => {
            setAllSystems(data);
        })
    }, []);

    useEffect(() => {
        setSelectedSystems(allSystems.filter(system => !system.IsPermanent && system.IsSelected).map(system => system.Id));
    }, [allSystems])

    const getAllSystems = async () => {
        const res = await SystemsService.getSystems(context);
        return res;
    }

    const onChceckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedSystems([...selectedSystems, id]);
            return;
        }
        setSelectedSystems(selectedSystems.filter(system => system !== id));
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        await SystemsService.updateSelectedUserSystems(context, selectedSystems)
        onSave();
    }

    return (
        <div className="edit-systems-modal dark-wrapper">
            <div className='modal-container' role="dialog" aria-labelledby="modal_title" aria-modal="true" ref={systemModalRef}>
                <div className='modal-header'>
                    <h2 id="modal_title" className="modal-title">עריכת תצוגה</h2>
                    <button className="close-button"><img src={closeIcon} alt="סגירה" onClick={() => closeSystemModal()} /></button>
                </div>
                <form className='modal-body' onSubmit={event => onSubmit(event)}>
                    <div className="modal-body-title">יש לסמן מערכות לתצוגה מועדפת עבורך</div>
                    <div className='modal-systems-containers'>
                        {allSystems.map(system => (
                            <div key={system.Id} className='system'>
                                <input id={system.Id.toString()} onChange={event => onChceckboxChange(event, system.Id)} type="checkbox" className='checkbox-input' defaultChecked={system.IsSelected || system.IsPermanent} disabled={system.IsPermanent} />
                                <label htmlFor={system.Id.toString()} className="system-label">
                                    <img src={system.Icon.UrlLaptop} alt="" className='system-icon' />
                                    <span>
                                        {system.Title}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className='modal-footer'>
                        <button type="button" className='modal-button secondary-button' onClick={() => closeSystemModal()}>ביטול</button>
                        <button type="submit" className='modal-button primary-button'>שמור</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default EditSystemsModal