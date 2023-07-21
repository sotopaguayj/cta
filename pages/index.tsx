import ResponsiveAppBar from "@/components/nav";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import firebaseApp from "@/config/firebase";
import { Box } from "@mui/material";
import ClickableCard from '@/components/card'
import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
const db = getFirestore(firebaseApp);

interface HomeProps {
  ctas: Object[];
}

interface Cta {
  id: string;
  email: string;
  password: string;
  // Otras propiedades de tus datos
}

function Home({ ctas }: HomeProps) {
  return (
    <div>
      <ResponsiveAppBar />
      <Box marginTop={3}>
        {
          ctas.map((cta: Cta) => (
           <ClickableCard key={cta.id} email={cta.email} password={cta.password} id={cta.id} />
          ))
        }
      </Box>
    </div>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const querySnapshot = await getDocs(collection(db, "cta"));
  const ctas: Cta[] = [];
  querySnapshot.forEach((doc) => {
    const ctaData = doc.data() as Cta;
    const cta: Cta = { ...ctaData, id: doc.id } as Cta;
    ctas.push(cta);
  });
  return {
    props: {
      ctas,
    },
  };
};
