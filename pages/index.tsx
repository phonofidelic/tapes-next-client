import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios, { AxiosResponse } from 'axios';
import TokenUploader from '../components/TokenUploader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { db } from '../db';

// db.init();

export default function Home() {
  const [identityToken, setIdentiyToken] = useState('');

  const restoreIdentity = async (file) => {
    console.log('restoreIdentity, file:', file);
    const formData = new FormData();
    formData.append('identity', file);
    console.log('restoreIdentity, formData:', file);

    let response: AxiosResponse;

    try {
      response = await axios.post('/api/auth/restore', formData, {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        },
      });
    } catch (err) {
      console.error('Could not restore identity:', err);
    }

    console.log('sendIdentityString, response:', response.data);
    localStorage.setItem('tapes_identity', response.data.token);
    setIdentiyToken(response.data.token);
  };

  const loadDb = async () => {
    await db.init();
    const result = await db.find('Recording', {});
    console.log('loadDb, result:', result);
  };

  useEffect(() => {
    const token = localStorage.getItem('tapes_identity');
    if (token) {
      setIdentiyToken(token);
      loadDb();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Grid container>
          <Grid item xs={12}>
            <Paper>
              <div>Identity</div>
              {identityToken ? (
                <Typography style={{ maxWidth: 200 }} noWrap>
                  {identityToken}
                </Typography>
              ) : (
                <TokenUploader restoreIdentity={restoreIdentity} />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            Storage
          </Grid>
          <Grid item xs={12}>
            Data
          </Grid>
        </Grid>
      </main>

      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a> */}
      </footer>
    </div>
  );
}
