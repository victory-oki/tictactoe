import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ImageStyles } from './AvatarStyles';

type Props = {
    fileName: string
}

function Avatar({fileName}: Props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await import(`../../assets/avatars/${fileName}`) // change relative path to suit your needs
                setImage(response.default)
            } catch (err:any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchImage()
    }, [fileName])

    // const { loading, error, image } = useImage(fileName)

    const LoadImage = (image:any)=>(
        loading ? (
            <ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="1" fill="transparent" animationDuration=".5s"/>
        ) : (
            <ImageStyles
                src={image}
                alt= 'avatar'
            />
        )
    )

    return (
        <>
            {
                error? (<></>)
                :
                LoadImage(image)
            }

        </>
    )
}

export default Avatar
