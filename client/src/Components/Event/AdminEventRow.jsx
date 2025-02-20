import { useNavigate } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { formatDateExact, formatCount } from '../../Utils';
import { eventService } from '../../Services';
import { Button } from '..';
import toast from 'react-hot-toast';

export default function AdminEventRow({ event, reference, setEvents }) {
    const {
        event_id,
        event_title,
        event_image,
        event_visibility,
        event_createdAt,
        totalLikes,
        totalDislikes,
        category_name,
        totalViews,
        totalComments,
    } = event;

    const navigate = useNavigate();

    async function toggleEventVisibility() {
        try {
            const res = await eventService.toggleEventVisibility(event_id);
            if (
                res &&
                res.message === 'event visibility toggled successfully'
            ) {
                setEvents((prev) =>
                    prev.map((event) => {
                        if (event.event_id === event_id) {
                            return {
                                ...event,
                                event_visibility: !event.event_visibility,
                            };
                        } else return event;
                    })
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function deleteEvent() {
        try {
            const res = await eventService.deleteEvent(event_id);
            if (res && res.message === 'event deleted successfully') {
                toast.success('Event deleted successfully');
                setEvents((prev) =>
                    prev.filter((event) => event.event_id !== event_id)
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return (
        <tr
            ref={reference}
            className="bg-[#f9f9f9] border-b-[0.01rem] border-b-[#c1c1c1]"
        >
            <td className="">
                <div className="flex items-center justify-center">
                    <label
                        htmlFor={event_id}
                        className="relative inline-block w-12 cursor-pointer overflow-hidden"
                    >
                        <input
                            type="checkbox"
                            id={event_id}
                            className="peer sr-only"
                            checked={event_visibility}
                            onChange={toggleEventVisibility}
                        />

                        {icons.toggle}
                    </label>
                </div>
            </td>

            <td className="text-center px-8">
                <div className="w-[130px] flex items-center justify-center">
                    {event_visibility ? (
                        <div className="border-[0.1rem] border-[#008300] text-lg rounded-full px-3 text-[#008300]">
                            Published
                        </div>
                    ) : (
                        <div className="border-[0.1rem] border-[#ba0000] text-lg rounded-full px-3 text-[#ba0000]">
                            Unpublished
                        </div>
                    )}
                </div>
            </td>

            <td className="py-[13px]">
                <div
                    onClick={() => navigate(`/event/${event_id}`)}
                    className="flex items-center justify-start w-full cursor-pointer"
                >
                    <div className="size-[45px] rounded-full overflow-hidden">
                        <img
                            src={event_image}
                            alt={event_title}
                            className="size-full object-cover"
                        />
                    </div>
                    <div className="text-[1.1rem] font-medium ml-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[250px]">
                        {event_title}
                    </div>
                </div>
            </td>

            <td className=" text-center text-[1.1rem]">{category_name}</td>
            <td className=" text-center text-[1.1rem]">
                {formatDateExact(event_createdAt)}
            </td>
            <td className=" text-center text-[1.1rem] ">
                {formatCount(totalViews)}
            </td>
            <td className=" text-center text-[1.1rem]">
                {formatCount(totalComments)}
            </td>

            <td className="">
                <div className="flex items-center justify-center">
                    <div className="drop-shadow-md rounded-md bg-[#d9fed9] px-2 py-[2px] text-[#196619] text-[1.1rem]">
                        {formatCount(totalLikes)} likes
                    </div>
                    <div className="drop-shadow-md rounded-md bg-[#ffd8d8] px-2 py-[2px] ml-4 text-[#ba2828] text-[1.1rem]">
                        {formatCount(totalDislikes)} dislikes
                    </div>
                </div>
            </td>

            <td className="">
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={deleteEvent}
                        title="Delete"
                        className="bg-[#ffffff] group p-2 rounded-full drop-shadow-md w-fit"
                        btnText={
                            <div className="size-[20px] fill-black group-hover:fill-[#d42828]">
                                {icons.delete}
                            </div>
                        }
                    />
                    <Button
                        title="Edit"
                        onClick={() => navigate(`/update/${event_id}`)}
                        className="bg-[#ffffff] p-2 group rounded-full drop-shadow-md w-fit"
                        btnText={
                            <div className="size-[20px] fill-black group-hover:fill-[#2256db]">
                                {icons.edit}
                            </div>
                        }
                    />
                </div>
            </td>
        </tr>
    );
}
