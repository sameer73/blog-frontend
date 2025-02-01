import React from "react";
import PostForm from "../../form";

export default async function EditPost({params}) {
    
    const {slug} = await params;
    return (
        <>
            <PostForm id={slug}/>
        </>
    )
}