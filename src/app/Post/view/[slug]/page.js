"use client"
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import axiosInstance from "@/app/axiosInstance";
import { CalendarIcon,UserCircleIcon } from '@heroicons/react/20/solid'
import { Label, Button,Textarea } from "flowbite-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
export default function ViewPost() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const params =  useParams();
    const [content,setContent] = useState('')
    const [data,setData] = useState({})
    const [comments,setComments] = useState([])
    const [postId,setPostId] = useState()
    const [login,setLogin] = useState(false)

    const check_token = (token) => {
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();
        if (expirationTime < currentTime) {
          return false;
        } else {
          return true;
        }
    };
    const onSubmit = (data) =>{
        data['post'] = postId
        axiosInstance.post('/api/comments/',data).then(function(res){
            console.log(res)
        })
    }
    useEffect(()=>{
        if(params.slug){
            let blog_url = params.slug
            axiosInstance.get('/api/get-blog/'+blog_url).then(function(res){
                if(res.status==200){
                    let data = res.data
                    let content = data.content
                    content = content.replaceAll('\n','<br/>')
                    setContent(content)
                    setData(data)
                    setPostId(data?.id)
                }
            })
            let access_token = localStorage.getItem('ct-access')
            if(access_token){
                let auth_token = check_token(access_token)
                setLogin(auth_token)
            }
        }
    },[params.slug])

    useEffect(()=>{
        if(postId){
            axiosInstance.get('/api/comments/?post_id='+postId).then(function(res){
                if(res.status==200){
                    let data = res.data
                    let comments = []
                    for (let index = 0; index < data['results'].length; index++) {
                        const row = data['results'][index];
                        comments.push(
                        <div key={`comment_${row['id']}`} className="bg-gray-50 p-3 mb-3">
                            <p className="text-black">Author:{row.user}</p>
                           <p className="text-black">{row.content}</p>
                        </div>)
                    }
                    setComments(comments)
                }
            })
        }
    },[postId])

    return (
        <div className="container md:container mx-auto bg-white">
            <div className="flex flex-col p-3 py-5">
                <h2 className="text-black text-4xl">{data?.title}</h2>
                <div className="flex flex-row text-black gap-4">
                    <span className="flex flex-row gap-2"><CalendarIcon className="size-5 text-gray-500"/>{data?.created_at}</span>
                    <span className="flex flex-row gap-2"><UserCircleIcon className="size-5 text-gray-500"/>{data?.author}</span>
                    <span className="flex flex-row gap-2">Categories: {data?.category_names}</span>
                </div>
                <div className="text-black" dangerouslySetInnerHTML={{__html:content}}/>
            </div>
            <div className="flex flex-col mt-5 p-3">
                <h2 className="text-black">Comments:</h2>
                {comments}
                {(login)? 
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4">
                    
                    <div>
                        <Label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black ">Comment</Label>
                        <Textarea rows={5}  id="content" name="content" {...register("content", { required: "content is Required" })} 
                        className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        placeholder="Write your thoughts here..."></Textarea>
                        {errors.content && <span className="text-red-500">{errors.content.message}</span>}
                    </div>
                    <div className="md:col-span-2 flex justify-between">
                        <Button type="submit" className="w-48 font-medium  bg-second">Add Comment</Button>
                    </div>
                </form>:<p className="text-black">Login to comment <Link href={'/Login'}>Login</Link></p>}
            </div>
        </div>
    )
}