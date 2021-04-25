import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { KeyInfo, PrivateKey, Buckets } from '@textile/hub';

const keyInfo: KeyInfo = {
  key: process.env.TEXTILE_API_KEY,
};

const route = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { identityString } = req.body;
  console.log('getBucketToken, itentityString:', identityString);

  const buckets = await Buckets.withKeyInfo(keyInfo, { debug: true });
  const identity = await PrivateKey.fromString(identityString);
  const token = await buckets.getToken(identity);

  res.status(200).json({ message: 'ok', token });
});

export default route;
