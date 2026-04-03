import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
        callback(null, path.join(__dirname, '../../public')) 
    },
    filename: (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
        const uniqueName = Date.now() + '-' + file.originalname
        callback(null, uniqueName)
    }
})

export const upload = multer({ storage })