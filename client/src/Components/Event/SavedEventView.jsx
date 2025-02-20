import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../Services';
import { Button, EventListView } from '..';
import { icons } from '../../Assets/icons';

export default function SavedEventView({ savedEvent, reference }) {
    const { event_id } = savedEvent;
    const [isSaved, setIsSaved] = useState(true);
    const navigate = useNavigate();

    async function toggleSave() {
        try {
            const res = await eventService.toggleSaveEvent(event_id);
            if (res && res.message === 'event save toggled successfully') {
                setIsSaved((prev) => !prev);
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    const { event, ...rest } = savedEvent;
    const modifiedEvent = { ...rest, ...event };

    return (
        <EventListView event={modifiedEvent} reference={reference}>
            {/* children */}
            <div
                className="absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    btnText={
                        isSaved ? (
                            <div className="size-[20px] group-hover:fill-red-700">
                                {icons.delete}
                            </div>
                        ) : (
                            <div className="size-[20px] group-hover:fill-[#4977ec]">
                                {icons.undo}
                            </div>
                        )
                    }
                    className="bg-[#f0efef] p-3 group rounded-full drop-shadow-lg hover:bg-[#ebeaea]"
                    onClick={toggleSave}
                />
            </div>
        </EventListView>
    );
}
