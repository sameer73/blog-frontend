"use client";

import React, { useEffect, useState } from "react";

import axiosInstance from "../axiosInstance";
import { Table } from "flowbite-react";
import Link from "next/link";
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { TrashIcon,PencilSquareIcon } from '@heroicons/react/20/solid'
export default function Post() {
    const [tableRow,setTableRow] = useState([])
    const [totalCount,setTotalCount] = useState(0)

    const callPosts = (data)=>{
        axiosInstance.get('/api/posts/',data).then(function(res){
            
            let response = res.data
            setTotalCount(response['count'])
            let results = response['results']
            let html = []
            if(results.length>0){
                for (let index = 0; index < results.length; index++) {
                    const row = results[index];
                    
                    
                    html.push(
                        <Table.Row key={row['id']} className="bg-white dark:border-gray-700 dark:bg-white ">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-black p-3">{row['title']}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-black p-3">{row['status']}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-black p-3">{row['category_names'].join(', ')}</Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-black p-3">{row['created_at']}</Table.Cell>
                            <Table.Cell className="flex flex-row p-3">
                                <Link href={`/Post/edit/${row['id']}`} className="mr-2" ><PencilSquareIcon className="size-5 text-gray-500"/></Link>
                                <button onClick={(e)=>deletePost(e,row['id'])}><TrashIcon className="size-5 text-gray-500"/></button>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
                
            }else{
                html.push(
                    <Table.Row key="10" className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell colSpan={5} className="p-4 text-center">No Data Found</Table.Cell>
                    </Table.Row>
                )
            }
            setTableRow(html)
        })
    }

    const deletePost = (e,id) => {
        e.stopPropagation()
        axiosInstance.delete(`/api/posts/${id}`).then(function(res){
            if(res.status===204){
                callPosts()
            }
        })
    }


    useEffect(()=>{
        let data =  {"page":1}
        callPosts(data)
    },[])
    
    return (
        <div className="container mx-auto my-4 px-5">
            <div  className= "flex flex-col items-center my-12 ">
                <div className="flex w-full justify-end mb-4">
                    <Link className='bg-second px-5 py-3 rounded'href={'/Post/add/'}>Add Post</Link>
                </div>
                <div className="overflow-x-auto w-full border border-gray-200 rounded shadow-md">
                    <Table className="rounded">
                        <Table.Head>
                            <Table.HeadCell className="text-white">Title</Table.HeadCell>
                            <Table.HeadCell className="text-white">Status</Table.HeadCell>
                            <Table.HeadCell className="text-white">Category</Table.HeadCell>
                            <Table.HeadCell className="text-white">Created On</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {tableRow.length==0 ?
                            <Table.Row>
                                <Table.Cell colSpan={8}>
                                    <div className="w-screen">
                                        <SkeletonTheme baseColor="#fff" highlightColor="#ff7959">
                                            <div className="flex flex-col gap-4">
                                                <Skeleton containerClassName='w-full' count={2} className='w-full min-h-8'/>
                                                <Skeleton containerClassName='w-full' count={2} className='w-full min-h-8'/>
                                            </div>
                                        </SkeletonTheme>
                                    </div>
                                </Table.Cell>
                            </Table.Row>   :tableRow
                            }
                        </Table.Body>
                    </Table>
                </div>
                <p className="text-gray-500 text-left w-full mt-5">Total Records: {totalCount}</p>
            </div>
        </div>
    )
}