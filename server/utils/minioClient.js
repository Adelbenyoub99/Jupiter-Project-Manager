const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, CreateBucketCommand, HeadBucketCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const logger = require('./logger');

const s3Client = new S3Client({
    endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
    region: "us-east-1", // MinIO doesn't strictly enforce regions, but SDK requires one
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
});

const bucketName = process.env.MINIO_BUCKET || "jupiter-storage";

// Initialize bucket if it doesn't exist
const initBucket = async () => {
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        logger.info(`MinIO: Bucket "${bucketName}" already exists.`);
    } catch (error) {
        if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
            try {
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
                logger.info(`MinIO: Bucket "${bucketName}" created successfully.`);
            } catch (createError) {
                logger.error("MinIO: Error creating bucket:", createError);
            }
        } else {
            logger.error("MinIO: Error checking bucket existence:", error);
        }
    }
};

/**
 * Upload a file to MinIO
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Destination file name
 * @param {string} mimeType - File mime type
 * @returns {Promise<string>} - The object key
 */
const uploadFile = async (fileBuffer, fileName, mimeType) => {
    const key = `${Date.now()}-${fileName}`;
    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
        }));
        return key;
    } catch (error) {
        logger.error("MinIO: Upload error:", error);
        throw error;
    }
};

/**
 * Get a presigned URL for a file
 * @param {string} key - The object key
 * @returns {Promise<string>} - Presigned URL
 */
const getFileUrl = async (key) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    } catch (error) {
        logger.error("MinIO: Error generating signed URL:", error);
        throw error;
    }
};

/**
 * Delete a file from MinIO
 * @param {string} key - The object key
 */
const deleteFile = async (key) => {
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        }));
    } catch (error) {
        logger.error("MinIO: Delete error:", error);
        throw error;
    }
};

module.exports = {
    s3Client,
    initBucket,
    uploadFile,
    getFileUrl,
    deleteFile
};
