"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label, Button } from "flowbite-react";
import { Accordion, Textarea } from "flowbite-react";
import axiosInstance from "../axiosInstance";
import {  useRouter} from "next/navigation";
import Link from "next/link";
export default function CategoryForm({id}) {
    const { register, handleSubmit,setValue, watch, formState: { errors } } = useForm();
    const router = useRouter();

    const onSubmit = (data) =>{
        if(id){
            axiosInstance.put(`/api/category/${id}/`,data).then(function(res){
                if(res.status===200){
                    router.push('/Category')
                }
            })
        }else{
            axiosInstance.post('/api/category/',data).then(function(res){
                console.log(res)
                if(res.status==201){
                    router.push('/Category')
                }
            })
        }
    }
    useEffect(()=>{
        if(id){
            axiosInstance.get(`/api/category/${id}/`).then(function(res){
                if(res.status==200){
                    let data = res['data']
                    setValue("name",data['name'])
                }
            })
        }
    },[id,setValue])
    return(
        <div className="container mx-auto my-4 px-5">
            <div  className= "flex flex-col items-center my-12">
                <Accordion className="w-full">
                    <Accordion.Panel>
                        <Accordion.Title className="p-3 rounded-t">Add New Post</Accordion.Title>
                        <Accordion.Content>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4">
                                <div>
                                    <Label htmlFor="name" className="text-black dark:text-black"  >Name</Label>
                                    <input type="text" {...register("name", { required: "name is Required" })} id="name" name="name" placeholder="Name of category" 
                                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500  p-2.5 text-sm rounded-lg" />
                                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                                </div>
                                
                                
                                <div className="md:col-span-2 flex justify-between">
                                    <Link href={`/Category`} className="bg-background rounded text-white px-4 py-2">Back</Link>
                                    <Button type="submit" className="w-48 font-medium  bg-second">Submit</Button>
                                </div>
                            </form>
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion>
            </div>
        </div>
    )

}