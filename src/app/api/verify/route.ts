import { NextRequest, NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const idImageFront = formData.get('idImageFront');
    const idImageBack = formData.get('idImageBack');
    const selfie = formData.get('selfie');


    return NextResponse.json(
        { success: true, message: 'Gender Confirmed' },
        { status: 200 }
    );
}