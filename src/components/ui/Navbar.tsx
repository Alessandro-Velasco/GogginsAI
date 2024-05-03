import Link from 'next/link';
import React from 'react'

const routes = [
    {
        name: "Chat",
        path: "/",
    },
    {
        name: "Profile",
        path: "/profile",
    },
];

function Navbar() {
  return (
    <div className='p-4 flex flex-row justify-between items-center bg-black text-white'>
        <Link href="/">
            <h1 className='text-2xl font-bold'>Goggins AI</h1>
        </Link>
        <div>
            
            <Link href="/about">
                <a className="mr-4">About</a>
            </Link>
        </div>

    </div>
  )
}

export default Navbar;