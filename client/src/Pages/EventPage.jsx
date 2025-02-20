import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    requestService,
    followerService,
    likeService,
    eventService,
} from '../Services';
import { Button, Comments, Recommendations } from '../Components';
import { formatDateRelative, formatCount } from '../Utils';
import { useUserContext, usePopupContext } from '../Context';
import { icons } from '../Assets/icons';
import parse from 'html-react-parser';
import toast from 'react-hot-toast';

export default function EventPage() {
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const { setPopupInfo, setShowPopup } = usePopupContext();
    const [event, setEvent] = useState({});
    const [requestStatus, setRequestStatus] = useState('');
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getEvent() {
            try {
                setLoading(true);
                const res = await eventService.getEvent(signal, eventId);
                if (res && !res.message) {
                    setEvent(res);
                    if (user) {
                        const request = await requestService.getRequest(
                            res.owner.user_id,
                            signal
                        );
                        if (request && !request.message) {
                            setRequestStatus(request.status);
                        }
                    }
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [eventId, user]);

    async function toggleLike() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Like' });
                return;
            }
            const res = await likeService.toggleEventLike(eventId, true);
            if (res && res.message === 'event like toggled successfully') {
                setEvent((prev) => {
                    if (prev.isLiked) {
                        return {
                            ...prev,
                            totalLikes: prev.totalLikes - 1,
                            isLiked: false,
                        };
                    } else {
                        return {
                            ...prev,
                            totalLikes: prev.totalLikes + 1,
                            totalDislikes: prev.isDisliked
                                ? prev.totalDislikes - 1
                                : prev.totalDislikes,
                            isLiked: true,
                            isDisliked: false,
                        };
                    }
                });
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function toggleDislike() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Dislike' });
                return;
            }
            const res = await likeService.toggleEventLike(eventId, false);
            if (res && res.message === 'event like toggled successfully') {
                setEvent((prev) => {
                    if (prev.isDisliked) {
                        return {
                            ...prev,
                            totalDislikes: prev.totalDislikes - 1,
                            isDisliked: false,
                        };
                    } else {
                        return {
                            ...prev,
                            totalDislikes: prev.totalDislikes + 1,
                            totalLikes: prev.isLiked
                                ? prev.totalLikes - 1
                                : prev.totalLikes,
                            isDisliked: true,
                            isLiked: false,
                        };
                    }
                });
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function toggleFollow() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Follow' });
                return;
            }
            const res = await followerService.toggleFollow(event.owner.user_id);
            if (res && res.message === 'follow toggled successfully') {
                setEvent((prev) => ({
                    ...prev,
                    isFollowed: !prev.isFollowed,
                }));
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function toggleSave() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Save' });
                return;
            }
            console.log(eventId);
            const res = await eventService.toggleSaveEvent(eventId);
            console.log(eventId);
            if (res && res.message === 'event save toggled successfully') {
                toast.success(
                    `${
                        event.isSaved
                            ? 'event Unsaved Successfully 🙂'
                            : 'event Saved Successfully 🤗'
                    }`
                );
                setEvent((prev) => ({ ...prev, isSaved: !prev.isSaved }));
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function handleCollab() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Collab' });
                return;
            }
            if (!requestStatus || requestStatus === 'rejected') {
                const res = await requestService.sendRequest(
                    event.owner.user_id
                );
                if (res && !res.message) {
                    setRequestStatus('pending');
                    toast.success('Collab Request Sent Successfully 🤝');
                }
            } else if (requestStatus === 'accepted') {
                navigate(`/chat/${event.owner.user_id}`);
            } else {
                toast.error('Collab Request Already Sent');
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return loading ? (
        <div>loading...</div>
    ) : Object.keys(event).length === 0 ? (
        <div>event Not Found !!</div>
    ) : (
        <div className="relative w-full h-full flex flex-col items-start justify-start gap-y-6 overflow-y-scroll">
            <div className="w-full px-2">
                <div className="w-full flex items-start justify-start flex-col xl:flex-row gap-6">
                    {/* event */}
                    <div className="w-full xl:w-[75%] h-full">
                        {/* event image */}
                        <div className="relative h-[300px] md:h-[350px] rounded-xl overflow-hidden">
                            <img
                                src={event.event_image}
                                alt="event image"
                                className="object-cover w-full h-full"
                            />

                            {/* SMALL SCREEN */}
                            {/* event category */}
                            <div className="xl:hidden absolute top-2 left-2 hover:cursor-text flex items-center justify-center gap-2 bg-[#ffffff] drop-shadow-md rounded-full w-fit px-4 py-[4px]">
                                <div className="size-[10px] fill-[#2556d1]">
                                    {icons.dot}
                                </div>
                                <span className="text-[#2556d1] text-[16px]">
                                    {event.category.category_name.toUpperCase()}
                                </span>
                            </div>

                            {/* saved btn */}
                            <div className="xl:hidden absolute top-2 right-2 flex items-center justify-center">
                                <Button
                                    btnText={
                                        <div
                                            className={`${
                                                event.isSaved
                                                    ? 'fill-[#4977ec] '
                                                    : 'fill-white'
                                            } size-[20px] stroke-[#4977ec] group-hover:stroke-[#2a4b9f]`}
                                        >
                                            {icons.save}
                                        </div>
                                    }
                                    onClick={toggleSave}
                                    className="bg-[#f0efef] p-3 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                                />
                            </div>
                        </div>

                        {/* event title */}
                        <div className="hover:cursor-text text-2xl font-medium text-black mt-4">
                            {event.event_title}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                            {/* statistics */}
                            <div className="hover:cursor-text text-[15px] text-[#5a5a5a]">
                                {formatCount(event.totalViews)} views &bull; ed
                                {' ' +
                                    formatDateRelative(event.event_createdAt)}
                            </div>

                            {/* like/dislike btn */}
                            <div className="bg-[#f0efef] rounded-full overflow-hidden drop-shadow-md hover:bg-[#ebeaea]">
                                <Button
                                    btnText={
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className={`${
                                                    event.isLiked
                                                        ? 'fill-[#4977ec] stroke-[#4977ec]'
                                                        : 'fill-none stroke-black'
                                                } size-[20px]`}
                                            >
                                                {icons.like}
                                            </div>
                                            <div className="text-black">
                                                {formatCount(event.totalLikes)}
                                            </div>
                                        </div>
                                    }
                                    onClick={toggleLike}
                                    className="bg-[#f0efef] py-[7px] px-3 hover:bg-[#ebeaea] border-r-[0.1rem] border-[#e6e6e6]"
                                />
                                <Button
                                    btnText={
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className={`${
                                                    event.isDisliked
                                                        ? 'fill-[#4977ec] stroke-[#4977ec]'
                                                        : 'fill-none stroke-black'
                                                } size-[20px]`}
                                            >
                                                {icons.dislike}
                                            </div>
                                            <div className="text-black">
                                                {formatCount(
                                                    event.totalDislikes
                                                )}
                                            </div>
                                        </div>
                                    }
                                    onClick={toggleDislike}
                                    className="bg-[#f0efef] py-[7px] px-3 hover:bg-[#ebeaea]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="drop-shadow-md bg-[#f9f9f9] p-4 rounded-xl w-full xl:w-[25%] flex flex-col xl:pl-8 xl:pr-1 xl:mt-0 mt-4">
                        {/* BIGGER SCREEN */}
                        <div className="hidden xl:flex items-center justify-between pr-4 w-full">
                            {/* event category */}
                            <div className="hover:cursor-text flex items-center justify-center gap-2 bg-[#ffffff] drop-shadow-md rounded-full w-fit px-4 py-[4px]">
                                <div className="size-[10px] fill-[#2556d1]">
                                    {icons.dot}
                                </div>
                                <span className="text-[#2556d1] text-[16px]">
                                    {event.category.category_name.toUpperCase()}
                                </span>
                            </div>

                            {/* saved btn */}
                            <div className="flex items-center justify-center">
                                <Button
                                    btnText={
                                        <div
                                            className={`${
                                                event.isSaved
                                                    ? 'fill-[#4977ec] '
                                                    : 'fill-white'
                                            } size-[20px] stroke-[#4977ec] group-hover:stroke-[#2a4b9f]`}
                                        >
                                            {icons.save}
                                        </div>
                                    }
                                    onClick={toggleSave}
                                    className="bg-[#f0efef] p-3 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                                />
                            </div>
                        </div>

                        {/* owner info: FOR BOTH SMALLER & BIGGER SCREENS */}
                        <div className="w-full flex xl:flex-col items-center justify-between gap-4 xl:mt-10">
                            <div className="flex gap-4 xl:flex-col items-center justify-start w-full">
                                {/* avatar */}
                                <div
                                    onClick={(e) => {
                                        navigate(
                                            `/channel/${event.owner.user_id}`
                                        );
                                    }}
                                    className="w-fit cursor-pointer"
                                >
                                    <div className="size-[60px] xl:size-[160px]">
                                        <img
                                            alt="event owner avatar"
                                            src={event.owner.user_avatar}
                                            className="size-full object-cover rounded-full hover:brightness-90"
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex flex-col items-start xl:items-center justify-start">
                                    <div
                                        onClick={(e) => {
                                            navigate(
                                                `/channel/${event.owner.user_id}`
                                            );
                                        }}
                                        className="w-fit cursor-pointer text-ellipsis line-clamp-1 text-lg xl:text-[21px] hover:text-[#5c5c5c] font-medium text-black"
                                    >
                                        {event.owner.user_firstName}{' '}
                                        {event.owner.user_lastName}
                                    </div>

                                    <div
                                        onClick={(e) => {
                                            navigate(
                                                `/channel/${event.owner.user_id}`
                                            );
                                        }}
                                        className="w-fit cursor-pointer text-black hover:text-[#5c5c5c] text-lg"
                                    >
                                        @{event.owner.user_name}
                                    </div>
                                </div>
                            </div>

                            <div className="text-black text-lg">
                                {user?.user_name === event.owner.user_name ? (
                                    <Button
                                        btnText="Edit"
                                        title="Edit event"
                                        onClick={() =>
                                            navigate(
                                                `/update/${event.event_id}`
                                            )
                                        }
                                        className="rounded-md text-white py-[4px] px-4 bg-[#4977ec] hover:bg-[#3b62c2]"
                                    />
                                ) : (
                                    <div className="flex gap-2 sm:gap-4">
                                        <Button
                                            btnText={
                                                event.isFollowed
                                                    ? 'Unfollow'
                                                    : 'Follow'
                                            }
                                            onClick={toggleFollow}
                                            className="rounded-md py-[5px] px-4 sm:px-6 text-white bg-[#4977ec] hover:bg-[#3b62c2]"
                                        />
                                        <Button
                                            btnText={
                                                !requestStatus ||
                                                requestStatus === 'rejected'
                                                    ? 'Collab'
                                                    : requestStatus ===
                                                        'accepted'
                                                      ? 'Chat'
                                                      : 'Request Sent'
                                            }
                                            onClick={handleCollab}
                                            className="rounded-md py-[5px] px-4 sm:px-6 text-white bg-[#4977ec] hover:bg-[#3b62c2]"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="mt-6" />

                {/* content */}
                <div className="text-black w-full text-md mt-6 bg-[#f9f9f9] shadow-md shadow-gray-300 rounded-xl overflow-hidden p-8">
                    {parse(event.event_content)}
                </div>
            </div>

            {/* Recommendations */}
            <div className="w-full">
                <hr className="mt-0 mb-6 w-full" />
                <h2 className="text-black underline underline-offset-4 mb-8">
                    Recommended Similar Events
                </h2>
                <div className="w-full">
                    <Recommendations category={event.category.category_name} />
                </div>
            </div>

            {/* comments */}
            <div className="w-full">
                <hr className="mt-2 mb-6 w-full" />
                <h2 className="text-black underline underline-offset-4 mb-8">
                    Comments & Reviews
                </h2>
                <div className="w-full">
                    <Comments />
                </div>
            </div>
        </div>
    );
}
