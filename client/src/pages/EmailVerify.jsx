import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

    const navigate = useNavigate()
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


    return (
        <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400'>
            <img src={assets.logo} alt='login-logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')} />
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
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>Verify Email</button>
            </form>
        </div>
    )
}

export default EmailVerify