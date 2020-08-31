const GCP_CREDENTIALS = JSON.parse(process.env.GCP_CREDENTIALS || '');
const SB_BENCH_UPLOAD = process.env.SB_BENCH_UPLOAD === 'true';
const { CIRCLE_BRANCH, CIRCLE_SHA1 } = process.env;

export { SB_BENCH_UPLOAD, GCP_CREDENTIALS, CIRCLE_BRANCH, CIRCLE_SHA1 };
