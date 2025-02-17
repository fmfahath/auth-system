import React, { useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const inputRef = useRef([])

    const inputHandler = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus()
        }
    }

    const keyDownhandler = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRef.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char;
            }
        })
    }

    const onSubmitHandler = (e) => {
        try {
            e.preventDefault();


        } catch (error) {

        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400'>
            <img src={assets.logo} alt='login-logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')} />
            <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitHandler}>
                <h1 className='text-white text-2xl text-semibold text-center mb-4'>Reset Password</h1>
                <p className='text-indigo-300 text-center mb-6'>Enter your email address</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.mail_icon} alt="person-icon" />
                    <input
                        className='bg-transparent outline-none text-white'
                        type="mail"
                        placeholder='Email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>Send Reset Email</button>
            </form>

            {/* OTP form */}
            <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl text-semibold text-center mb-4'>Verify Email</h1>
                <p className='text-indigo-300 text-center mb-6'>Enter the 6-digit code sent to your email ID</p>
                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            className='w-12 h-12 bg-[#333A5C] mb-8 rounded-md text-white text-center text-xl'
                            type='text'
                            maxLength='1'
                            key={index}
                            required
                            ref={e => inputRef.current[index] = e}
                            onInput={(e) => inputHandler(e, index)}
                            onKeyDown={(e) => keyDownhandler(e, index)}
                        />
                    ))}
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>Verify OTP</button>
            </form>

            {/* new password form */}
            <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl text-semibold text-center mb-4'>New Password</h1>
                <p className='text-indigo-300 text-center mb-6'>Enter your new password</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.lock_icon} alt="person-icon" />
                    <input
                        className='bg-transparent outline-none text-white'
                        type="password"
                        placeholder='Password'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>Submit</button>
            </form>

        </div>
    )
}

export default ResetPassword