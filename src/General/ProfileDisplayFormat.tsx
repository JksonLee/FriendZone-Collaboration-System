import Typography from "@mui/material/Typography"
import names from "./Component"

const ProfileDisplayFormat: React.FC<any> = ({title, content}) => {
    return <div>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            {title}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', color: names.TextColor }}>
            <u>{content}</u>
        </Typography>
    </div>

}

export default ProfileDisplayFormat