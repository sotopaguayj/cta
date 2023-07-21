import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

interface CardProps {
  id: string;
  email: string;
  password: string;
  image: string;
}

function CardComponent({ email: email, password: password, id: id, image: image }: CardProps) {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/cta/${id}`)
  };

  return (
    <Card onClick={handleClick}  sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {password}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CardComponent;
