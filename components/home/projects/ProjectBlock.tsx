import { ActiveLink } from "@/components/basic";
import Image from "next/image";

export default function ProjectBlock({
    name = "Project Name",
    description = "Description",
    link = "#",
    img = "",
}: {
    name: string;
    description: string;
    link: string;
    img: string;
}) {
    return (
        <ActiveLink href={link}>
            <div className="border-2 border-content-base rounded-2xl bg-base-200 p-4 hover:bg-base-300 transition-all">
                {/* <p className="text-sm my-2">Web App</p> */}
                <div className="relative w-full aspect-video">
                    {img ? (
                        <Image
                            src={img}
                            alt={name}
                            layout='fill'
                            objectFit='contain' />
                    ) : (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-base-300 via-base-100 to-base-300 flex items-center justify-center text-base-content/60 text-lg font-semibold tracking-[0.2em] uppercase">
                            {name.slice(0, 2)}
                        </div>
                    )}
                </div>
                <h3 className="text-md md:text-xl text-center mt-4 font-bold">{name}</h3>
                <p className="text-sm md:text-md text-center mt-4">{description}</p>
            </div>
        </ActiveLink>
        
    );
}