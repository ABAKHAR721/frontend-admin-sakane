'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './UserDisplay.module.css'
import unavailableImage from '../../../public/notfound.png'    

export default function UserDisplay() {
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    return (
        <div className={styles.container}>
            <Image
                src={unavailableImage}
                alt="Content Unavailable"
                width={100}
                height={100}
                className={styles.image}
            />
            <h1 className={styles.heading}>
                Content Unavailable
            </h1>
            <p className={styles.message}>
                We're sorry, the content you're looking for is currently unavailable. Please check back later.
            </p>
            <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}