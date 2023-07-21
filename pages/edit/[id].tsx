import {
  TextField,
  Stack,
  Button,
  CircularProgress,
  LinearProgress,
  Box,
} from "@mui/material/";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "@/components/nav";
import firebaseApp from "@/config/firebase";
import {
  collection,
  doc,
  getFirestore,
  getDocs,
  updateDoc,
} from "firebase/firestore";

type formValues = {
  email: string;
  password: string;
};

export default function Id() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<formValues>();
  const [pro, setPro] = useState(0);
  const db = getFirestore(firebaseApp);
  const router = useRouter();
  const id = router.query.id;

  const userSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email is not valid")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const form = useForm<formValues>({
    resolver: yupResolver(userSchema),
    defaultValues: data,
  });
  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  const handleData = async (datax: formValues) => {
    try {
      // @ts-ignore
      const theDoc = doc(db, "cta", id);
      await updateDoc(theDoc, datax);
      Swal.fire({
        title: "CTA Updated",
        confirmButtonText: "Continue",
        allowEnterKey: false,
        allowOutsideClick: false,
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      console.log("ERROR:");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const colRef = collection(db, "cta");
      const snap = await getDocs(colRef);
      const docs = snap.docs.map((doc) => {
        const info = doc.data();
        info.id = doc.id;
        return info;
      });
      const filtered = docs.filter((doc) => doc.id === id);
      // @ts-ignore
      setData(filtered[0]);
      setValue("email", filtered[0]?.email);
      setValue("password", filtered[0]?.password);
      setIsLoading(false);
    })();
  }, [db, id]);
  if (isLoading) {
    return (
      <>
        <ResponsiveAppBar />
        <LinearProgress />
      </>
    );
  }
  return (
    <>
      <ResponsiveAppBar />
      <Box marginTop={3} display="flex" justifyContent="center">
        <form autoComplete="off" noValidate onSubmit={handleSubmit(handleData)}>
          <Stack spacing={2} width={400}>
            <TextField
              label="Email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type={isLoading ? "button" : "submit"}
              variant="contained"
              color="primary"
            >
              {isLoading ? <CircularProgress /> : "Update"}
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
