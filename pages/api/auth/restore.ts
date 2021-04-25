import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { KeyInfo, PrivateKey, Users } from '@textile/hub';

const THREADS_DB_NAME = 'tapes-thread-db';

const keyInfo: KeyInfo = {
  key: process.env.TEXTILE_API_KEY,
};

type NextApiRequestWithFormData = NextApiRequest & {
  file: any;
};

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "./public/uploads",
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });
const upload = multer();

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    console.log('!!! ERROR !!!:', error);
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('identity'));

apiRoute.post(async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  const identityString = req.file.buffer.toString('utf8');
  console.log('restore, identityString:', identityString);

  const identity = PrivateKey.fromString(identityString.trim());
  console.log('restore, identity:', identity);

  const user = await Users.withKeyInfo(keyInfo);
  const token = await user.getToken(identity);

  const dbThread = await user.getThread(THREADS_DB_NAME);
  console.log('restore, dbThread:', dbThread);

  res.status(200).json({ message: 'hello', token: identityString.trim() });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

// export default (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "POST") {
//     console.log("restore, req.body:", req.body);
//     res.status(200).json({ message: "hello" });
//   }
// };
