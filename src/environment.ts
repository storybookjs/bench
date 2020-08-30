const GCP_CREDENTIALS = JSON.parse(process.env.GCP_CREDENTIALS || '');
const { CIRCLE_BRANCH, CIRCLE_SHA1 } = process.env;

export { GCP_CREDENTIALS, CIRCLE_BRANCH, CIRCLE_SHA1 };
