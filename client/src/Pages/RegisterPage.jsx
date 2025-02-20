import { useState } from 'react';
import { authService } from '../Services';
import { useUserContext } from '../Context';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../Components';
import { verifyExpression, fileRestrictions } from '../Utils';
import { LOGO, MAX_FILE_SIZE } from '../Constants/constants';
import { motion } from 'framer-motion';
import { icons } from '../Assets/icons';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        avatar: null,
        organization: '',
        coverImage: null,
        isOrganizer: false,
    });

    const [error, setError] = useState({
        root: '',
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        avatar: '',
        coverImage: '',
    });

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];

            if (!fileRestrictions(file)) {
                return toast.error(
                    `Only png, jpg/jpeg files are allowed and file size should not exceed ${MAX_FILE_SIZE} MB.`
                );
            }

            setInputs((prev) => ({ ...prev, [name]: file }));
        } else {
            name === 'avatar'
                ? setError((prevError) => ({
                      ...prevError,
                      avatar: 'Avatar is required.',
                  }))
                : setError((prevError) => ({ ...prevError, avatar: '' }));
        }
    }

    const handleBlur = (e) => {
        let { name, value } = e.target;
        if (value) {
            verifyExpression(name, value, setError);
        }
    };

    function onMouseOver() {
        if (
            Object.entries(inputs).some(
                ([key, value]) =>
                    !value && key !== 'coverImage' && key !== 'lastName'
            ) ||
            Object.entries(error).some(
                ([key, value]) => value !== '' && key !== 'root'
            )
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        try {
            const res = await authService.register(inputs);
            if (res && !res.message) {
                setUser(res);
                toast.success('Account created successfully');
                navigate('/');
            } else {
                setError((prev) => ({ ...prev, root: res.message }));
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const inputFields = [
        {
            type: 'text',
            name: 'userName',
            label: 'Username',
            placeholder: 'Enter user name',
            required: true,
        },
        {
            type: 'text',
            name: 'firstName',
            label: 'FirstName',
            placeholder: 'Enter first name',
            required: true,
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'LastName',
            placeholder: 'Enter last name',
            required: false,
        },
        {
            type: 'text',
            name: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
        },
        {
            type: showPassword ? 'text' : 'password',
            name: 'password',
            label: 'Password',
            placeholder: 'Create password',
            required: true,
        },
    ];

    const fileFields = [
        { name: 'avatar', label: 'Avatar', required: true },
        { name: 'coverImage', label: 'CoverImage', required: false },
    ];

    return (
        <div className="py-10 text-black flex flex-col items-center justify-start gap-4 overflow-y-scroll z-[1] bg-white fixed inset-0">
            <Link
                to={'/'}
                className="w-fit flex items-center justify-center hover:brightness-95"
            >
                <div className="overflow-hidden rounded-full size-[90px] drop-shadow-md">
                    <img
                        src={LOGO}
                        alt="peer connect logo"
                        className="object-cover size-full"
                    />
                </div>
            </Link>
            <div className="w-fit">
                <p className="text-center px-2 text-[28px] font-medium">
                    Create a new Account
                </p>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="relative -top-2 h-[0.05rem] bg-[#333333]"
                />
                <p className="w-full text-center text-[16px]">
                    Already have an account?{' '}
                    <Link
                        to={'/login'}
                        className="text-[#355ab6] hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>

            <div className="w-[400px] flex flex-col items-center justify-center gap-3">
                {error.root && (
                    <div className="text-red-500 w-full text-center">
                        {error.root}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-start justify-center gap-4 w-full"
                >
                    {inputFields.map((field) => (
                        <div key={field.name} className="w-full">
                            <label htmlFor={field.name}>
                                {field.required && (
                                    <span className="text-red-500">*</span>
                                )}{' '}
                                {field.label}:
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={field.placeholder}
                                className="shadow-md py-[15px] rounded-[5px] pl-[10px] w-full border-gray-500 bg-transparent"
                            />
                            {error[field.name] && (
                                <div className="mt-1 text-red-500 text-sm">
                                    {error[field.name]}
                                </div>
                            )}
                        </div>
                    ))}

                    {fileFields.map((field) => (
                        <div key={field.name} className="w-full">
                            <label htmlFor={field.name}>
                                {field.required && (
                                    <span className="text-red-500">*</span>
                                )}{' '}
                                {field.label}:
                            </label>
                            <input
                                type="file"
                                name={field.name}
                                id={field.name}
                                onChange={handleFileChange}
                                className="shadow-md py-[15px] rounded-[5px] pl-[10px] border-gray-500 w-full"
                            />
                        </div>
                    ))}

                    <div className="w-full flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isOrganizer"
                            name="isOrganizer"
                            checked={inputs.isOrganizer}
                            onChange={(e) =>
                                setInputs((prev) => ({
                                    ...prev,
                                    isOrganizer: e.target.checked,
                                }))
                            }
                        />
                        <label htmlFor="isOrganizer">
                            Are you an Organizer?
                        </label>
                    </div>

                    {inputs.isOrganizer && (
                        <div className="w-full">
                            <label htmlFor="organization">
                                Organization Name:
                            </label>
                            <input
                                type="text"
                                name="organization"
                                id="organization"
                                value={inputs.organization}
                                onChange={handleChange}
                                placeholder="Enter organization name"
                                className="shadow-md py-[15px] rounded-[5px] pl-[10px] w-full border-gray-500 bg-transparent"
                            />
                        </div>
                        
                    )}
                    <Button
                        type="submit"
                        className="text-white rounded-md py-2 mt-4 h-[45px] w-full bg-[#4977ec]"
                        disabled={disabled}
                        onMouseOver={onMouseOver}
                        btnText={loading ? icons.loading : 'Sign Up'}
                    />
                </form>
            </div>
        </div>
    );
}
