"use client"
import styles from './page.module.css'
import { use, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import localFont from '@next/font/local'

const avenir = localFont({
  src: [
    {
      path: '../../public/fonts/Metropolis-Light.otf',
      weight: '400'
    },
    {
      path: '../../public/fonts/Metropolis-Thin.otf',
      weight: '300'
    }
  ],
  variable: '--font-avenir'
})

const cachedFetches: any = {}
const cachedFetch = (name: string) => {
  if(!cachedFetches[name]){
    cachedFetches[name] = axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/hello?username=${name}`)
    .then( async (res: any) => {
      return {
      error: await res.data.error,
      data: await res.data.data 
    }});
  }
  return cachedFetches[name];
}

export default function Home() {

  const inputRef = useRef<HTMLInputElement>(null);
  const [ name, setUsername ] = useState('')
  const [ search, setSearched ] = useState<boolean>()
  const [ loading, setLoading ] = useState<boolean>(false)

  // const data: { data: { valid: string | boolean}, status: number, src?: string} = search ? use(cachedFetch(name)) : {status: 200, src: 'internal', data: {  valid: "Enter username for status..."}};
  const data: any = search ? use(cachedFetch(name)) : { data: "Enter username for status..."};

  const handleClick = () => {
    setSearched(false)
    const inputValue = inputRef.current?.value ?? '';
    console.log(inputValue);
    if(!inputValue){
      setSearched(false)
      return
    }
    setUsername(inputValue);
    setSearched(true);
    setLoading(true)
  }

  useEffect(() => {
    if(data.data !== "Enter username for status..." && loading === true){
      setLoading(false);
    }
  },[data.data, loading])


  return (
    <main className={styles.main}>
      <section className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <label htmlFor='username'>
          <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path opacity="0.1" d="M21.848 7.56H24.1328L20.7056 19.0656C20.5968 19.4192 20.5016 19.7864 20.42 20.1672C20.3656 20.5208 20.3384 20.8472 20.3384 21.1464C20.3384 21.364 20.42 21.5544 20.5832 21.7176C20.7464 21.8808 20.9776 21.9624 21.2768 21.9624C21.984 21.9624 22.7048 21.7176 23.4392 21.228C24.1736 20.7112 24.8264 20.0448 25.3976 19.2288C25.996 18.3856 26.4856 17.4336 26.8664 16.3728C27.2472 15.312 27.4376 14.2104 27.4376 13.068C27.4376 11.5176 27.1112 10.1032 26.4584 8.8248C25.8056 7.5464 24.9352 6.4448 23.8472 5.52C22.7864 4.5952 21.5624 3.8744 20.1752 3.3576C18.8152 2.8408 17.428 2.5824 16.0136 2.5824C14.2456 2.5824 12.5864 2.9496 11.036 3.684C9.4856 4.3912 8.1256 5.3432 6.956 6.54C5.8136 7.7368 4.9024 9.124 4.2224 10.7016C3.5424 12.252 3.2024 13.8704 3.2024 15.5568C3.2024 17.2432 3.5424 18.8752 4.2224 20.4528C4.9024 22.0032 5.8136 23.3768 6.956 24.5736C8.1256 25.7704 9.4856 26.736 11.036 27.4704C12.5864 28.1776 14.2456 28.5312 16.0136 28.5312C18.0536 28.5312 19.9984 28.096 21.848 27.2256C23.7248 26.3552 25.2208 25.1448 26.336 23.5944H28.9064C28.2536 24.7096 27.4648 25.716 26.54 26.6136C25.6152 27.484 24.5952 28.232 23.48 28.8576C22.3648 29.456 21.168 29.9184 19.8896 30.2448C18.6384 30.5712 17.3464 30.7344 16.0136 30.7344C13.9192 30.7344 11.9472 30.3536 10.0976 29.592C8.248 28.8032 6.6296 27.7288 5.2424 26.3688C3.8552 24.9816 2.7536 23.3632 1.9376 21.5136C1.1488 19.664 0.7544 17.6784 0.7544 15.5568C0.7544 13.4352 1.1488 11.4496 1.9376 9.6C2.7536 7.7504 3.8552 6.1456 5.2424 4.7856C6.6296 3.3984 8.248 2.324 10.0976 1.5624C11.9472 0.7736 13.9192 0.3792 16.0136 0.3792C17.8904 0.3792 19.672 0.692 21.3584 1.3176C23.0448 1.916 24.5136 2.7728 25.7648 3.888C27.0432 5.0032 28.0496 6.336 28.784 7.8864C29.5184 9.4096 29.8856 11.0824 29.8856 12.9048C29.8856 14.6728 29.5592 16.264 28.9064 17.6784C28.2808 19.0928 27.492 20.3032 26.54 21.3096C25.6152 22.316 24.6088 23.0912 23.5208 23.6352C22.4328 24.152 21.4264 24.4104 20.5016 24.4104C19.6856 24.4104 19.0328 24.22 18.5432 23.8392C18.0536 23.4584 17.7544 22.8464 17.6456 22.0032H17.564C16.9384 22.656 16.2312 23.2272 15.4424 23.7168C14.6536 24.1792 13.6608 24.4104 12.464 24.4104C10.7232 24.4104 9.3224 23.8528 8.2616 22.7376C7.2008 21.5952 6.6704 20.1128 6.6704 18.2904C6.6704 16.876 6.888 15.4888 7.3232 14.1288C7.7856 12.7416 8.4384 11.504 9.2816 10.416C10.1248 9.328 11.1312 8.4576 12.3008 7.8048C13.4704 7.1248 14.776 6.7848 16.2176 6.7848C17.224 6.7848 18.1352 7.0296 18.9512 7.5192C19.7944 8.0088 20.4336 8.8792 20.8688 10.1304H20.9504L21.848 7.56ZM19.5224 13.3128C19.5224 12.7416 19.4272 12.2112 19.2368 11.7216C19.0464 11.2048 18.8016 10.7696 18.5024 10.416C18.2032 10.0352 17.8496 9.7496 17.4416 9.5592C17.0608 9.3416 16.6528 9.2328 16.2176 9.2328C15.2384 9.2872 14.3272 9.6 13.484 10.1712C12.6408 10.7152 11.9064 11.4224 11.2808 12.2928C10.6824 13.136 10.2064 14.0744 9.8528 15.108C9.5264 16.1144 9.3632 17.0936 9.3632 18.0456C9.3632 19.188 9.7168 20.1264 10.424 20.8608C11.1584 21.5952 12.0832 21.9624 13.1984 21.9624C14.096 21.9624 14.9256 21.6768 15.6872 21.1056C16.4488 20.5072 17.1152 19.7728 17.6864 18.9024C18.2576 18.032 18.7064 17.0936 19.0328 16.0872C19.3592 15.0808 19.5224 14.156 19.5224 13.3128Z" fill="#18171D"/>
          </svg>
          </label>
          <input className={avenir.variable} name="username" type="text" ref={inputRef} placeholder="Enter username" />
          <button className={styles.button} onClick={() => handleClick()}>{ loading === false ? "Check now >" : "searching..."} </button>
        </div>
      </section>
      <section className={styles.responseSection}>
        {JSON.stringify(data)}
        {
          data?.data?.result === true && search ? (
          <div className={styles.reponseWrapper_success}>
          Username is available
          </div> ) : " " }
          
          { data?.data?.result === false && search ? (
          <div className={styles.reponseWrapper_error}>
          Username is unavailable
          </div> 
          ): ""
        }
        {
          !search &&
          <div className={styles.reponseWrapper}>
            Enter username for status...
          </div>
        }
        {  data?.error !== null && search ? (
            <div className={styles.reponseWrapper_error}>
            An Error occured. Please retry
            </div> 
            ): ''
        }
    
      </section>
   

    </main>
  )
}
