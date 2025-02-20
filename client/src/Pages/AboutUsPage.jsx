import { CONTRIBUTORS } from '../Constants/constants';
import { Link } from 'react-router-dom';

export default function AboutUsPage() {
    const members = CONTRIBUTORS.map((contributor) => (
        <div
            key={contributor.name}
            className="flex flex-col gap-3 items-center justify-center"
        >
            <div className="drop-shadow-xl hover:brightness-90">
                <div className="size-[100px] rounded-full overflow-hidden">
                    <img
                        src={contributor.image}
                        alt="contributor profile image"
                        className="size-full object-cover"
                    />
                </div>
            </div>
            <div className="w-full text-center font-semibold text-xl">
                {contributor.name}
            </div>
        </div>
    ));

    return (
        <div className="w-full flex items-start justify-center">
            <div className="w-[90%]">
                <h1 className="w-full font-semibold text-center mb-6">
                    About Us
                </h1>
                <p className="text-md">
                    Welcome to EventConnect, your go-to platform for
                    discovering, organizing, and participating in exciting
                    events! We aim to bring people together by providing a
                    seamless experience for exploring and managing events,
                    whether they are cultural festivals, tech meetups, college
                    fests, or professional conferences.
                </p>
                <hr className="my-6" />
                <h2 className="w-full text-center my-6">Our Mission</h2>
                <p className="text-md">
                    Our mission is to simplify event management and discovery by
                    creating an interactive space where users can explore
                    upcoming events, register with ease, and stay updated with
                    real-time notifications. Whether you are an organizer
                    looking for an efficient way to promote your event or an
                    attendee eager to find new experiences, EventConnect is here
                    for you!
                </p>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Why We Started?</h2>
                <p className="text-md">
                    We noticed that many event organizers face challenges in
                    reaching their target audience, and attendees often struggle
                    to find events that match their interests. To bridge this
                    gap, we built EventConnect—a dynamic platform that connects
                    event hosts with attendees, making event management more
                    accessible and engaging.
                </p>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">What We Do</h2>
                <ul>
                    <li>
                        <strong>Event Listings:</strong> Easily browse and
                        filter events based on categories like technology,
                        music, education, sports, and more.
                    </li>
                    <li>
                        <strong>Seamless Registration:</strong> Sign up for
                        events with a single click and get instant confirmation.
                        Event Hosting: Organizers can create, manage, and
                        promote their events effortlessly.
                    </li>
                    <li>
                        <strong>Community Interaction:</strong> Engage with
                        fellow attendees, share experiences, and stay updated
                        with real-time event notifications.
                    </li>
                </ul>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Meet the Team</h2>
                <p className="text-md">
                    We are a team of passionate individuals dedicated to
                    enhancing event experiences for both organizers and
                    attendees. With a shared vision of making event management
                    seamless and efficient, we strive to bring people together
                    through events that matter. Let me know if you'd like any
                    further customizations! 🚀🎉
                </p>
                <div className="mt-10 flex flex-wrap justify-evenly gap-4 w-full">
                    {members}
                </div>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Privacy Policy</h2>
                <p className="text-md">
                    Your privacy is important to us. Below is our Privacy Policy
                    outlining how we handle your data:
                </p>
                <ul>
                    <li>
                        <strong>Data Collection:</strong> We collect personal
                        information like your name, email address, and any other
                        details you provide when registering or commenting on
                        the blog.
                    </li>
                    <li>
                        <strong>Data Use:</strong> Your personal data is used
                        solely for the purpose of enabling you to interact with
                        the blog (e.g., posting comments, subscribing to
                        updates).
                    </li>
                    <li>
                        <strong>Third-Party Services:</strong> We may use
                        third-party services like Google Analytics to help us
                        understand how users interact with our website. These
                        services may collect data such as IP addresses and
                        device information.
                    </li>
                    <li>
                        <strong>Cookies:</strong> Our website uses cookies to
                        enhance your experience. By using the site, you agree to
                        our use of cookies.
                    </li>
                    <li>
                        <strong>Security:</strong> We take the security of your
                        personal information seriously. We use standard industry
                        practices to protect your data.
                    </li>
                    <li>
                        <strong>Opt-Out:</strong> If you no longer wish to
                        receive communications from us, you can opt out at any
                        time by clicking the "Unsubscribe" link in our emails.
                    </li>
                </ul>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Contact Us</h2>
                <p className="text-md">
                    If you have any questions or would like to collaborate, feel
                    free to connect with us on{' '}
                    <Link
                        className="text-[#3547ec] font-medium hover:underline"
                        target="_blank"
                        to={'https://discord.com/channels/@sania_singla'}
                    >
                        Discord
                    </Link>
                    . We would love to hear from you!!
                </p>
            </div>
        </div>
    );
}
