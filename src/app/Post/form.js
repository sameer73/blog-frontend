"use client";

import React, { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import { Label, Button } from "flowbite-react";
import { Accordion, Textarea,Select } from "flowbite-react";
import axiosInstance from "../axiosInstance";
import {  useRouter} from "next/navigation";
import Link from "next/link";
export default function PostForm({id}) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categoryJson, setCategoryJson] = useState({});
    const router = useRouter();
    
    const onSubmit = (data) =>{
        if(id){
            axiosInstance.put(`/api/posts/${id}/`,data).then(function(res){
                if(res.status===200){
                    router.push('/Post')
                }
            })
        }else{
            axiosInstance.post('/api/posts/',data).then(function(res){
                console.log(res)
                if(res.status==201){
                    router.push('/Post')
                }
            })
        }
    }
    const callCategory = (data)=>{
        axiosInstance.get('/api/category/',data).then(function(res){
            let response = res.data
            let results = response['results']
            let html = []
            let tmp = {}
            if(results.length>0){
                for (let index = 0; index < results.length; index++) {
                    const row = results[index];
                    tmp[row['name']] = row['id']
                    html.push(
                        <option key={row['id']} value={row['id']}>{row['name']}</option>
                    )
                    
                }
                
            }
            setCategoryOptions(html)
            setCategoryJson(tmp)
        })
    }
    useEffect(()=>{
        if(id){
            axiosInstance.get(`/api/posts/${id}`).then(function(res){
                if(res.status==200){
                    let data = res['data']
                    setValue('title',data['title'])
                    setValue('content',data['content'])
                    setValue('blog_url',data['blog_url'])
                    let cat = data['category']
                    cat = cat.join().split(',')
                    setValue('category',cat)
                    setValue('status',data['status'])
                }
            }) 
        }
    },[id,setValue,categoryJson])

    useEffect(()=>{
        callCategory()
    },[])
    
    return (
            <div className="container mx-auto my-4 px-5">
                <div  className= "flex flex-col items-center my-12">
                <Accordion className="w-full">
                    <Accordion.Panel>
                        <Accordion.Title className="p-3 rounded-t">Add New Post</Accordion.Title>
                        <Accordion.Content>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4">
                                <div>
                                    <Label htmlFor="title" className="text-black dark:text-black"  >Title</Label>
                                    <input type="text" {...register("title", { required: "Title is Required" })} id="title" name="title" placeholder="Title of post" 
                                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500  p-2.5 text-sm rounded-lg" />
                                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="blog_url" className="text-black dark:text-black">Post Url</Label>
                                    <input type="text" {...register("blog_url", { required: "url is Required" })} id="blog_url" name="blog_url" placeholder="URL of post" 
                                    className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500  p-2.5 text-sm rounded-lg" />
                                    {errors.blog_url && <span className="text-red-500">{errors.blog_url.message}</span>}
                                </div>
                                <div>
                                    <Label htmlFor="category" className="text-black dark:text-black"  >Category</Label>
                                    <Select multiple {...register("category", { required: "category is Required" })} 
                                    id="category" name="category">
                                        {categoryOptions}
                                    </Select>
                                    
                                    {errors.category && <span className="text-red-500">{errors.category.message}</span>}
                                </div>
                                <div>
                                    <Label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black ">Content</Label>
                                    <Textarea rows={15}  id="content" name="content" {...register("content", { required: "content is Required" })} 
                                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                    placeholder="Write your thoughts here..."></Textarea>
                                    {errors.content && <span className="text-red-500">{errors.content.message}</span>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="status" className="text-black dark:text-black">Publication Status</Label>
                                    <Select {...register("status", { required: "status is Required" })} 
                                    id="status" name="status">
                                        <option>--select--</option>
                                        <option value={'draft'}>Draft</option>
                                        <option value={'publish'}>Publish</option>
                                        <option value={'edit'}>Editor</option>
                                    </Select>
                                    
                                    {errors.category && <span className="text-red-500">{errors.category.message}</span>}
                                </div>
                                <div className="md:col-span-2 flex justify-between">
                                    <Link href={`/Post`} className="bg-background rounded text-white px-4 py-2">Back</Link>
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