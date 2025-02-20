import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../../Services';
import { paginate } from '../../Utils';
import { icons } from '../../Assets/icons';
import { LIMIT } from '../../Constants/constants';
import { EventCardView } from '..';

export default function Recemendations({ category }) {
    const { eventId } = useParams();
    const [events, setEvents] = useState([]);
    const [eventsInfo, setEventsInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getEvents() {
            try {
                setLoading(true);
                const res = await eventService.getRandomEvents(
                    signal,
                    page,
                    LIMIT,
                    category
                );
                if (res && !res.message) {
                    const recemendations = res.events.filter(
                        (event) => event.event_id !== eventId
                    );
                    setEvents((prev) => [...prev, ...recemendations]);
                    setEventsInfo(res.eventsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [category, page]);

    // pagination
    const paginateRef = paginate(eventsInfo?.hasNextPage, loading, setPage);

    const eventElements = events?.map((event, index) => (
        <EventCardView
            key={event.event_id}
            event={event}
            reference={
                index + 1 === events.length && eventsInfo?.hasNextPage
                    ? paginateRef
                    : null
            }
            showOwnerInfo={true}
        />
    ));

    return (
        <div className="w-full h-full">
            {eventElements.length > 0 && (
                <div className="w-full overflow-x-auto grid grid-flow-col auto-cols-[minmax(350px,350px)] gap-6">
                    {eventElements}
                </div>
            )}

            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">
                        loading first batch...
                    </div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                            {icons.loading}
                        </div>
                    </div>
                )
            ) : (
                eventElements.length === 0 && (
                    <div className="text-lg text-[#363636]">
                        No Similar Events Found !!
                    </div>
                )
            )}
        </div>
    );
}
