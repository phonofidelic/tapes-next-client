import React, { useCallback } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios, { AxiosResponse } from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles[0]);
    await restoreIdentity(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const restoreIdentity = async (file) => {
    console.log("restoreIdentity, file:", file);
    const formData = new FormData();
    formData.append("identity", file);
    console.log("restoreIdentity, formData:", file);

    let response: AxiosResponse;

    try {
      response = await axios.post("/api/auth/restore", formData, {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        },
      });
    } catch (err) {
      console.error("Could not restore identity:", err);
    }

    console.log("sendIdentityString, response:", response.data);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Grid container>
          <Grid item md={12}>
            <div>Identity</div>
            <div
              style={{
                width: "100%",
                height: 100,
                border: `4px dashed #ccc`,
                borderRadius: 4,
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} type="file" name="identity" />
              {isDragActive ? (
                <p>
                  Drop the <b>.token</b> file here ...
                </p>
              ) : (
                <p>
                  Drag and drop your <b>.token</b> file here, or click to select
                  files
                </p>
              )}
            </div>
            <div>
              <Button onClick={restoreIdentity}>Restore Identity</Button>
            </div>
          </Grid>
          <Grid item md={12}>
            Storage
          </Grid>
          <Grid item md={12}>
            Data
          </Grid>
        </Grid>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
