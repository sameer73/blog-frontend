"use client"
import Image from "next/image";
import Header from './components/Header'
import Footer from "./components/Footer";
import React, { useEffect,useState } from "react";
import axiosInstance from "./axiosInstance";
import { Card,Accordion } from "flowbite-react";
export default function Home() {

  const [posts,setPosts] = useState([])
  const [categories,setCategories] = useState([])
  const callPosts = (data)=>{
    axiosInstance.get('/api/posts/',data).then(function(res){
        if(res.status==200){
          let response_data = res.data;
          let data = response_data['results']
          let html = []
          for (let index = 0; index < data.length; index++) {
            const row = data[index];
            html.push(<Card key={row['id']} href={`/Post/view/${row['blog_url']}`} className="w-full mb-5">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {row['title']}
              </h5>
              <p>Category{row['category']}</p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {row['content'].substring(0, 100) + "..."}
              </p>
            </Card>)
          }
          setPosts(html)
        }
    })
  }
  const callCategory = (data)=>{
    axiosInstance.get('/api/category/',data).then(function(res){
        let response = res.data
        let results = response['results']
        let html = []
        if(results.length>0){
            for (let index = 0; index < results.length; index++) {
                const row = results[index];
                html.push(
                  <p key={`cat_${row['id']}`} className="mb-2 text-gray-500 dark:text-gray-400">{row['name']}</p>    
                )
            }
        }else{
            html.push(
                <p className="mb-2 text-gray-500 dark:text-gray-400">No Data Found</p>
            )
        }
        setCategories(html)
    })
}
  useEffect(()=>{
    callPosts()
    callCategory()
  },[])
  return (
    <>
    <Header/>
    <div className="container md:container mx-auto bg-white">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 p-5 flex flex-col">
          {posts}
        </div>
        <div className="col-span-4 p-5 flex flex-col">
          <Accordion>
            <Accordion.Panel>
              <Accordion.Title className="rounded-t">Categories</Accordion.Title>
              <Accordion.Content>
                {categories}
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
