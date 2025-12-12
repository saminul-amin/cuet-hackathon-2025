import {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";

const S3_ENDPOINT = process.env.S3_ENDPOINT || "http://localhost:9000";
const S3_REGION = process.env.S3_REGION || "us-east-1";
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "minioadmin";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "minioadmin";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "downloads";

// Initialize S3 Client
const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

const main = async () => {
  console.log(`Setting up S3 bucket: ${S3_BUCKET_NAME} at ${S3_ENDPOINT}...`);

  try {
    // Check if bucket exists
    try {
      await s3Client.send(
        new HeadBucketCommand({ Bucket: S3_BUCKET_NAME })
      );
      console.log(`Bucket ${S3_BUCKET_NAME} already exists.`);
      return;
    } catch (err: any) {
      if (err.name !== "NotFound" && err.$metadata?.httpStatusCode !== 404) {
        throw err;
      }
    }

    // Create Bucket
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: S3_BUCKET_NAME,
      })
    );
    console.log(`Bucket ${S3_BUCKET_NAME} created successfully.`);

    // Set Public Policy (optional but good for download access)
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${S3_BUCKET_NAME}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: S3_BUCKET_NAME,
        Policy: JSON.stringify(policy),
      })
    );
    console.log("Bucket policy set to public read.");

  } catch (err) {
    console.error("Error setting up S3:", err);
    process.exit(1);
  }
};

main();
