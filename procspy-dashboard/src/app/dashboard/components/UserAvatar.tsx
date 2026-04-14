'use client'

interface UserAvatarProps {
    name: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
}

const UserAvatar = ({ name, size = 'md' }: UserAvatarProps) => {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <div
            className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold select-none shrink-0`}
        >
            {initials}
        </div>
    )
}

export default UserAvatar
