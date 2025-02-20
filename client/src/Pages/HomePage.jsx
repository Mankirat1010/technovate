import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventListView } from '../Components';
import { eventService } from '../Services';
import { paginate } from '../Utils';
import { icons } from '../Assets/icons';
import { LIMIT } from '../Constants/constants';
import { useSearchContext } from '../Context';

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [eventsInfo, setEventsInfo] = useState({});
    const [page, setPage] = useState(1);
    const { search } = useSearchContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(eventsInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getEvents() {
            try {
                setLoading(true);
                const res = await eventService.getRandomEvents(
                    signal,
                    page,
                    LIMIT
                );
                if (res && !res.message) {
                    setEvents((prev) => [...prev, ...res.events]);
                    setEventsInfo(res.eventsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [page]);

    const eventElements = events
        ?.filter((event) => {
            const title = event.event_title.toLowerCase();
            if (search && title.includes(search.toLowerCase())) return event;
            if (!search) return event;
        })
        .map((event, index) => (
            <EventListView
                key={event.event_id}
                event={event}
                reference={
                    index + 1 === events.length && eventsInfo?.hasNextPage
                        ? paginateRef
                        : null
                }
            />
        ));

    return (
        <div>
            {eventElements.length > 0 && <div>{eventElements}</div>}

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
                eventElements.length === 0 && <div>No events found !!</div>
            )}
        </div>
    );
}
