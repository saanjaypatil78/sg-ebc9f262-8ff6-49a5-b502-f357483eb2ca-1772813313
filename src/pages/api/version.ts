import type { NextApiRequest, NextApiResponse } from "next";

type VersionResponse = {
  ok: true;
  name: string;
  now: string;
  vercel?: {
    gitCommitSha?: string;
    deploymentId?: string;
    env?: string;
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<VersionResponse>) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  res.status(200).json({
    ok: true,
    name: "bravecom-sunray",
    now: new Date().toISOString(),
    vercel: {
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
      env: process.env.VERCEL_ENV,
    },
  });
}