import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import './Range.scss';
import { IGalleries } from '../../../interfaces/IGallery';
import useDateFormatter from '../../../util/useDateFormatter';


type RangeProps = {
    rangeIndex: number;
    colors?: string[];
    onRangeChange: Function;
    gallery: IGalleries[];
    labels: string[];
}

const Range = ({ gallery, colors = [], onRangeChange, rangeIndex, labels }: RangeProps) => {

    const [snaps, setSnaps] = useState<number[]>([]);
    const [sliderIndex, setSliderIndex] = useState<number>(0);
    const [rangeValue, setRangeValue] = useState<number>(0);

    const rangeContainerRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (snaps.length > 0) {
            setRangeValue(snaps[rangeIndex])
        }
    }, [rangeIndex, snaps])

    useEffect(() => {
        const tempSnaps = []
        if (!gallery) {
            return;
        }
        gallery.map(galleryItem => {
            galleryItem.events.map((event, i) => {
                if (galleryItem.events.length === 1) {
                    tempSnaps.push((galleryItem.month + 0.38 + 0.022 * galleryItem.month).toFixed(3));
                }
                if (galleryItem.events.length === 2) {
                    switch (i) {
                        case 0:
                            tempSnaps.push((galleryItem.month + 0.31 + 0.023 * galleryItem.month).toFixed(3));
                            break;
                        case 1:
                            tempSnaps.push((galleryItem.month + 0.44 + 0.023 * galleryItem.month).toFixed(3));
                            break;
                        default:
                            break;
                    }
                }
                if (galleryItem.events.length === 3) {
                    switch (i) {
                        case 0:
                            tempSnaps.push((galleryItem.month + 0.24 + 0.022 * galleryItem.month).toFixed(3));
                            break;
                        case 1:
                            tempSnaps.push((galleryItem.month + 0.38 + 0.022 * galleryItem.month).toFixed(3));
                            break;
                        case 2:
                            tempSnaps.push((galleryItem.month + 0.50 + 0.022 * galleryItem.month).toFixed(3));

                            break;
                        default:
                            break;
                    }
                }
            })
        });
        setSnaps(tempSnaps);
    }, [gallery])

    useEffect(() => {
        if (snaps.length > 0) {
            const index = snaps.findIndex(snap => snap == sliderIndex);
            if (index > -1)
                onRangeChange(index);
        }
    }, [sliderIndex])

    useEffect(() => {
        if (!rangeContainerRef.current) {
            return;
        }
        const rangeContainerWidth = rangeContainerRef.current.clientWidth;
        const firstMonthOfSnaps = Math.round(snaps[0])
        rangeContainerRef.current.scrollLeft -= (rangeContainerWidth - (rangeContainerWidth / 12 * firstMonthOfSnaps));
    }, [rangeContainerRef.current])



    const onRangeUp = (event) => {
        const closest = findClosest(event.target.value, snaps);
        event.target.value = closest;
        setRangeValue(event.target.value);
        setSliderIndex(event.target.value);
    }

    const findClosest = (number, array) => {
        const closest = array.reduce(function (prev, curr) {
            return (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev);
        });

        return closest;
    }

    const onRangeKeyDown = (event) => {
        const target = event.target
        const currValue = target.value;
        const currIndex = snaps.findIndex(snap => snap.toString() === currValue);

        if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
            event.preventDefault();
            if (currIndex === snaps.length - 1) {
                return;
            }
            target.value = snaps[currIndex + 1];
        }
        if (event.code === "ArrowRight" || event.code === "ArrowDown") {
            event.preventDefault();
            if (currIndex === 0) {
                return;
            }
            target.value = snaps[currIndex - 1];
        }

        setRangeValue(target.value);
        setSliderIndex(target.value);
    }

    const onRangeInput = (event) => {
        const value = Number.parseFloat(Number.parseFloat(event.target.value).toFixed(2));
        const closest = findClosest(value, snaps);
        if (event.target.value - rangeValue > 0 && value + 0.02 - closest >= 0) {
            setSliderIndex(closest);
        }
        if (event.target.value - rangeValue < 0 && value - 0.02 - closest <= 0) {
            setSliderIndex(closest);
        }
        setRangeValue(event.target.value);
    }

    const onMonthClick = (month) => {
        const snap = snaps.find(snap => Math.floor(snap) === (month - 1));
        if (snap) {
            setRangeValue(snap);
            setSliderIndex(snap);
        }
    }

    if (snaps.length > 0)
        return (
            <div className="range-container" ref={rangeContainerRef}>
                <input type="range" className="slider-range" min={0} max={12} step="any" value={rangeValue} onTouchEnd={event => onRangeUp(event)} onMouseUp={event => onRangeUp(event)} onKeyDown={event => onRangeKeyDown(event)} onInput={event => onRangeInput(event)} />

                <div className="wrapper">
                    <div className='events-wrapper'>
                        {gallery.map(galleryItem => {
                            return (
                                <div className="events" key={galleryItem.month}>
                                    {galleryItem.events.map((event, i) => {
                                        const color = colors[galleryItem.month]
                                        return <div key={i} style={{ backgroundColor: color ?? "#000000" }} className='dot'></div>
                                    })}
                                </div>)
                        })}
                    </div>
                    <div className="labels">
                        {labels.map((label, i) => (
                            <button key={i} className="label" onClick={() => onMonthClick(i + 1)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )

    return null;
}
export default Range