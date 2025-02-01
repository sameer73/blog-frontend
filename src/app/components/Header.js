'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  useEffect(()=>{
    let access_token = localStorage.getItem('ct-access')
    if(access_token){
      let auth_token = check_token(access_token)
      setLogin(auth_token)
    }
  },[])
  const logout = (e)=>{
    e.stopPropagation()
    localStorage.removeItem('ct-access')
    localStorage.removeItem('ct-refresh')
     window.location.href='/'
  }

  return (
    <header className="bg-white border border-b-1">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 ">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Container Grid</span>
            <img
              alt=""
              src="https://containergrid.de/wp-content/uploads/2021/07/CG-Transparent-2.png"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">

          <Link href="/" className="text-sm/6 font-semibold text-gray-900 mr-3">Home </Link> 
          {login ? 
          <>
              <Link href="/Post" className="text-sm/6 font-semibold text-gray-900 mr-3">Posts </Link>
              <Link href="/Category" className="text-sm/6 font-semibold text-gray-900 mr-3">Category </Link>
              <button onClick={(e)=>logout(e)} className="text-sm/6 font-semibold text-gray-900 mr-3">Logout </button>
          </>
          : (
            <Link href="/Login" className="text-sm/6 font-semibold text-gray-900 mr-3">Log in <span aria-hidden="true">&rarr;</span></Link>
          )}
        </div>
      </nav>
      
    </header>
  )
}
