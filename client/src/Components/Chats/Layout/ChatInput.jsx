import { useRef, useState, useEffect } from 'react';
import { Button, InputFilePreview } from '../..';
import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '../../../Assets/icons';
import { fileSizeRestriction } from '../../../Utils';
import { chatService } from '../../../Services';
import { useSocketContext } from '../../../Context';
import toast from 'react-hot-toast';
import { MAX_FILE_SIZE } from '../../../Constants/constants';

export default function ChatInput() {
    const [message, setMessage] = useState({
        attachments: [],
        text: '',
    });
    const { socket } = useSocketContext();
    const { chatId } = useParams();
    const [typing, setTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const attachmentRef = useRef();
    const [attachmentPreviews, setAttachmentPreviews] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef();

    // auto focus input field
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatId]);

    async function handleSend(e) {
        e.preventDefault();

        if (!message.text.trim() && message.attachments.length === 0) {
            return toast.error('Message cannot be empty');
        }

        try {
            setLoading(true);
            const res = await chatService.sendMessage(chatId, message);
            if (res && !res.message) {
                setTyping(false);
                socket.emit('stoppedTyping', chatId);
            } else {
                toast.error(res.message || 'Failed to send message');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setMessage({ text: '', attachments: [] });
            setAttachmentPreviews([]);
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value, files = [], type } = e.target;
        if (type === 'file' && files.length) {
            if (message.attachments.length + files.length > 5) {
                return toast.error('Maximum 5 attachments are allowed');
            }

            const newAttachments = [];
            const newPreviews = [];

            for (let file of files) {
                if (!fileSizeRestriction(file)) {
                    toast.error(
                        `File size should not exceed ${MAX_FILE_SIZE} MB`
                    );
                    continue;
                }

                newAttachments.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }

            setMessage((prev) => ({
                ...prev,
                attachments: [...prev.attachments, ...newAttachments],
            }));
            setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
        } else {
            setMessage((prev) => ({ ...prev, [name]: value }));

            // Emit typing event
            if (value.trim() && !typing) {
                setTyping(true);
                socket.emit('typing', chatId);
            } else if (!value.trim() && typing) {
                setTyping(false);
                socket.emit('stoppedTyping', chatId);
            }
        }
    }

    function removeAttachment(index) {
        setMessage((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
        setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <div className="overflow-scroll">
            {/* Previews */}
            {attachmentPreviews.length > 0 && (
                <div className="flex space-x-4 items-center p-4 w-[calc(100%-300px)] overflow-x-scroll absolute bottom-[60px]">
                    {attachmentPreviews.map((file, i) => (
                        <InputFilePreview
                            file={message.attachments[i]}
                            previewURL={file}
                            key={i}
                            index={i}
                            removeAttachment={removeAttachment}
                        />
                    ))}
                </div>
            )}

            {/* form */}
            <form
                onSubmit={handleSend}
                className="w-full px-6 h-[60px] border-t border-gray-200 flex items-center space-x-6"
            >
                {/* emoji Icon */}
                <Button
                    className="group"
                    title="emoji"
                    btnText={
                        <div className="size-6 fill-none stroke-[#434343] hover:stroke-[#4977ec]">
                            {icons.emoji}
                        </div>
                    }
                />

                {/* attachment Field */}
                <input
                    type="file"
                    name="attachment"
                    onChange={handleChange}
                    ref={attachmentRef}
                    className="hidden"
                    multiple
                />

                {/* Attachment Icon */}
                <Button
                    className="group"
                    title="Attachment"
                    onClick={() => attachmentRef.current.click()}
                    btnText={
                        <div className="size-6 fill-none stroke-[#434343] hover:stroke-[#4977ec]">
                            {icons.link}
                        </div>
                    }
                />

                {/* Input Field */}
                <div className="w-full">
                    <input
                        type="text"
                        ref={inputRef}
                        name="text"
                        value={message.text}
                        onChange={handleChange}
                        placeholder="Type a message..."
                        className="w-full flex-1 px-1 py-2 bg-transparent border-b-2 placeholder:text-[#4b4b4b] border-gray-300 focus:outline-none focus:border-b-2 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Send Button */}
                <Button
                    title="send"
                    type="submit"
                    disabled={loading}
                    className="group"
                    btnText={
                        loading ? (
                            <div className="size-[20px] fill-[#4977ec] dark:text-[#ececec]">
                                {icons.loading}
                            </div>
                        ) : (
                            <div className="group-hover:stroke-[#4977ec] size-6 fill-none stroke-[#434343]">
                                {icons.send}
                            </div>
                        )
                    }
                />
            </form>
        </div>
    );
}
