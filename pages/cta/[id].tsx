import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  Box,
  LinearProgress,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Modal,
} from "@mui/material";
import firebaseApp from "@/config/firebase";
import ResponsiveAppBar from "@/components/nav";

type docsValue = {
  email: string;
  password: string;
  image: string;
  id: string;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Id() {
  const db = getFirestore(firebaseApp);
  const [data, setData] = useState<docsValue>();
  const [load, setLoad] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const id = router.query.id;

  const handleEdit = () => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const documentRef = doc(db, "cta", id);
      await deleteDoc(documentRef);
      router.push("/");
      handleClose();
      console.log("deleted");
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      setLoad(true);
      const colRef = collection(db, "cta");
      const snap = await getDocs(colRef);

      const docs = snap.docs.map((doc) => {
        const info = doc.data();
        info.id = doc.id;
        return info;
      });
      setData(docs.filter((doc) => doc.id === id));
      setLoad(false);
    })();
  }, [db, id]);

  return (
    <>
      <ResponsiveAppBar />
      {load && <LinearProgress />}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "85vh" }}
      >
        {data?.map((cta) => (
          <Card key={cta.id} sx={{ maxWidth: 500 }}>
            <CardMedia
              component="img"
              height="194"
              image={cta.image}
              alt="Paella dish"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {cta.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cta.password}
              </Typography>
              <Box sx={{ my: 1, display: "grid", gap: 1 }}>
                <Button
                  onClick={handleEdit}
                  color="primary"
                  variant="contained"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleOpen}
                  color="secondary"
                  variant="outlined"
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete this item?
          </Typography>
          <Button onClick={handleDelete} color="secondary" variant="outlined">
            Yes
          </Button>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            No
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Id;
