
import React from "react";
import CategoryForm from "../../form";

export default async function Page({params}) {
    const {slug} = params;
    return (
        <>
            <CategoryForm id={slug}/>
        </>
    )
}
