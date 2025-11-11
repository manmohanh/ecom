import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
mongoose.connect(db);

import {NextRequest,NextResponse as res} from "next/server"

export const POST = async (req:NextRequest)=>{
    try {
        
    } catch (error) {
        return serverCatchError(error)
    }
}