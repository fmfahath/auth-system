import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const { userData, backendUrl, setIsLoggedin, setUserData } = useContext(AppContent)

    const logout = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/logout')

            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="logo" className='w-28 sm:w-32' />
            {userData ?
                <div className='w-8 h-8 flex justify-center items-center rounded-full text-white bg-black relative group shadow-xl cursor-pointer'>
                    {userData.name[0].toUpperCase()}
                    <div className='absolute hidden group-hover:block text-black top-0 right-0 z-10 rounded pt-10 w-36 '>
                        <ul className='list-none m-0 p-2 bg-gray-100 text-sm shadow-md'>
                            {!userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
                            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Log Out</li>
                        </ul>
                    </div>
                </div>
                :
                <button className='flex 
            items-center 
            gap-2 
            border 
            border-gray-500 
            rounded-full 
            px-6 
            py-2 
            text-gray-800 
            hover:bg-gray-100 
            transition-all
            ' onClick={() => navigate('/login')}>Login <img src={assets.arrow_icon} alt='login-icon' />
                </button>
            }
        </div>
    )
}

export default Navbar