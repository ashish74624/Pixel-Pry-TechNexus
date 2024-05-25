import connectMongoDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { NextResponse } from "next/server";

interface Params {
    email: string;
    folderName: string;
    imageName: string;
}

interface Props {
    params: Params;
}

export async function GET(request:Request,{ params }: Props) {
    const { email, folderName, imageName } = params;

    if (!email || !folderName || !imageName) {
        return NextResponse.json({ msg: "Invalid parameters" });
    }

    try {
        await connectMongoDB();

        const folder = await Folder.findOne({ email, folderName });
        if (!folder) {
            return NextResponse.json({ msg: 'Folder Not Found' });
        }

        const image = await Folder.findOne({
            email,
            folderName,
            imageName
        });

        if (!image) {
            return NextResponse.json({ msg: 'Image Not Found' });
        }

        const { versionName: version, generatedName } = image.imageCloud;

        return NextResponse.redirect(`https://res.cloudinary.com/deirqjd6e/image/upload/v${version}/${generatedName}`);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Couldn't get the requested Image" });
    }
}
