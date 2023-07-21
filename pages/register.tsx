import {
  TextField,
  Stack,
  Button,
  CircularProgress,
  Box,
} from "@mui/material/";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import ResponsiveAppBar from "@/components/nav";
import firebaseApp from "@/config/firebase";
import { storage } from "@/config/firebase";
import { collection, addDoc, getFirestore } from "firebase/firestore";

type formValues = {
  email: string;
  password: string;
  image: string | FileList;
};

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [pro, setPro] = useState(0);
  const db = getFirestore(firebaseApp);
  const router = useRouter();

  const userSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email is not valid")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    image: yup.mixed().required("Image is required"),
  });

  const form = useForm<formValues>({
    // @ts-ignore

    resolver: yupResolver(userSchema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleData = async (data: formValues) => {
    setIsLoading(true);
    const imagen = data.image[0];
    // @ts-ignore

    const imagenName = new Date().getTime() + imagen.name;
    const storageRef = ref(storage, imagenName);
    // @ts-ignore
    const upload = uploadBytesResumable(storageRef, imagen);

    const downloadURL = await new Promise<string>((resolve, reject) => {
      try {
        upload.on("state_changed", (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPro(progress);
          if (progress === 100) {
            resolve(getDownloadURL(upload.snapshot.ref));
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    try {
      data = { ...data, image: downloadURL };
      await handleSave(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = useCallback(
    async (data: formValues) => {
      try {
        await addDoc(collection(db, "cta"), data);
        Swal.fire({
          title: "CTA Saved",
          confirmButtonText: "Continue",
          allowEnterKey: false,
          allowOutsideClick: false,
        }).then(() => {
          router.push("/");
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [db, router]
  );

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
            <TextField
              label="Image"
              type="file"
              {...register("image")}
              error={!!errors.image}
              helperText={errors.image?.message}
            />
            <Button
              type={isLoading ? "button" : "submit"}
              variant="contained"
              color="primary"
            >
              {isLoading ? (
                <CircularProgress
                  variant="determinate"
                  value={pro}
                  color="inherit"
                />
              ) : (
                "Register"
              )}
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
